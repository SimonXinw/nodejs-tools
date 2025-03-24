export const localStorageUtil = {
  // Method to set a value in localStorage
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value); // Convert the value to a JSON string
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Failed to set value:', error);
    }
  },

  // Method to get a value from localStorage
  get<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? (JSON.parse(serializedValue) as T) : null; // Parse JSON if value exists
    } catch (error) {
      console.error('Failed to get value:', error);
      return null;
    }
  },

  // Method to remove a specific key from localStorage
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove key:', error);
    }
  },

  // Method to clear all data from localStorage
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

// Usage example
// LocalStorageUtil.set('user', { name: 'Alice', age: 25 }); // Store an object
// const user = LocalStorageUtil.get<{ name: string; age: number }>('user'); // Retrieve the value

// LocalStorageUtil.remove('user'); // Remove a specific key
// LocalStorageUtil.clear(); // Clear all localStorage data
