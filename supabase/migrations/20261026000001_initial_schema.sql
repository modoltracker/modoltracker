-- =============================================================================
-- MODOLTRACKER: INITIAL SCHEMA MIGRATION (FASE 1 🟢 + FASE 2-4 🟡 PLACEHOLDERS)
-- Jalankan file ini di Supabase SQL Editor atau via `supabase db push`
-- =============================================================================

create extension if not exists postgis;
create extension if not exists pg_trgm;

-- ENUMS
do $$ begin
  create type place_category as enum (
    'gas_station','minimarket','mosque','mall','restaurant','cafe','rest_area',
    'public_toilet','office','hospital','station','airport','campus','other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type place_status as enum ('unverified','verified','closed','removed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type visibility as enum ('public','friends','private');
exception when duplicate_object then null; end $$;

do $$ begin
  create type friend_status as enum ('pending','accepted','declined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type fee_type as enum ('free','paid','donation','unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_target as enum ('place','review','checkin','photo','profile','comment');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_status as enum ('open','reviewing','resolved','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type live_status as enum ('no_water','long_queue','cleaning','closed','out_of_order','very_clean');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('user','moderator','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type claim_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

-- =============================================================================
-- TABEL FASE 1 🟢
-- =============================================================================

create table if not exists profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  username              text unique not null check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name          text,
  avatar_url            text,
  bio                   text check (char_length(bio) <= 160),
  role                  user_role not null default 'user',
  is_private            boolean not null default false,
  default_visibility    visibility not null default 'friends',
  feed_delay_hours      int not null default 2 check (feed_delay_hours between 0 and 24),
  locale                text not null default 'id',
  active_title          text,
  is_premium            boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists places (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text unique,
  category         place_category not null,
  lat              double precision not null,
  lng              double precision not null,
  location         geography(point, 4326) generated always as (ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) stored,
  address          text,
  city             text,
  province         text,
  status           place_status not null default 'unverified',
  source           text not null default 'user',
  osm_id           text unique,
  has_squat        boolean default false,
  has_sitting      boolean default false,
  has_jet_washer   boolean default false,
  has_bucket       boolean default false,
  has_tissue       boolean default false,
  has_soap         boolean default false,
  has_sink         boolean default false,
  is_accessible    boolean default false,
  has_baby_change  boolean default false,
  has_shower       boolean default false,
  has_prayer_room  boolean default false,
  gender_separated boolean default false,
  fee_type         fee_type not null default 'unknown',
  fee_amount       int,
  is_24h           boolean default false,
  opening_hours    jsonb,
  avg_rating       numeric(2,1),
  avg_cleanliness  numeric(2,1),
  avg_water        numeric(2,1),
  review_count     int not null default 0,
  checkin_count    int not null default 0,
  claimed_by       uuid references profiles(id),
  is_verified_clean boolean not null default false,
  created_by       uuid references profiles(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists places_location_gix on places using gist (location);
create index if not exists places_name_trgm on places using gin (name gin_trgm_ops);

create table if not exists checkins (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  place_id        uuid references places(id) on delete set null,
  lat             double precision not null,
  lng             double precision not null,
  location        geography(point, 4326) generated always as (ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) stored,
  city            text,
  province        text,
  visibility      visibility not null default 'friends',
  note            text check (char_length(note) <= 280),
  in_private_zone boolean not null default false,
  visible_at      timestamptz not null default now(),
  created_at      timestamptz not null default now()
);
create index if not exists checkins_user_idx on checkins (user_id, created_at desc);
create index if not exists checkins_place_idx on checkins (place_id);
create index if not exists checkins_location_gix on checkins using gist (location);

create table if not exists reviews (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references profiles(id) on delete cascade,
  place_id             uuid not null references places(id) on delete cascade,
  checkin_id           uuid references checkins(id) on delete set null,
  rating_cleanliness   smallint not null check (rating_cleanliness between 1 and 5),
  rating_water         smallint not null check (rating_water between 1 and 5),
  rating_privacy       smallint check (rating_privacy between 1 and 5),
  rating_smell         smallint check (rating_smell between 1 and 5),
  rating_supplies      smallint check (rating_supplies between 1 and 5),
  overall_rating       numeric(2,1) not null default 4.0,
  body                 text check (char_length(body) <= 1000),
  is_location_verified boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (user_id, place_id)
);

create table if not exists friendships (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid not null references profiles(id) on delete cascade,
  addressee_id  uuid not null references profiles(id) on delete cascade,
  status        friend_status not null default 'pending',
  created_at    timestamptz not null default now(),
  responded_at  timestamptz,
  check (requester_id <> addressee_id)
);
create unique index if not exists friendships_pair_uq on friendships
  (least(requester_id, addressee_id), greatest(requester_id, addressee_id));

create table if not exists blocks (
  blocker_id  uuid not null references profiles(id) on delete cascade,
  blocked_id  uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table if not exists private_zones (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  label       text not null default 'Rumah',
  lat         double precision not null,
  lng         double precision not null,
  center      geography(point, 4326) generated always as (ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) stored,
  radius_m    int not null default 500 check (radius_m between 200 and 1000),
  created_at  timestamptz not null default now()
);

create table if not exists reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references profiles(id) on delete cascade,
  target_type  report_target not null,
  target_id    uuid not null,
  reason       text not null,
  details      text,
  status       report_status not null default 'open',
  resolved_by  uuid references profiles(id),
  created_at   timestamptz not null default now()
);

create table if not exists feature_flags (
  key           text primary key,
  enabled       boolean not null default false,
  rollout_pct   int not null default 0 check (rollout_pct between 0 and 100),
  allowed_roles user_role[] default '{admin}',
  description   text,
  updated_at    timestamptz not null default now()
);

-- =============================================================================
-- TABEL FASE 2-4 🟡 (DISIAPKAN SEJAK AWAL)
-- =============================================================================

create table if not exists reactions (
  checkin_id  uuid not null references checkins(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  emoji       text not null check (emoji in ('💩','😂','🫡','🤢')),
  created_at  timestamptz not null default now(),
  primary key (checkin_id, user_id)
);

create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  checkin_id  uuid not null references checkins(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  body        text not null check (char_length(body) <= 300),
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create table if not exists badges (
  code         text primary key,
  name         text not null,
  description  text,
  icon         text,
  tier         smallint default 1,
  criteria     jsonb not null,
  is_active    boolean not null default true
);

create table if not exists user_badges (
  user_id     uuid not null references profiles(id) on delete cascade,
  badge_code  text not null references badges(code),
  earned_at   timestamptz not null default now(),
  primary key (user_id, badge_code)
);

create table if not exists place_photos (
  id           uuid primary key default gen_random_uuid(),
  place_id     uuid not null references places(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  storage_path text not null,
  moderation   text not null default 'pending',
  created_at   timestamptz not null default now()
);

create table if not exists place_status_reports (
  id            uuid primary key default gen_random_uuid(),
  place_id      uuid not null references places(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  status        live_status not null,
  confirmations int not null default 0,
  expires_at    timestamptz not null default now() + interval '3 hours',
  created_at    timestamptz not null default now()
);

create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  type        text not null,
  payload     jsonb not null default '{}',
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists push_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  platform    text not null,
  token       text not null unique,
  created_at  timestamptz not null default now()
);

create table if not exists invites (
  code        text primary key,
  inviter_id  uuid not null references profiles(id) on delete cascade,
  uses        int not null default 0,
  max_uses    int,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists challenges (
  id          uuid primary key default gen_random_uuid(),
  creator_id  uuid not null references profiles(id) on delete cascade,
  title       text not null,
  rule        jsonb not null,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  created_at  timestamptz not null default now()
);

create table if not exists challenge_participants (
  challenge_id uuid not null references challenges(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  score        int not null default 0,
  joined_at    timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

create table if not exists trips (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  origin      geography(point, 4326) not null,
  destination geography(point, 4326) not null,
  route       geography(linestring, 4326),
  created_at  timestamptz not null default now()
);

create table if not exists wrapped_reports (
  user_id      uuid not null references profiles(id) on delete cascade,
  year         int not null,
  data         jsonb not null,
  generated_at timestamptz not null default now(),
  primary key (user_id, year)
);

create table if not exists health_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  checkin_id  uuid references checkins(id) on delete set null,
  bristol     smallint check (bristol between 1 and 7),
  note        text,
  logged_at   timestamptz not null default now()
);

create table if not exists place_claims (
  id            uuid primary key default gen_random_uuid(),
  place_id      uuid not null references places(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  business_name text not null,
  evidence_url  text,
  status        claim_status not null default 'pending',
  reviewed_by   uuid references profiles(id),
  created_at    timestamptz not null default now()
);

create table if not exists review_replies (
  id          uuid primary key default gen_random_uuid(),
  review_id   uuid not null unique references reviews(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  body        text not null check (char_length(body) <= 1000),
  created_at  timestamptz not null default now()
);

create table if not exists subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references profiles(id) on delete cascade,
  place_id           uuid references places(id) on delete cascade,
  plan               text not null,
  status             text not null,
  provider           text,
  current_period_end timestamptz,
  created_at         timestamptz not null default now()
);

-- =============================================================================
-- FUNGSI, TRIGGER & RLS
-- =============================================================================

create or replace function are_friends(user_a uuid, user_b uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from friendships
    where status = 'accepted'
      and ((requester_id = user_a and addressee_id = user_b)
        or (requester_id = user_b and addressee_id = user_a))
  );
$$;

create or replace function is_blocked(user_a uuid, user_b uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from blocks
    where (blocker_id = user_a and blocked_id = user_b)
       or (blocker_id = user_b and blocked_id = user_a)
  );
$$;

create or replace function can_view_checkin(viewer uuid, target_checkin checkins)
returns boolean language plpgsql stable security definer as $$
begin
  if viewer is not null and viewer = target_checkin.user_id then
    return true;
  end if;
  if target_checkin.in_private_zone or target_checkin.visibility = 'private' then
    return false;
  end if;
  if viewer is not null and is_blocked(viewer, target_checkin.user_id) then
    return false;
  end if;
  if target_checkin.visible_at > now() then
    return false;
  end if;
  if target_checkin.visibility = 'public' then
    return true;
  end if;
  if target_checkin.visibility = 'friends' and viewer is not null then
    return are_friends(viewer, target_checkin.user_id);
  end if;
  return false;
end;
$$;

create or replace function calc_review_overall()
returns trigger language plpgsql as $$
declare
  total numeric := new.rating_cleanliness + new.rating_water;
  cnt int := 2;
begin
  if new.rating_privacy is not null then total := total + new.rating_privacy; cnt := cnt + 1; end if;
  if new.rating_smell is not null then total := total + new.rating_smell; cnt := cnt + 1; end if;
  if new.rating_supplies is not null then total := total + new.rating_supplies; cnt := cnt + 1; end if;
  new.overall_rating := round(total / cnt, 1);
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_calc_review_overall on reviews;
create trigger trg_calc_review_overall
before insert or update on reviews
for each row execute function calc_review_overall();

create or replace function refresh_place_aggregates()
returns trigger language plpgsql security definer as $$
declare
  target_place uuid := coalesce(new.place_id, old.place_id);
begin
  if target_place is null then return null; end if;
  update places p set
    avg_rating = sub.avg_overall,
    avg_cleanliness = sub.avg_clean,
    avg_water = sub.avg_wtr,
    review_count = sub.rev_cnt,
    checkin_count = (select count(*) from checkins c where c.place_id = target_place),
    status = case
      when p.status = 'unverified' and sub.rev_cnt >= 3 then 'verified'::place_status
      else p.status
    end,
    updated_at = now()
  from (
    select
      round(avg(overall_rating), 1) as avg_overall,
      round(avg(rating_cleanliness), 1) as avg_clean,
      round(avg(rating_water), 1) as avg_wtr,
      count(*) as rev_cnt
    from reviews where place_id = target_place
  ) sub
  where p.id = target_place;
  return null;
end;
$$;

drop trigger if exists trg_refresh_place_reviews on reviews;
create trigger trg_refresh_place_reviews
after insert or update or delete on reviews
for each row execute function refresh_place_aggregates();

drop trigger if exists trg_refresh_place_checkins on checkins;
create trigger trg_refresh_place_checkins
after insert or delete on checkins
for each row execute function refresh_place_aggregates();

-- TRIGGER ANTI-MANIPULASI GPS & RATE LIMIT DI LEVEL DATABASE
create or replace function enforce_checkin_gps_and_rules()
returns trigger language plpgsql security definer as $$
declare
  place_loc geography;
  dist_m double precision;
  recent_count int;
  last_chk record;
  hours_diff double precision;
  speed_kmh double precision;
begin
  -- 1. Anti-spam: Maksimal 1 check-in dalam 15 menit terakhir
  select count(*) into recent_count
  from checkins
  where user_id = new.user_id
    and created_at > now() - interval '15 minutes';

  if recent_count > 0 then
    raise exception 'ANTI_SPAM: Kamu baru saja check-in. Tunggu 15 menit sebelum check-in lagi.';
  end if;

  -- 2. Deteksi Teleportasi / Fake GPS dari check-in sebelumnya
  select lat, lng, location, created_at into last_chk
  from checkins
  where user_id = new.user_id
  order by created_at desc
  limit 1;

  if last_chk.location is not null then
    dist_m := ST_Distance(
      ST_SetSRID(ST_MakePoint(new.lng, new.lat), 4326)::geography,
      last_chk.location
    );
    hours_diff := extract(epoch from (now() - last_chk.created_at)) / 3600.0;
    if dist_m > 2000 and hours_diff > 0 then
      speed_kmh := (dist_m / 1000.0) / hours_diff;
      if speed_kmh > 250 then
        raise exception 'FAKE_GPS_DETECTED: Perpindahan lokasi terlalu cepat (% km/jam). Manipulasi GPS tidak diizinkan.', round(speed_kmh::numeric, 0);
      end if;
    end if;
  end if;

  -- 3. Validasi Jarak Geofence: Wajib <= 150 meter dari titik toilet publik
  if new.place_id is not null then
    select location into place_loc from places where id = new.place_id;
    if place_loc is not null then
      dist_m := ST_Distance(
        ST_SetSRID(ST_MakePoint(new.lng, new.lat), 4326)::geography,
        place_loc
      );
      if dist_m > 150 then
        raise exception 'OUT_OF_RANGE: Lokasi GPS kamu berjarak % meter dari toilet ini (maksimal 150m).', round(dist_m::numeric, 0);
      end if;
    end if;
  end if;

  -- 4. Cek Zona Privat pengguna: otomatis kunci ke private jika di dalam radius rumah
  if exists (
    select 1 from private_zones pz
    where pz.user_id = new.user_id
      and ST_DWithin(
        ST_SetSRID(ST_MakePoint(new.lng, new.lat), 4326)::geography,
        pz.center,
        pz.radius_m
      )
  ) then
    new.in_private_zone := true;
    new.visibility := 'private';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_checkin_gps on checkins;
create trigger trg_enforce_checkin_gps
before insert on checkins
for each row execute function enforce_checkin_gps_and_rules();

-- ENABLE RLS DI SEMUA TABEL
alter table profiles enable row level security;
alter table places enable row level security;
alter table checkins enable row level security;
alter table reviews enable row level security;
alter table friendships enable row level security;
alter table blocks enable row level security;
alter table private_zones enable row level security;
alter table reports enable row level security;
alter table feature_flags enable row level security;
alter table reactions enable row level security;
alter table comments enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table place_photos enable row level security;
alter table place_status_reports enable row level security;
alter table notifications enable row level security;
alter table push_tokens enable row level security;
alter table invites enable row level security;
alter table challenges enable row level security;
alter table challenge_participants enable row level security;
alter table trips enable row level security;
alter table wrapped_reports enable row level security;
alter table health_logs enable row level security;
alter table place_claims enable row level security;
alter table review_replies enable row level security;
alter table subscriptions enable row level security;

-- POLICIES UTAMA
create policy "Public read profiles" on profiles for select using (true);
create policy "Owner update profiles" on profiles for update using (auth.uid() = id);
create policy "Owner insert profiles" on profiles for insert with check (auth.uid() = id);

create policy "Public read active places" on places for select using (status <> 'removed');
create policy "Auth insert places" on places for insert with check (auth.uid() is not null);
create policy "Creator update places" on places for update using (auth.uid() = created_by);

create policy "View allowed checkins" on checkins for select using (can_view_checkin(auth.uid(), checkins));
create policy "Owner insert checkins" on checkins for insert with check (auth.uid() = user_id);
create policy "Owner delete checkins" on checkins for delete using (auth.uid() = user_id);

create policy "Public read reviews" on reviews for select using (true);
create policy "Owner insert reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "Owner update reviews" on reviews for update using (auth.uid() = user_id);

create policy "Involved read friendships" on friendships for select using (auth.uid() in (requester_id, addressee_id));
create policy "Requester insert friendships" on friendships for insert with check (auth.uid() = requester_id);
create policy "Involved update friendships" on friendships for update using (auth.uid() in (requester_id, addressee_id));

create policy "Owner only private_zones" on private_zones for all using (auth.uid() = user_id);
create policy "Owner only health_logs" on health_logs for all using (auth.uid() = user_id);
create policy "Public read feature_flags" on feature_flags for select using (true);
create policy "Public read badges" on badges for select using (true);
