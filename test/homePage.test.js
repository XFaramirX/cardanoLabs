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

it("Fetches All Images", async () => {
  const GET_IMAGES = gql`
    query {
      getImages {
        id
        title
        url
        attributes
        description
        createdBy
      }
    }
  `;

  const response = await query({ query: GET_IMAGES });
  expect(response).toMatchSnapshot();
});

it("Fetches All Artist", async () => {
  const GET_ALL_ARTIST = gql`
    query {
      getAllArtist {
        id
        name
        instagram
        images {
          id
          title
          url
          attributes
          description
          createdBy
        }
      }
    }
  `;

  const response = await query({ query: GET_ALL_ARTIST });
  expect(response).toMatchSnapshot();
});

it("Fetches Artist By ID", async () => {
  const GET_ALL_ARTIST = gql`
    query {
      getArtist(id: "UVrxdwKDO4MmjXizLSjV") {
        id
        name
        instagram
        images {
          id
          title
          url
          attributes
          description
          createdBy
        }
      }
    }
  `;

  const response = await query({ query: GET_ALL_ARTIST });
  expect(response).toMatchSnapshot();
});
