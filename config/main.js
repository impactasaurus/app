/** General Configurations Like PORT, HOST names and etc... */

var config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8889,
  karmaPort: 9876,

  app: {
    api: "api.github.com",
    head: {
      title: 'Impactasaurus',
      titleTemplate: '%s | Impactasaurus',
    },
    auth: {
      clientID: "pfKiAOUJh5r6jCxRn5vUYq7odQsjPUKf",
      domain: "impact.eu.auth0.com",
      scope : "openid app_metadata user_metadata"
    }
  }
};

module.exports = config;
