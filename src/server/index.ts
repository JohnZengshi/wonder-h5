import createClient, { Middleware } from "openapi-fetch";
import type { components, paths } from "./api"; // 由openapi-typescript生成
import { Toast } from "antd-mobile";
import { AccountStorage, TokenStorage } from "@/store/useStore";

const FetchClient = createClient<paths>({
  baseUrl: "http://roos.nat300.top/",
});

const middleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set("Authorization", TokenStorage.getValue());
    request.headers.set("address", AccountStorage.getValue());
    return request;
  },
  async onResponse({ response }) {
    if (response.status == 500) {
      Toast.show("服务器内部错误");
      throw new Error("服务器内部错误");
    }
    const data: components["schemas"]["BaseResponse"] = await response
      .clone()
      .json();
    if (data.code !== 0) {
      if (data.msg) Toast.show(data.msg);
      throw new Error(data.msg);
    }
    return response;
  },
};

FetchClient.use(middleware);

export default FetchClient;
