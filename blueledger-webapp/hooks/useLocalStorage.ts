import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/lib/utils/local-storage';

// TODO: Live CrossTab sync
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const item = getLocalStorageItem<T>(key);
    return item ?? initialValue;
  });

  useEffect(() => {
    setLocalStorageItem<T>(key, value);
  }, [key, value]);

  return [value, setValue];
}
