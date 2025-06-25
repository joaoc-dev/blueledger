import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/lib/utils/local-storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const item = getLocalStorageItem(key);
    return item ?? initialValue;
  });

  useEffect(() => {
    setLocalStorageItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
