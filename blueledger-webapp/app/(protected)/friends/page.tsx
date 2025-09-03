import type { Metadata } from 'next';
import { FriendshipsTable } from '@/features/friendship/components';
import { pageSeoConfigs } from '@/lib/seo';

export const metadata: Metadata = {
  title: pageSeoConfigs.friends.title,
  description: pageSeoConfigs.friends.description,
  robots: {
    index: false, // Protected pages should not be indexed
    follow: false,
  },
};

async function FriendsPage() {
  return (
    <div>
      <FriendshipsTable />
    </div>
  );
}

export default FriendsPage;
