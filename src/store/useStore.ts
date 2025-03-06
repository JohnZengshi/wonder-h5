import { components } from "@/server/api";
import { useState, useEffect } from "react";

class StorageManager<T> {
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
    // 修改参数类型
    if (this.value !== newValue) {
      this.value = newValue;
      // 存储时序列化
      localStorage.setItem(this.key, JSON.stringify(newValue));
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
function useStorage<T>(storageInstance: StorageManager<T>) {
  const [value, setValue] = useState<T>(storageInstance.getValue());

  useEffect(() => {
    const unsubscribe = storageInstance.subscribe(() => {
      setValue(storageInstance.getValue());
    });
    return unsubscribe;
  }, [storageInstance]);

  return {
    value,
    setValue: (newValue: T) => storageInstance.setValue(newValue),
  };
}

export const TokenStorage = new StorageManager<string>(
  "WONDER_H5_USER_TOKEN",
  ""
);
export const AccountStorage = new StorageManager<string>("USER_ACCOUNT", "");

type CartItem = {
  info: components["schemas"]["Commodity"];
  quantity: number;
  selected?: boolean;
  // 可根据需要添加更多商品属性
};
// 添加购物车存储实例（在原有存储实例下方）
export const CartStorage = new StorageManager<CartItem[]>("SHOPPING_CART", []);

export default function () {
  const { value: token, setValue: setToken } = useStorage(TokenStorage);
  const { value: account, setValue: setAccount } = useStorage(AccountStorage);
  const { value: cart, setValue: setCart } = useStorage(CartStorage);

  // 购物车操作方法
  const addToCart = (item: CartItem) => {
    const existingItem = cart.find((i) => i.info.id === item.info.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    setCart([...cart]);
  };
  const removeFromCart = (goodsId: number) => {
    setCart(cart.filter((item) => item.info.id !== goodsId));
  };

  const updateQuantity = (goodsId: number, newQuantity: number) => {
    setCart(
      cart.map((item) =>
        item.info.id === goodsId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return {
    token,
    setToken,
    account,
    setAccount,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
}
