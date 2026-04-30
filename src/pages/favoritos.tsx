import { GetServerSideProps } from 'next';
import { isStoreV2Enabled } from '@/lib/flags';
import StorefrontHeader from '@/components/store-v2/StorefrontHeader';
import StorefrontFooter from '@/components/store-v2/StorefrontFooter';
import FavoritosClient from '@/components/store-v2/FavoritosClient';
import Seo from '@/components/Seo';

export default function FavoritosPage() {
  if (!isStoreV2Enabled()) return null;

  return (
    <>
      <Seo title="Favoritos | Me Joy" description="Seus produtos favoritos" path="/favoritos" />
      <StorefrontHeader />
      <main className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Favoritos</h1>
          <FavoritosClient />
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (!isStoreV2Enabled()) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
};
