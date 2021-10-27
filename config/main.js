/** General Configurations Like PORT, HOST names and etc... */

var config = {
  env: process.env.NODE_ENV || 'development',
  build: process.env.VERSION || 'unknown',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8889,
  karmaPort: 9876,

  app: {
    api: "https://api.impactasaurus.org",
    root: process.env.NODE_ENV === "production" ?
      (location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')) :
      "http://localhost:8080",
    head: {
      title: 'Impactasaurus',
      titleTemplate: '%s | Impactasaurus',
    },
    auth: {
      clientID: "pfKiAOUJh5r6jCxRn5vUYq7odQsjPUKf",
      domain: "auth.impactasaurus.org",
      scope : "openid profile email",
      connection: "Username-Password-Authentication",
      publicPages: [/login/, /jti\/.*/, /smn\/.*/, /redirect/, /signup/,  /invite\/.*/, /unsubscribe\/.*/],
      loginPrompt: [/invite\/.*/]
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
