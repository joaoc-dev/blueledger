export const LogEvents = {
  // Generic
  REQUEST_RECEIVED: 'request_received',
  VALIDATION_FAILED: 'validation_failed',

  // Expenses
  EXPENSE_CREATED: 'expense_created',
  EXPENSES_FETCHED: 'expenses_fetched',
  EXPENSE_UPDATED: 'expense_updated',
  EXPENSE_DELETED: 'expense_deleted',
  EXPENSE_NOT_FOUND: 'expense_not_found',
  ERROR_CREATING_EXPENSE: 'error_creating_expense',
  ERROR_GETTING_EXPENSES: 'error_getting_expenses',
  ERROR_PATCHING_EXPENSE: 'error_patching_expense',
  ERROR_DELETING_EXPENSE: 'error_deleting_expense',

  // Notifications
  NOTIFICATIONS_FETCHED: 'notifications_fetched',
  NOTIFICATION_UPDATED: 'notification_updated',
  NOTIFICATIONS_MARKED_ALL_READ: 'notifications_marked_all_read',
  EXPENSE_NOTIFICATION_SENT: 'expense_notification_sent',
  FRIEND_REQUEST_SENT: 'friend_request_sent',
  GROUP_INVITE_SENT: 'group_invite_sent',
  ERROR_GETTING_NOTIFICATIONS: 'error_getting_notifications',
  ERROR_PATCHING_NOTIFICATION: 'error_patching_notification',
  ERROR_MARKING_ALL_NOTIFICATIONS_AS_READ: 'error_marking_all_notifications_as_read',
  ERROR_SENDING_EXPENSE_NOTIFICATION: 'error_sending_expense_notification',
  ERROR_SENDING_FRIEND_REQUEST: 'error_sending_friend_request',
  ERROR_SENDING_GROUP_INVITE: 'error_sending_group_invite',

  // Users
  USER_FETCHED: 'user_fetched',
  USER_UPDATED: 'user_updated',
  USER_IMAGE_UPDATED: 'user_image_updated',
  USER_NOT_FOUND: 'user_not_found',
  ERROR_GETTING_USER: 'error_getting_user',
  ERROR_UPDATING_USER: 'error_updating_user',
  ERROR_UPDATING_USER_IMAGE: 'error_updating_user_image',

  // Pusher
  PUSHER_CHANNEL_AUTHORIZED: 'pusher_channel_authorized',
  PUSHER_CHANNEL_MISMATCH: 'pusher_channel_mismatch',
  PUSHER_ERROR_AUTHORIZING_CHANNEL: 'pusher_error_authorizing_channel',

  // Auth
  AUTH_JWT: 'auth_jwt',
  AUTH_SESSION: 'auth_session',
  AUTH_SIGN_IN: 'auth_sign_in',
  AUTH_SIGN_OUT: 'auth_sign_out',
  AUTH_ERROR: 'auth_error',
  UNAUTHORIZED_PAGE_ACCESS: 'unauthorized_page_access',
  UNAUTHORIZED_REQUEST: 'unauthorized_request',

  // Cloudinary
  CLOUDINARY_UPLOAD_STARTED: 'cloudinary_upload_started',
  CLOUDINARY_UPLOAD_SUCCESS: 'cloudinary_upload_success',
  CLOUDINARY_UPLOAD_FAILED: 'cloudinary_upload_failed',
  CLOUDINARY_DESTROY_STARTED: 'cloudinary_destroy_started',
  CLOUDINARY_DESTROY_SUCCESS: 'cloudinary_destroy_success',
  CLOUDINARY_DESTROY_FAILED: 'cloudinary_destroy_failed',
  CLOUDINARY_ROLLBACK_DESTROY: 'cloudinary_rollback_destroy',

  // Database
  DB_CONNECT_START: 'db_connect_start',
  DB_CONNECT_REUSE: 'db_connect_reuse',
  DB_CONNECT_SUCCESS: 'db_connect_success',
  DB_CONNECT_FAILED: 'db_connect_failed',
} as const;

export type LogEvent = (typeof LogEvents)[keyof typeof LogEvents];
