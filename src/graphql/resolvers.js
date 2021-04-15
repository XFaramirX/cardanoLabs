const { ApolloError } = require("apollo-server");

// Firebase App (the core Firebase SDK) is always required and must be listed before other Firebase SDKs
const admin = require("firebase-admin");
const serviceAccount = require("../../service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angelbernalesquivel-ecf4b-default-rtdb.firebaseio.com",
});
// Resolver map

const getImages = {
  async images() {
    try {
      const images = await admin.firestore().collection("images").get();
      return images.docs.map((image) => image.data());
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

const getArtist = {
  async artist(parent) {
    // Is mandatory to have the field artist on the firebase image/collection

    try {
      const artist = await admin
        .firestore()
        .collection("artist")
        .doc(parent.artist.id.replace(/ /g, ""))
        .get();

      return artist.data();
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

const resolvers = {
  Query: getImages,
  Image: getArtist,
};

export default resolvers;
