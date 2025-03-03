import createClient from "openapi-fetch";
import type { paths } from "./api"; // 由openapi-typescript生成

const FetchClient = createClient<paths>({
  baseUrl: "http://roos.nat300.top/",
});

export default FetchClient;
