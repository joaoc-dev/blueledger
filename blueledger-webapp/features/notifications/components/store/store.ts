import { NotificationDisplay } from '@/features/notifications/schemas';
import { create } from 'zustand';

interface NotificationsStore {
  notifications: NotificationDisplay[];
  setNotifications: (notifications: NotificationDisplay[]) => void;
}

const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
}));

export { useNotificationsStore };
