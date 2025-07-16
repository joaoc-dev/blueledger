import { NotificationDisplay } from '@/features/notifications.ts/schemas';
import { create } from 'zustand';

interface UserProfileStore {
  image?: string;
  name?: string;
  email?: string;
  bio?: string;
  setImage: (image: string | undefined) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setBio: (bio: string) => void;
  reset: () => void;
}

const useUserStore = create<UserProfileStore>((set) => ({
  image: undefined,
  name: undefined,
  email: undefined,
  bio: undefined,
  setImage: (image) => set({ image }),
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setBio: (bio) => set({ bio }),
  reset: () =>
    set({
      image: undefined,
      name: undefined,
      email: undefined,
      bio: undefined,
    }),
}));

interface NotificationsStore {
  notifications: NotificationDisplay[];
  setNotifications: (notifications: NotificationDisplay[]) => void;
}

const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
}));

export { useUserStore, useNotificationsStore };
