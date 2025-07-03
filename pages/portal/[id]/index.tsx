import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CompetitionPortalIndex() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      router.replace(`/portal/${id}/public`);
    }
  }, [id, router]);

  return null;
}
