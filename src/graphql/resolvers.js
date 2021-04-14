const { ApolloError } = require("apollo-server");

// Firebase App (the core Firebase SDK) is always required and must be listed before other Firebase SDKs
const admin = require("firebase-admin");
const serviceAccount = require("../../service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angelbernalesquivel-ecf4b-default-rtdb.firebaseio.com",
});

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

export default resolvers;
