import "core-js/stable";
import "regenerator-runtime/runtime";
import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
const { ApolloServer } = require("apollo-server");
require("dotenv").config();
const schema = loadSchemaSync(
  join(__dirname, "../src/graphql/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});
import resolvers from "../src/graphql/resolvers";
import mocks from "../test/mocks";

const server = new ApolloServer({
  schema: schemaWithResolvers,
  graphiql: false,
  tracing: true,
  playground: {
    settings: {
      "editor.theme": "dark",
    },
    tabs: [
      {
        endpoint: "graphql",
      },
    ],
  },
  // mocks,
  // mockEntireSchema: false,
});

// Launch the server
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
