'use client';

import { useUserStore } from '@/app/(protected)/store';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { updateUser } from '@/features/users/client';
import { useUserProfile, useUserProfileForm } from '@/features/users/hooks';
import { UserDisplay, UserProfileFormData } from '@/features/users/schemas';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const UserProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useUserProfile();

  const name = useUserStore((state) => state.name);
  const setName = useUserStore((state) => state.setName);
  const email = useUserStore((state) => state.email);
  const bio = useUserStore((state) => state.bio);
  const setBio = useUserStore((state) => state.setBio);

  const user = {
    name,
    email,
    bio,
  } as UserDisplay;

  const form = useUserProfileForm(user);
  const { update } = useSession();

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Reset form when store values change (e.g., after page refresh)
  useEffect(() => {
    if (name || email || bio) {
      form.reset({
        name: name || '',
        email: email || '',
        bio: bio || '',
      });
    }
  }, [name, email, bio, form]);

  async function onSubmit(data: UserProfileFormData) {
    try {
      setIsLoading(true);
      await updateUser(data);

      // Update store
      setName(data.name!);
      setBio(data.bio!);

      // Update session
      await update({
        user: {
          name: data.name!,
          bio: data.bio!,
        },
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="w-full max-w-xl flex flex-col gap-6 mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is your public display name.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="text" disabled />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is your public email address. Cannot be changed.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} className="resize-none" />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Tell your friends something about you.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default UserProfileForm;
