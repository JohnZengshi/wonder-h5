import { useState, useEffect } from "react";

class StorageManager<T extends string> {
  private key: string;
  private value: T;
  private listeners: Array<() => void> = [];

  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.value = defaultValue;

    if (typeof window !== "undefined") {
      // 初始化时读取本地存储
      const storedValue = localStorage.getItem(this.key);
      this.value = (storedValue as T) || defaultValue;

      // 监听存储变化
      window.addEventListener("storage", this.handleStorageChange);
    }
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (event.key === this.key) {
      this.value = (event.newValue as T) || this.value;
      this.notifyListeners();
    }
  };

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  public getValue(): T {
    return this.value;
  }

  public setValue(newValue: T) {
    if (this.value !== newValue) {
      this.value = newValue;
      localStorage.setItem(this.key, newValue);
      this.notifyListeners();
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

// 配套的 React Hook
function useStorage(storageInstance: StorageManager<string>) {
  const [value, setValue] = useState(storageInstance.getValue());

  useEffect(() => {
    const unsubscribe = storageInstance.subscribe(() => {
      setValue(storageInstance.getValue());
    });
    return unsubscribe;
  }, [storageInstance]);

  return {
    value,
    setValue: (newValue: string) => storageInstance.setValue(newValue),
  };
}

export const TokenStorage = new StorageManager<string>(
  "WONDER_H5_USER_TOKEN",
  ""
);
export const AccountStorage = new StorageManager<string>("USER_ACCOUNT", "");
export default function () {
  const { value: token, setValue: setToken } = useStorage(TokenStorage);
  const { value: account, setValue: setAccount } = useStorage(AccountStorage);

  return {
    token,
    setToken,
    account,
    setAccount,
  };
}
