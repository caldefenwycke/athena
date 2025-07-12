'use client';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function OrganiserPortalIndexRedirect() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id && typeof id === 'string') {
      router.replace(`/dashboard/organiser/${id}/overview`);
    }
  }, [id]);

  return null;
}

