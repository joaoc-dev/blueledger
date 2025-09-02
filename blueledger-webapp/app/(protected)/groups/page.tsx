import type { Metadata } from 'next';
import { GroupsTable } from '@/features/groups/components';
import { pageSeoConfigs } from '@/lib/seo';

export const metadata: Metadata = {
  title: pageSeoConfigs.groups.title,
  description: pageSeoConfigs.groups.description,
  robots: {
    index: false, // Protected pages should not be indexed
    follow: false,
  },
};

async function GroupsPage() {
  return (
    <div>
      <GroupsTable />
    </div>
  );
}

export default GroupsPage;
