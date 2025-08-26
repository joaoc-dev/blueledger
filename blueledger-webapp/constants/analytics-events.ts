export const AnalyticsEvents = {
  // Auth
  SIGN_IN_SUBMIT: 'sign_in_submit',
  SIGN_IN_SUCCESS: 'sign_in_success',
  SIGN_IN_ERROR: 'sign_in_error',

  SIGN_UP_SUBMIT: 'sign_up_submit',
  SIGN_UP_SUCCESS: 'sign_up_success',
  SIGN_UP_ERROR: 'sign_up_error',

  GITHUB_AUTH_CLICKED: 'github_auth_clicked',

  VERIFICATION_CODE_SEND_CLICKED: 'verification_code_send_clicked',
  VERIFICATION_CODE_SEND_SUCCESS: 'verification_code_send_success',
  VERIFICATION_CODE_SEND_ERROR: 'verification_code_send_error',

  VERIFICATION_CODE_CONFIRM_SUBMIT: 'verification_code_confirm_submit',
  VERIFICATION_CODE_CONFIRM_SUCCESS: 'verification_code_confirm_success',
  VERIFICATION_CODE_CONFIRM_ERROR: 'verification_code_confirm_error',

  PASSWORD_RESET_REQUEST_SUBMIT: 'password_reset_request_submit',
  PASSWORD_RESET_REQUEST_SUCCESS: 'password_reset_request_success',
  PASSWORD_RESET_REQUEST_ERROR: 'password_reset_request_error',

  PASSWORD_RESET_CONFIRM_SUBMIT: 'password_reset_confirm_submit',
  PASSWORD_RESET_CONFIRM_SUCCESS: 'password_reset_confirm_success',
  PASSWORD_RESET_CONFIRM_ERROR: 'password_reset_confirm_error',
  // Auth / session
  UNAUTHORIZED_PAGE_REDIRECT: 'unauthorized_page_redirect',

  // Expenses
  EXPENSE_SUBMIT: 'expense_submit',
  EXPENSE_SUBMIT_SUCCESS: 'expense_submit_success',
  EXPENSE_SUBMIT_ERROR: 'expense_submit_error',
  EXPENSE_ADD_CLICKED: 'expense_add_clicked',
  EXPENSE_DELETE_CLICKED: 'expense_delete_clicked',
  EXPENSE_DELETE_SUCCESS: 'expense_delete_success',
  EXPENSE_DELETE_ERROR: 'expense_delete_error',

  // Friendships
  FRIENDSHIP_ADD_CLICKED: 'friendship_add_clicked',
  FRIENDSHIP_INVITE_SUBMIT: 'friendship_invite_submit',
  FRIENDSHIP_INVITE_SUCCESS: 'friendship_invite_success',
  FRIENDSHIP_INVITE_ERROR: 'friendship_invite_error',
  FRIENDSHIP_INVITE_ACCEPTED_CLICKED: 'friendship_invite_accepted_clicked',
  FRIENDSHIP_INVITE_ACCEPTED_SUCCESS: 'friendship_invite_accepted_success',
  FRIENDSHIP_INVITE_ACCEPTED_ERROR: 'friendship_invite_accepted_error',
  FRIENDSHIP_INVITE_DECLINED_CLICKED: 'friendship_invite_declined_clicked',
  FRIENDSHIP_INVITE_DECLINED_SUCCESS: 'friendship_invite_declined_success',
  FRIENDSHIP_INVITE_DECLINED_ERROR: 'friendship_invite_declined_error',
  FRIENDSHIP_INVITE_CANCELLED_CLICKED: 'friendship_invite_cancelled_clicked',
  FRIENDSHIP_INVITE_CANCELLED_SUCCESS: 'friendship_invite_cancelled_success',
  FRIENDSHIP_INVITE_CANCELLED_ERROR: 'friendship_invite_cancelled_error',

  // Notifications
  NOTIFICATION_MARK_AS_READ_CLICKED: 'notification_mark_as_read_clicked',
  NOTIFICATION_MARK_AS_READ_SUCCESS: 'notification_mark_as_read_success',
  NOTIFICATION_MARK_AS_READ_ERROR: 'notification_mark_as_read_error',
  NOTIFICATION_MARK_ALL_CLICKED: 'notification_mark_all_clicked',
  NOTIFICATION_MARK_ALL_SUCCESS: 'notification_mark_all_as_read_success',
  NOTIFICATION_MARK_ALL_ERROR: 'notification_mark_all_as_read_error',

  // Users
  USER_PROFILE_SUBMIT: 'user_profile_submit',
  USER_PROFILE_SUBMIT_SUCCESS: 'user_profile_submit_success',
  USER_PROFILE_SUBMIT_ERROR: 'user_profile_submit_error',
  AVATAR_UPLOAD_CLICKED: 'avatar_upload_clicked',
  AVATAR_REMOVE_CLICKED: 'avatar_remove_clicked',
  AVATAR_REMOVE_SUCCESS: 'avatar_remove_success',
  AVATAR_REMOVE_ERROR: 'avatar_remove_error',
  AVATAR_FILE_DROPPED: 'avatar_file_dropped',
  AVATAR_UPLOAD_SUBMIT: 'avatar_upload_submit',
  AVATAR_UPLOAD_SUCCESS: 'avatar_upload_success',
  AVATAR_UPLOAD_ERROR: 'avatar_upload_error',

  // Navigation
  NAV_LINK_CLICKED: 'nav_link_clicked',

  // Table
  TABLE_SORT_CHANGED: 'table_sort_changed',
  TABLE_SORT_CLEARED: 'table_sort_cleared',
  TABLE_PAGE_CHANGED: 'table_page_changed',
  TABLE_FILTER_CHANGED: 'table_filter_changed',
  TABLE_COLUMN_DRAG_START: 'table_column_drag_start',
  TABLE_COLUMN_DRAG_END: 'table_column_drag_end',
  TABLE_COLUMN_RESIZE_START: 'table_column_resize_start',
  TABLE_COLUMN_RESIZE_RESET: 'table_column_resize_reset',
  TABLE_COLUMN_VISIBILITY_TOGGLED: 'table_column_visibility_toggled',
  TABLE_REFRESH_CLICKED: 'table_refresh_clicked',
} as const;
