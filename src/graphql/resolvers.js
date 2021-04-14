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
