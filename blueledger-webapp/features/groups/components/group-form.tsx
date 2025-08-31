import type { GroupFormData, GroupMembershipDisplay } from '@/features/groups/schemas';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroupForm } from '@/features/groups/hooks/useGroupForm';
import { useGroups } from '@/features/groups/hooks/useGroups';

interface GroupFormProps {
  group?: GroupMembershipDisplay;
  onSubmit: () => void;
}

function GroupForm({ group, onSubmit }: GroupFormProps) {
  const form = useGroupForm(group);
  const groups = useGroups();

  const handleSubmit = async (data: GroupFormData) => {
    const isUpdate = !!group?.group.id;
    const toastId = group?.group.id ?? uuidv4();

    toast.loading(`${isUpdate ? 'Updating' : 'Creating'} group...`, {
      id: toastId,
    });

    try {
      posthog.capture(AnalyticsEvents.GROUP_SUBMIT, {
        action: isUpdate ? 'update' : 'create',
        hasImage: !!data.image,
      });

      if (isUpdate) {
        await groups.updateGroupMutation.mutateAsync({
          id: group.group.id,
          updatedGroup: data,
        });
      }
      else {
        await groups.addGroupMutation.mutateAsync(data);
      }

      toast.success(`${isUpdate ? 'Updated' : 'Created'} group`, {
        id: toastId,
      });

      onSubmit();
    }
    catch {
      toast.error(`Failed to ${isUpdate ? 'update' : 'create'} group`, {
        id: toastId,
      });
    }
  };

  const groupAvatars = [
    { src: '/illustrations/groups/household.svg', label: 'Household' },
    { src: '/illustrations/groups/office.svg', label: 'Office' },
    { src: '/illustrations/groups/party.svg', label: 'Party' },
    { src: '/illustrations/groups/sports.svg', label: 'Sports' },
    { src: '/illustrations/groups/travel.svg', label: 'Travel' },
  ];

  return (
    <Form {...form}>
      <form
        className="space-y-4 w-full max-w-sm mx-auto"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className="h-12 px-4 py-3 text-base touch-manipulation"
                  style={{ fontSize: '16px' }} // Prevents zoom on iOS
                  placeholder="Enter group name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select an avatar (optional)</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-2 p-1 border rounded-md">
                  {groupAvatars.map(item => (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => field.onChange(item.src)}
                      className={`relative aspect-square rounded-md border ${
                        field.value === item.src ? 'ring-2 ring-primary border-primary' : ''
                      }`}
                      aria-label={item.label}
                    >
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-contain rounded-md pointer-events-none"
                      />
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => field.onChange('')}
                    className={`relative aspect-square flex items-center justify-center rounded-md border text-xs text-muted-foreground ${
                      !field.value ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    title="No avatar"
                  >
                    None
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="mt-6 w-full cursor-pointer hover:bg-primary/90
            dark:hover:bg-primary/85 hover:shadow-sm focus-visible:ring-ring/40"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? (
                <>
                  <Loader2 className="animate-spin" />
                  {' '}
                  Submitting...
                </>
              )
            : (
                'Submit'
              )}
        </Button>
      </form>
    </Form>
  );
}

export default GroupForm;
