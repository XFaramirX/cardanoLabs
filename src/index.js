import "core-js/stable";
import "regenerator-runtime/runtime";

import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
const { ApolloServer, ApolloError, gql, MockList } = require("apollo-server");

// Firebase App (the core Firebase SDK) is always required and must be listed before other Firebase SDKs
const admin = require("firebase-admin");
const serviceAccount = require("../service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angelbernalesquivel-ecf4b-default-rtdb.firebaseio.com",
});

const schema = loadSchemaSync(
  join(__dirname, "../src/graphql/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

// Resolver map
const resolvers = {
  Query: {
    async images() {
      try {
        const images = await admin.firestore().collection("images").get();

        return images.docs.map((image) => image.data());
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
};

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

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

const server = new ApolloServer({
  schema: schemaWithResolvers,
  graphiql: true,
  // mocks,
  // mockEntireSchema: false,
});

// Launch the server
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
