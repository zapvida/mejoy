// src/components/auth/withAuth.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';

const withAuth = (Component: any) => {
  return function AuthenticatedComponent(props: any) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (user === null) {
        router.push('/login');
      }
    }, [user, router]);

    if (user === undefined) {
      return <p className="text-center mt-10">Carregando...</p>;
    }

    return user ? <Component {...props} /> : null;
  };
};

export default withAuth;