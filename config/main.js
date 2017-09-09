/** General Configurations Like PORT, HOST names and etc... */

var config = {
  env: process.env.NODE_ENV || 'development',
  build: process.env.VERSION || 'unknown',
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
    },
    errorTracking: {
      url: 'https://71e3420a645d4212988b4346d101c24d@sentry.io/214668',
    },
  }
};

module.exports = config;
