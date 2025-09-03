'use client';

import type { GroupFormData, GroupMembershipDisplay } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { groupFormSchema } from '../schemas';

export function useGroupForm(group?: GroupMembershipDisplay) {
  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: group?.group.name || '',
      image: group?.group.image || '',
    },
  });

  return form;
}
