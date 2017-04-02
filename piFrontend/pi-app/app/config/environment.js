/*jslint node: true */
"use strict";

// config/environment.js

module.exports = function(environment) {
  var ENV = {environment:environment};
  ENV.serviceWorker = {
      enabled: true,
      debug: true,
      sourcemaps: true,
      precacheURLs: ['/assets/vendor2.js'],
      excludePaths: ['test.*', 'robots.txt',],
      networkFirstURLs: ['/api',],
      includeRegistration: true,
      serviceWorkerFile: "service-worker.js",
      skipWaiting: true,
  };
  return ENV;
};
