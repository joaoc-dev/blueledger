export function setLocalStorageItem(key: string, value: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting item in localStorage:', error);
  }
}

export function getLocalStorageItem(key: string) {
  if (typeof window === 'undefined') return;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
  }
}
