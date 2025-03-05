import fs from "fs";
import yaml from "js-yaml";
import { OpenAPIV3 } from "openapi-types";

type SchemaObject = OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;

// 精确的类型守卫
function isOperationObject(value: unknown): value is OpenAPIV3.OperationObject {
  return typeof value === "object" && value !== null && "responses" in value;
}

// 增强的HTTP方法验证
const validHttpMethods = new Set([
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
]);

function isHttpMethod(method: string): method is OpenAPIV3.HttpMethods {
  return validHttpMethods.has(method.toLowerCase());
}

const processOpenAPI = () => {
  const doc = yaml.load(
    fs.readFileSync("api.yaml", "utf8")
  ) as OpenAPIV3.Document;

  Object.entries(doc.paths || {}).forEach(([path, pathItem]) => {
    if (!pathItem) return;

    Object.entries(pathItem).forEach(([method, operation]) => {
      // 双重类型校验
      if (!isHttpMethod(method)) return;
      if (!isOperationObject(operation)) return; // 关键修复点

      const response = operation.responses["200"] as OpenAPIV3.ResponseObject;
      if (!response?.content) return;

      const jsonContent = response.content["application/json"];
      if (!jsonContent?.schema) return;

      // 检测是否已包含BaseResponse
      if (containsBaseResponse(jsonContent.schema)) {
        console.log(`跳过已处理路径: ${method.toUpperCase()} ${path}`);
        return;
      }

      // 保留原始schema引用或对象
      const originalSchema = jsonContent.schema;

      // 构建正确的嵌套结构
      jsonContent.schema = {
        allOf: [
          { $ref: "#/components/schemas/BaseResponse" },
          {
            type: "object",
            properties: {
              data: originalSchema, // 保持原样引用
            },
          },
        ],
      };
    });
  });

  fs.writeFileSync("modified-api.yaml", yaml.dump(doc));
};

// 检测是否包含BaseResponse引用
const containsBaseResponse = (schema: SchemaObject): boolean => {
  if ("$ref" in schema) return false;

  return (
    schema.allOf?.some(
      (item) =>
        "$ref" in item && item.$ref === "#/components/schemas/BaseResponse"
    ) || false
  );
};

// 检测schema是否包含data字段（简单检测）
const hasDataField = (schema: SchemaObject): boolean => {
  if ("$ref" in schema) return true; // 假设引用类型可能包含data字段
  return !!schema.properties?.["data"];
};

processOpenAPI();
