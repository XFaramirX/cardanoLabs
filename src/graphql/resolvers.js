const { ApolloError } = require("apollo-server");

// Firebase App (the core Firebase SDK) is always required and must be listed before other Firebase SDKs
const admin = require("firebase-admin");
const serviceAccount = require("../../service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angelbernalesquivel-ecf4b-default-rtdb.firebaseio.com",
});
// Resolver map

async function images(parent) {
  try {
    const images = await admin.firestore().collection("images").get();
    return images.docs.map((image) => image.data());
  } catch (error) {
    throw new ApolloError(error);
  }
}

async function getArtist(parent) {
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
}

const resolvers = {
  Query: {
    images,
  },
  Image: {
    artist: getArtist,
  },
};

export default resolvers;
