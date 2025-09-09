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
  FRIENDSHIP_INVITE_ACCEPT_CLICKED: 'friendship_invite_accept_clicked',
  FRIENDSHIP_INVITE_ACCEPT_SUCCESS: 'friendship_invite_accept_success',
  FRIENDSHIP_INVITE_ACCEPT_ERROR: 'friendship_invite_accepted_error',
  FRIENDSHIP_INVITE_DECLINE_CLICKED: 'friendship_invite_decline_clicked',
  FRIENDSHIP_INVITE_DECLINE_SUCCESS: 'friendship_invite_decline_success',
  FRIENDSHIP_INVITE_DECLINE_ERROR: 'friendship_invite_decline_error',
  FRIENDSHIP_INVITE_CANCEL_CLICKED: 'friendship_invite_cancel_clicked',
  FRIENDSHIP_INVITE_CANCEL_SUCCESS: 'friendship_invite_cancel_success',
  FRIENDSHIP_INVITE_CANCEL_ERROR: 'friendship_invite_cancel_error',
  FRIENDSHIP_INVITE_REMOVE_CLICKED: 'friendship_invite_remove_clicked',
  FRIENDSHIP_INVITE_REMOVE_SUCCESS: 'friendship_invite_remove_success',
  FRIENDSHIP_INVITE_REMOVE_ERROR: 'friendship_invite_remove_error',

  // Groups
  GROUP_CREATE_CLICKED: 'group_create_clicked',
  GROUP_CREATE_SUCCESS: 'group_create_success',
  GROUP_CREATE_ERROR: 'group_create_error',
  GROUP_EDIT_CLICKED: 'group_edit_clicked',
  GROUP_EDIT_SUCCESS: 'group_edit_success',
  GROUP_EDIT_ERROR: 'group_edit_error',
  GROUP_DELETE_CLICKED: 'group_delete_clicked',
  GROUP_DELETE_SUCCESS: 'group_delete_success',
  GROUP_DELETE_ERROR: 'group_delete_error',

  // Group memberships
  GROUP_INVITE_SENT: 'group_invite_sent',
  GROUP_LEAVE_CLICKED: 'group_leave_clicked',
  GROUP_LEAVE_SUCCESS: 'group_leave_success',
  GROUP_LEAVE_ERROR: 'group_leave_error',
  GROUP_INVITE_ACCEPT_CLICKED: 'group_invite_accept_clicked',
  GROUP_INVITE_ACCEPT_SUCCESS: 'group_invite_accept_success',
  GROUP_INVITE_ACCEPT_ERROR: 'group_invite_accept_error',
  GROUP_INVITE_DECLINE_CLICKED: 'group_invite_decline_clicked',
  GROUP_INVITE_DECLINE_SUCCESS: 'group_invite_decline_success',
  GROUP_INVITE_DECLINE_ERROR: 'group_invite_decline_error',
  GROUP_INVITE_CANCEL_CLICKED: 'group_invite_cancel_clicked',
  GROUP_INVITE_CANCEL_SUCCESS: 'group_invite_cancel_success',
  GROUP_INVITE_CANCEL_ERROR: 'group_invite_cancel_error',
  GROUP_MEMBERSHIP_KICK_CLICKED: 'group_membership_kick_clicked',
  GROUP_MEMBERSHIP_KICK_SUCCESS: 'group_membership_kick_success',
  GROUP_MEMBERSHIP_KICK_ERROR: 'group_membership_kick_error',
  GROUP_MEMBERSHIP_TRANSFER_OWNERSHIP_CLICKED: 'group_membership_transfer_ownership_clicked',
  GROUP_MEMBERSHIP_TRANSFER_OWNERSHIP_SUCCESS: 'group_membership_transfer_ownership_success',
  GROUP_MEMBERSHIP_TRANSFER_OWNERSHIP_ERROR: 'group_membership_transfer_ownership_error',
  GROUP_FRIEND_INVITE_CLICKED: 'group_friend_invite_clicked',
  GROUP_FRIEND_INVITE_SUCCESS: 'group_friend_invite_success',
  GROUP_FRIEND_INVITE_ERROR: 'group_friend_invite_error',

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
