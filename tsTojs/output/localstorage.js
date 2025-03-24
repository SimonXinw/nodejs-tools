const localStorageUtil = {
  // Method to set a value in localStorage
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Failed to set value:", error);
    }
  },
  // Method to get a value from localStorage
  get(key) {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error("Failed to get value:", error);
      return null;
    }
  },
  // Method to remove a specific key from localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove key:", error);
    }
  },
  // Method to clear all data from localStorage
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }
};
export {
  localStorageUtil
};
