export const LogEvents = {
  // Generic
  REQUEST_RECEIVED: 'request_received',
  VALIDATION_FAILED: 'validation_failed',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',

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
  FRIENDSHIP_INVITE_NOTIFICATION_SENT: 'friendship_invite_notification_sent',
  GROUP_INVITE_NOTIFICATION_SENT: 'group_invite_sent',
  ERROR_GETTING_NOTIFICATIONS: 'error_getting_notifications',
  ERROR_PATCHING_NOTIFICATION: 'error_patching_notification',
  ERROR_MARKING_ALL_NOTIFICATIONS_AS_READ: 'error_marking_all_notifications_as_read',
  ERROR_SENDING_EXPENSE_NOTIFICATION: 'error_sending_expense_notification',
  ERROR_SENDING_FRIENDSHIP_INVITE_NOTIFICATION: 'error_sending_friendship_invite_notification',
  ERROR_SENDING_GROUP_INVITE_NOTIFICATION: 'error_sending_group_invite_notification',

  // Friendships
  FRIENDSHIP_INVITE_SENT: 'friendship_invite_sent',
  FRIENDSHIP_INVITE_ALREADY_EXISTS: 'friendship_invite_already_exists',
  SELF_FRIEND_REQUEST: 'self_friend_request',
  FRIENDSHIPS_FETCHED: 'friendships_fetched',
  ERROR_GETTING_FRIENDSHIPS: 'error_getting_friendships',
  ERROR_SENDING_FRIEND_REQUEST: 'error_sending_friend_request',
  FRIENDSHIP_NOT_FOUND: 'friendship_not_found',
  FRIENDSHIP_INVITE_ACCEPTED: 'friendship_invite_accepted',
  FRIENDSHIP_INVITE_DECLINED: 'friendship_invite_declined',
  FRIENDSHIP_INVITE_CANCELED: 'friendship_invite_canceled',
  FRIENDSHIP_REMOVED: 'friendship_removed',
  ERROR_ACCEPTING_FRIENDSHIP_INVITE: 'error_accepting_friendship_invite',
  ERROR_DECLINING_FRIENDSHIP_INVITE: 'error_declining_friendship_invite',
  ERROR_CANCELING_FRIENDSHIP_INVITE: 'error_canceling_friendship_invite',
  ERROR_REMOVING_FRIENDSHIP: 'error_removing_friendship',

  // Groups
  GROUP_CREATED: 'group_created',
  GROUP_MEMBERSHIPS_FETCHED: 'group_memberships_fetched',
  GROUP_DELETED: 'group_deleted',
  GROUP_UPDATED: 'group_updated',
  GROUP_NOT_FOUND: 'group_not_found',
  ERROR_CREATING_GROUP: 'error_creating_group',
  ERROR_GETTING_GROUP_MEMBERSHIPS: 'error_getting_group_memberships',
  ERROR_GETTING_GROUP: 'error_getting_group',
  ERROR_PATCHING_GROUP: 'error_patching_group',
  ERROR_DELETING_GROUP: 'error_deleting_group',
  GROUP_NOT_AUTHORIZED: 'group_not_authorized',

  // Group membership invite
  GROUP_MEMBERSHIP_INVITE: 'group_membership_invite',
  GROUP_MEMBERSHIP_INVITED: 'group_membership_invited',
  ERROR_INVITING_GROUP_MEMBERSHIP: 'error_sending_group_invite',

  // Group membership accept
  GROUP_MEMBERSHIP_ACCEPT: 'group_membership_accept',
  GROUP_MEMBERSHIP_ACCEPTED: 'group_membership_accepted',
  ERROR_ACCEPTING_GROUP_MEMBERSHIP: 'error_accepting_group_membership',

  // Group membership decline
  GROUP_MEMBERSHIP_DECLINE: 'group_membership_decline',
  GROUP_MEMBERSHIP_DECLINED: 'group_membership_declined',
  ERROR_DECLINING_GROUP_MEMBERSHIP: 'error_declining_group_membership',

  // Group membership cancel
  GROUP_MEMBERSHIP_CANCEL: 'group_membership_cancel',
  GROUP_MEMBERSHIP_CANCELED: 'group_membership_canceled',
  ERROR_CANCELING_GROUP_MEMBERSHIP: 'error_canceling_group_membership',

  // Group membership leave
  GROUP_MEMBERSHIP_LEAVE: 'group_membership_leave',
  GROUP_MEMBERSHIP_LEFT: 'group_membership_left',
  ERROR_LEAVING_GROUP_MEMBERSHIP: 'error_leaving_group_membership',

  // Group membership kick
  GROUP_MEMBERSHIP_KICK: 'group_membership_kick',
  GROUP_MEMBERSHIP_KICKED: 'group_membership_kicked',
  ERROR_KICKING_GROUP_MEMBERSHIP: 'error_removing_group_membership',

  // Group membership ownership transfer
  GROUP_MEMBERSHIP_OWNERSHIP_TRANSFER: 'group_membership_ownership_transfer',
  GROUP_MEMBERSHIP_OWNERSHIP_TRANSFERRED: 'group_membership_ownership_transferred',
  ERROR_TRANSFERRING_GROUP_MEMBERSHIP_OWNERSHIP: 'error_transferring_group_membership_ownership',

  // Group invitable friends
  GROUP_INVITABLE_FRIENDS_REQUESTED: 'group_invitable_friends_requested',
  GROUP_INVITABLE_FRIENDS_FETCHED: 'group_invitable_friends_fetched',
  ERROR_GETTING_INVITABLE_FRIENDS: 'error_getting_invitable_friends',

  GROUP_MEMBERSHIP_NOT_FOUND: 'group_membership_not_found',
  GROUP_MEMBERSHIP_STATUS_UPDATED: 'group_membership_status_updated',
  ERROR_UPDATING_GROUP_MEMBERSHIP_STATUS: 'error_updating_group_membership_status',

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
  AUTH_SIGN_UP: 'auth_sign_up',
  AUTH_SIGN_UP_ERROR: 'auth_sign_up_error',
  AUTH_SIGN_OUT: 'auth_sign_out',
  AUTH_ERROR: 'auth_error',

  ALREADY_AUTHENTICATED: 'already_authenticated',
  UNVERIFIED_EMAIL: 'unverified_email',
  EMAIL_ALREADY_VERIFIED: 'email_already_verified',
  UNAUTHORIZED_PAGE_ACCESS: 'unauthorized_page_access',
  UNAUTHORIZED_REQUEST: 'unauthorized_request',

  EMAIL_VERIFICATION_SENT: 'email_verification_sent',
  ERROR_SENDING_EMAIL_VERIFICATION: 'error_sending_email_verification',
  EMAIL_VERIFICATION_CONFIRMED: 'email_verification_confirmed',
  ERROR_CONFIRMING_EMAIL_VERIFICATION: 'error_confirming_email_verification',
  EMAIL_PASSWORD_RESET_SENT: 'email_password_reset_sent',
  ERROR_SENDING_EMAIL_PASSWORD_RESET: 'error_sending_email_password_reset',
  EMAIL_PASSWORD_RESET_CONFIRMED: 'email_password_reset_confirmed',
  ERROR_CONFIRMING_EMAIL_PASSWORD_RESET: 'error_confirming_email_password_reset',

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

  // Dashboard
  DASHBOARD_DATA_FETCHED: 'dashboard_data_fetched',
  ERROR_GETTING_DASHBOARD_DATA: 'error_getting_dashboard_data',
} as const;
