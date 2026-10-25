'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?mode=register');
  }, [router]);

  return null;
}
