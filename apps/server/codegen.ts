import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/**/graphql/*.graphql",
  generates: {
    "./src/http/routers/graphql/generated/": {
      preset: "graphql-modules",
      presetConfig: {
        baseTypesPath: "base.ts",
        filename: "module.ts",
      },
      config: {
        typesSuffix: "GQL",
        contextType: "../graphQLContext.js#GraphQLContext",
        mapperTypeSuffix: "Domain",
        mappers: {
          // Example: "@/example#Example",
        },
        scalars: {
          Void: "String",
          DateTime: "String",
        },
      },
      plugins: [
        "typescript",
        "typescript-resolvers",
      ],
    },
  },
};
export default config;
