/**
 * useLocalStorage Hook - Persistent state with localStorage
 */

import { useState, useEffect, useCallback } from 'react'

export type SetValue<T> = T | ((prevValue: T) => T)

export interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
  initializeWithValue?: boolean
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
): [T, (value: SetValue<T>) => void, () => void] {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    initializeWithValue = true,
  } = options || {}

  // Get stored value from localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? deserializer(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [initialValue, key, deserializer])

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (initializeWithValue) {
      return readValue()
    }
    return initialValue
  })

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a client`
        )
        return
      }

      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save to localStorage
        window.localStorage.setItem(key, serializer(valueToStore))

        // Save state
        setStoredValue(valueToStore)

        // Dispatch custom event so other useLocalStorage hooks can sync
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: serializer(valueToStore),
        }))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, serializer, storedValue]
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
      
      // Dispatch custom event for sync
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: null,
      }))
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) {
        return
      }

      try {
        setStoredValue(deserializer(e.newValue))
      } catch (error) {
        console.warn(`Error parsing storage event for key "${key}":`, error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserializer])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
