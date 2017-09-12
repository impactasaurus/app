'use strict';

if (process.env.NODE_ENV === 'production') {
  console.log("Production build");
  module.exports = require('./prod');
} else {
  console.log("Development build");
  module.exports = require('./dev');
}
