'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModolStore } from '@/lib/store';

export default function CheckinRedirectPage() {
  const router = useRouter();
  const { openCheckinSheet } = useModolStore();

  useEffect(() => {
    openCheckinSheet();
    router.replace('/map');
  }, [openCheckinSheet, router]);

  return null;
}
