// /utils/localStorageUtils.ts

export const saveToLocalStorage = <T>(key: string, value: T): void => {
    if (typeof window !== "undefined") {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error("Error saving to localStorage", error);
      }
    }
  };
  
  export const getFromLocalStorage = <T>(key: string): T | null => {
    if (typeof window !== "undefined") {
      try {
        const serializedValue = localStorage.getItem(key);
        return serializedValue ? (JSON.parse(serializedValue) as T) : null;
      } catch (error) {
        console.error("Error reading from localStorage", error);
        return null;
      }
    }
    return null;
  };
  
  export const removeFromLocalStorage = (key: string): void => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing from localStorage", error);
      }
    }
  };
  