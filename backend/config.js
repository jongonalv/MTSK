const config = {
  application: {
    cors: {
      server: [
        {
          origin: "https://mtsk.bellota.com",
          credentials: true
        }
      ]
    }
  }
};

module.exports = config;
