const { ApolloServer, ApolloError, gql, MockList } = require("apollo-server");
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs

var admin = require("firebase-admin");

var serviceAccount = require("./service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angelbernalesquivel-ecf4b-default-rtdb.firebaseio.com",
});

const libraries = [
  {
    branch: "downtown",
  },
  {
    branch: "riverside",
  },
];

// The branch field of a book indicates which library has it in stock
const books = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
    branch: "riverside",
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
    branch: "downtown",
  },
];

// Schema definition
const typeDefs = gql`
  type Cat {
    name: String
    lifespan: String
    weigth: String
    description: String
  }

  # A library has a branch and books
  type Library {
    branch: String!
    books: [Book!]
  }

  # A book has a title and author
  type Book {
    id: ID!
    title: String!
    author: Author!
  }

  # An author has a name
  type Author {
    name: String!
  }

  type Image {
    id: ID!
    title: String!
    url: String
  }

  # Queries can fetch a list of libraries
  type Query {
    cats: [Cat]
    libraries: [Library]
    images: [Image]
  }
`;

// Resolver map
const resolvers = {
  Library: {
    books(parent) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return books.filter((book) => book.branch === parent.branch);
    },
  },
  Book: {
    // The parent resolver (Library.books) returns an object with the
    // author's name in the "author" field. Return a JSON object containing
    // the name, because this field expects an object.
    author(parent) {
      return {
        name: parent.author,
      };
    },
  },

  Query: {
    async cats(name) {
      try {
        const listCats = await admin.firestore().collection("cats").get();

        const docRef = admin.firestore().collection("users").doc("alovelace");
        await docRef.set({
          first: "Ada",
          last: "Lovelace",
          born: 1815,
        });

        const snapshot = await admin.firestore().collection("users").get();
        console.log(snapshot);

        return listCats.docs.map((cat) => cat.data());
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async images() {
      try {
        const images = await admin.firestore().collection("images").get();

        return images.docs.map((image) => image.data());
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    libraries() {
      // Return our hardcoded array of libraries
      return libraries;
    },
  },
  // Because Book.author returns an object with a "name" field,
  // Apollo Server's default resolver for Author.name will work.
  // We don't need to define one.
};

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
// Pass schema definition and resolvers to the
// ApolloServer constructor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // mocks,
  // mockEntireSchema: false,
});

// Launch the server
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
