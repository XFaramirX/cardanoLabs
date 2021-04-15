import "core-js/stable";
import "regenerator-runtime/runtime";

import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
const { ApolloServer, gql, MockList } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");

const schema = loadSchemaSync(
  join(__dirname, "../src/graphql/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

import resolvers from "../src/graphql/resolvers";

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const server = new ApolloServer({
  schema: schemaWithResolvers,
  graphiql: true,
  // mocks,
  // mockEntireSchema: false,
});

const { query, mutate } = createTestClient(server);

const mocks = {
  Query: () => ({
    images: () => new MockList([6, 9]),
  }),
  Image: () => ({
    title: () => "Astro Kitty, Space Explorer 01",
    url: () =>
      "https://res.cloudinary.com/dety84pbu/image/upload/v1606816219/kitty-veyron-sm_mctf3c.jpg",
  }),
};

it("Fetches Images", async () => {
  const FIND_USER = gql`
    query {
      images {
        id
        title
        url
      }
    }
  `;

  const res = await query({ query: FIND_USER });
  expect(res.data.images[0]).toEqual({
    id: "01",
    title: "BernalEsquivel01",
    url:
      "https://firebasestorage.googleapis.com/v0/b/angelbernalesquivel-0001.appspot.com/o/BestLandscape.jpg?alt=media&token=e25df19b-4818-4adb-ab70-8143949a0d87",
  });
  expect(res).toMatchSnapshot();
});
