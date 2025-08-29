// Dashboard UI strings
const DAY_NAMES = {
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

const MONTH_NAMES = {
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

export const SEASON_LABELS = [
  'Dec–Feb',
  'Mar–May',
  'Jun–Aug',
  'Sep–Nov',
] as const;
export type SeasonLabel = typeof SEASON_LABELS[number];

export const MONTH_TO_SEASON_LABEL: Record<string, SeasonLabel> = {
  December: 'Dec–Feb',
  January: 'Dec–Feb',
  February: 'Dec–Feb',
  March: 'Mar–May',
  April: 'Mar–May',
  May: 'Mar–May',
  June: 'Jun–Aug',
  July: 'Jun–Aug',
  August: 'Jun–Aug',
  September: 'Sep–Nov',
  October: 'Sep–Nov',
  November: 'Sep–Nov',
};

export const TIME_CONSTANTS = {
  HOURS_IN_DAY: 24,
  MS_PER_HOUR: 1000 * 60 * 60,
  MS_PER_DAY: 1000 * 60 * 60 * 24,
} as const;
