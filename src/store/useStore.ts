import { useLocalStorageState } from "ahooks";

export default function () {
  const [token, setToken] = useLocalStorageState("WONDER_H5_USER_TOKEN", {
    defaultValue: "",
    listenStorageChange: true,
  });

  return {
    token,
    setToken,
  };
}
