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

export default mocks;
