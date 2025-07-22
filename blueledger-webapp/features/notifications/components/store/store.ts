import { create } from 'zustand';
import { NotificationDisplay } from '../../schemas';

interface NotificationsStore {
  notifications: NotificationDisplay[];
  setNotifications: (notifications: NotificationDisplay[]) => void;
}

const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
}));

export { useNotificationsStore };
