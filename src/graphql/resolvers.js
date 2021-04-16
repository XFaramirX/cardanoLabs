const { ApolloError } = require("apollo-server");

// Firebase App (the core Firebase SDK) is always required and must be listed before other Firebase SDKs
const admin = require("firebase-admin");
const serviceAccount = require("../../service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angelbernalesquivel-ecf4b-default-rtdb.firebaseio.com",
});
// Resolver map

const db = admin.firestore();

async function getImages(parent, args, context, info) {
  const imagesRef = await db.collection("images").get();
  try {
    if (!imagesRef.docs[0].exists) {
      // No document exist
    } else {
      return imagesRef.docs.map((image) => image.data());
    }
  } catch (error) {
    throw new ApolloError(error);
  }
}

async function getArtist(parent, args, context, info) {
  const artists = await admin
    .firestore()
    .collection("artist")
    .doc(args.id)
    .get();

  try {
    if (!artists.exists) {
      // No document exist
    } else {
      return artists.data();
    }
  } catch (error) {
    throw new ApolloError(error);
  }
}

async function getAllArtist(parent, args, context, info) {
  try {
    const artistList = await admin.firestore().collection("artist").get();
    return artistList.docs.map((artist) => artist.data());
  } catch (error) {
    throw new ApolloError(error);
  }
}
async function getImagesbyArtist(parent, args, context, info) {
  const imagesRef = await db.collection("images").get();
  try {
    const result = imagesRef.docs.map((image) => image.data());
    return result.filter((res) => res.createdBy == parent.name);
  } catch (error) {
    throw new ApolloError(error);
  }
}

const resolvers = {
  Query: {
    getAllArtist,
    getArtist,
    getImages,
  },
  Artist: {
    images: getImagesbyArtist,
  },
};

export default resolvers;
