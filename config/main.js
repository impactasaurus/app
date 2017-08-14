/** General Configurations Like PORT, HOST names and etc... */

var config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8889,
  karmaPort: 9876,

  app: {
    api: "https://impact-server.herokuapp.com/v1/graphql",
    head: {
      title: 'Impactasaurus',
      titleTemplate: '%s | Impactasaurus',
    },
    auth: {
      clientID: "pfKiAOUJh5r6jCxRn5vUYq7odQsjPUKf",
      domain: "impact.eu.auth0.com",
      scope : "openid app_metadata user_metadata"
    },
    analytics: {
      debug: process.env.NODE_ENV !== "production",
      trackingID: "UA-61133305-4"
    }
  }
};

module.exports = config;
