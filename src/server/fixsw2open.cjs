function convertToOpenAPI(swaggerDoc) {
  const openapiDoc = {
    openapi: "3.0.0",
    info: swaggerDoc.info,
    servers: [
      {
        url: `http://${swaggerDoc.host}${swaggerDoc.basePath}`,
        description: "API Server",
      },
    ],
    tags: swaggerDoc.tags,
    paths: {},
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
      schemas: {},
      parameters: {
        Authorization: {
          name: "Authorization",
          in: "header",
          description: "全局参数，token",
          schema: { type: "string" },
        },
        AcceptLanguage: {
          name: "Accept-Language",
          in: "header",
          description: "全局参数，语言,en,zh-CN",
          schema: { type: "string" },
        },
        Address: {
          name: "address",
          in: "header",
          description: "全局参数，地址",
          schema: { type: "string" },
        },
      },
    },
  };

  // 转换Definitions
  if (swaggerDoc.definitions) {
    openapiDoc.components.schemas = Object.entries(
      swaggerDoc.definitions
    ).reduce((acc, [key, value]) => {
      acc[key] = convertSchema(value);
      return acc;
    }, {});
  }

  // 添加CommodityType和Commodity的定义
  openapiDoc.components.schemas.CommodityType = {
    type: "object",
    properties: {
      id: { type: "integer", format: "int64" },
      createTime: { type: "string", format: "date-time" },
      createBy: { type: "string", nullable: true },
      updateTime: { type: "string", format: "date-time" },
      updateBy: { type: "string", nullable: true },
      flag: { type: "integer", format: "int32" },
      typeName: { type: "string" },
      type: { type: "integer", format: "int32" },
    },
    required: ["id", "createTime", "updateTime", "flag", "typeName", "type"],
  };

  // 转换Paths
  for (const [path, methods] of Object.entries(swaggerDoc.paths)) {
    openapiDoc.paths[path] = {};

    for (const [method, operation] of Object.entries(methods)) {
      const openapiOperation = {
        tags: operation.tags,
        summary: operation.summary,
        operationId: operation.operationId,
        parameters: [],
        responses: convertResponses(operation.responses),
      };

      // 特殊处理目标接口
      if (path === "/api/frontPage/findCommodityTypeOrMember") {
        openapiOperation.responses["200"] = {
          description: "成功响应",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/BaseResponse" },
                  {
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          commodityTypeList: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/CommodityType",
                            },
                          },
                          member: {
                            $ref: "#/components/schemas/Commodity对象",
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        };
      }

      // 添加全局参数
      openapiOperation.parameters.push(
        { $ref: "#/components/parameters/Authorization" },
        { $ref: "#/components/parameters/AcceptLanguage" },
        { $ref: "#/components/parameters/Address" }
      );

      // 处理其他参数
      if (operation.parameters) {
        operation.parameters.forEach((param) => {
          // 转换参数schema
          if (param.schema) {
            param.schema = convertSchema(param.schema);
          }
          const parameter = {
            name: param.name,
            in: param.in,
            description: param.description,
            required: param.required || false,
            schema: param.schema || { type: param.type },
          };

          if (param.in === "body") {
            openapiOperation.requestBody = {
              content: {
                "application/json": {
                  schema: convertSchema(param.schema),
                },
              },
            };
          } else {
            openapiOperation.parameters.push(parameter);
          }
        });
      }

      // 处理文件上传
      if (operation.consumes?.includes("multipart/form-data")) {
        openapiOperation.requestBody = {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        };
      }

      openapiDoc.paths[path][method] = openapiOperation;
    }
  }

  return JSON.stringify(openapiDoc, null, 2);

  // Helper functions
  function convertSchema(schema) {
    // 处理顶层schema
    if (schema.$ref) {
      return { $ref: `#/components/schemas/${schema.$ref.split("/").pop()}` };
    }

    // 深度处理数组类型
    if (schema.type === "array") {
      if (schema.items) {
        schema.items = convertSchema(schema.items);
      }
      return schema;
    }

    // 递归处理对象属性
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        schema.properties[propName] = convertSchema(propSchema);
      }
    }

    // 处理anyOf/allOf/oneOf
    ["anyOf", "allOf", "oneOf"].forEach((key) => {
      if (schema[key]) {
        schema[key] = schema[key].map((s) => convertSchema(s));
      }
    });

    // 处理additionalProperties
    if (schema.additionalProperties) {
      schema.additionalProperties = convertSchema(schema.additionalProperties);
    }

    return schema;
  }

  function convertResponses(responses) {
    return Object.entries(responses).reduce((acc, [code, response]) => {
      const converted = {
        description: response.description,
        content: {},
      };

      if (response.schema) {
        // 添加BaseResponse到schemas
        openapiDoc.components.schemas.BaseResponse = {
          type: "object",
          properties: {
            code: { type: "integer", example: 0 },
            msg: { type: "string", example: "Success" },
            timeMillis: {
              type: "integer",
              format: "int64",
              example: 1741101832125,
            },
            data: { type: "object" },
          },
        };

        // 修改响应结构
        converted.content["application/json"] = {
          schema: {
            allOf: [
              { $ref: "#/components/schemas/BaseResponse" },
              {
                properties: {
                  data: convertSchema(response.schema),
                },
              },
            ],
          },
        };
      }

      acc[code] = converted;
      return acc;
    }, {});
  }
}

// 使用示例
const fs = require("fs");

try {
  // 读取并解析Swagger文件
  const swaggerContent = fs.readFileSync("./swagger.json", "utf8");
  const swaggerDoc = JSON.parse(swaggerContent);

  // 执行转换
  const openapiDoc = convertToOpenAPI(swaggerDoc);

  // 写入OpenAPI文件
  fs.writeFileSync("openapi.json", openapiDoc);
  console.log("转换成功，结果已保存至openapi.json");
} catch (error) {
  console.error("转换失败:", error.message);
  if (error.code === "ENOENT") {
    console.error("错误: 找不到swagger.json文件");
  } else if (error instanceof SyntaxError) {
    console.error("错误: JSON解析失败，请检查文件格式");
  }
}
