/** General Configurations Like PORT, HOST names and etc... */

var config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8889,
  karmaPort: 9876,

  app: {
    head: {
      title: 'Impactasaurus',
      titleTemplate: '%s | Impactasaurus',
    }
  }
};

module.exports = config;
