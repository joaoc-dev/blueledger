// Dashboard UI strings
export const DAY_NAMES = {
  SUNDAY: 'Sunday',
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
} as const;

export const DAY_NAMES_ARRAY = [
  DAY_NAMES.SUNDAY,
  DAY_NAMES.MONDAY,
  DAY_NAMES.TUESDAY,
  DAY_NAMES.WEDNESDAY,
  DAY_NAMES.THURSDAY,
  DAY_NAMES.FRIDAY,
  DAY_NAMES.SATURDAY,
] as const;

export type DayName = typeof DAY_NAMES[keyof typeof DAY_NAMES];

export const MONTH_NAMES = {
  JANUARY: 'January',
  FEBRUARY: 'February',
  MARCH: 'March',
  APRIL: 'April',
  MAY: 'May',
  JUNE: 'June',
  JULY: 'July',
  AUGUST: 'August',
  SEPTEMBER: 'September',
  OCTOBER: 'October',
  NOVEMBER: 'November',
  DECEMBER: 'December',
} as const;

export const MONTH_NAMES_ARRAY = [
  MONTH_NAMES.JANUARY,
  MONTH_NAMES.FEBRUARY,
  MONTH_NAMES.MARCH,
  MONTH_NAMES.APRIL,
  MONTH_NAMES.MAY,
  MONTH_NAMES.JUNE,
  MONTH_NAMES.JULY,
  MONTH_NAMES.AUGUST,
  MONTH_NAMES.SEPTEMBER,
  MONTH_NAMES.OCTOBER,
  MONTH_NAMES.NOVEMBER,
  MONTH_NAMES.DECEMBER,
] as const;

export type MonthName = typeof MONTH_NAMES[keyof typeof MONTH_NAMES];
