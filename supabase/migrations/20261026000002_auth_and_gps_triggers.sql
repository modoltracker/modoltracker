-- =============================================================================
-- MODOLTRACKER: MIGRATION 002 — AUTO PROFILE TRIGGER & ANTI-FAKE GPS (FUN TRACKER MODE)
-- Paste dan jalankan file ini di Supabase SQL Editor
-- =============================================================================

-- 1. Trigger otomatis membuat baris `profiles` saat user baru Sign Up dengan Username & Password
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  desired_username text;
  final_username text;
begin
  desired_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data->>'username', split_part(coalesce(new.email, 'pejuang'), '@', 1)),
    '[^a-z0-9_]', '', 'g'
  ));
  if char_length(desired_username) < 3 then
    desired_username := 'modol_' || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;

  -- Jika username belum dipakai orang lain, pakai persis sesuai pilihan user
  if not exists (select 1 from public.profiles where username = desired_username) then
    final_username := substr(desired_username, 1, 20);
  else
    final_username := substr(desired_username, 1, 15) || '_' || substr(replace(new.id::text, '-', ''), 1, 4);
  end if;

  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', final_username),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 2. Trigger Anti-Fake GPS (Teleportasi) & Auto Zona Privat saat menancapkan pin modol
create or replace function public.enforce_checkin_gps_and_rules()
returns trigger language plpgsql security definer as $$
declare
  dist_m double precision;
  last_chk record;
  hours_diff double precision;
  speed_kmh double precision;
begin
  -- Deteksi Teleportasi / Fake GPS (> 250 km/jam dari titik check-in sebelumnya)
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
        raise exception 'FAKE_GPS_DETECTED: Perpindahan lokasi terlalu cepat (% km/jam).', round(speed_kmh::numeric, 0);
      end if;
    end if;
  end if;

  -- Zona Privat otomatis kunci ke `private`
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
for each row execute function public.enforce_checkin_gps_and_rules();

-- 3. Policies untuk Reaksi Emoji (💩 😂 🫡 🤢) di Feed Teman
drop policy if exists "Public read reactions" on reactions;
create policy "Public read reactions" on reactions for select using (true);

drop policy if exists "Auth insert reactions" on reactions;
create policy "Auth insert reactions" on reactions for insert with check (auth.uid() = user_id);

drop policy if exists "Owner update reactions" on reactions;
create policy "Owner update reactions" on reactions for update using (auth.uid() = user_id);
