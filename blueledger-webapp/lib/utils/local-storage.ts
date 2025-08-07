'use client';

export function setLocalStorageItem<T>(key: string, value: T) {
  if (typeof window === 'undefined')
    return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  }
  catch (error) {
    console.error('Error setting item in localStorage:', error);
  }
}

export function getLocalStorageItem<T>(key: string): T | undefined {
  if (typeof window === 'undefined')
    return undefined;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : undefined;
  }
  catch (error) {
    console.error('Error getting item from localStorage:', error);
  }
}
