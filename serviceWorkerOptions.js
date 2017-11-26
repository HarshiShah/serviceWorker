const path = require('path');

const servicesPattern = require(path.resolve(__dirname, 'helpers/services.js'));
const jobsPattern = require(path.resolve(__dirname, 'helpers/jobs.js'));
const patterns = [servicesPattern, jobsPattern];
const count = patterns.length;
let cachingStrategeies = [];
let pages = [];
for (let i = 0; i < count; i++) {
  cachingStrategeies = [...cachingStrategeies, ...patterns[i].strategy];
  pages = [...pages, ...patterns[i].pages];
}
const config = {
  filepath: path.resolve(__dirname, 'public/serviceWorker.js'),
  cacheId: 'sw1',
  clientsClaim: false,
  handleFetch: true, // true in production
  ignoreUrlParametersMatching: [/^utm_/], // to ignore some utm params in get requests
  maximumFileSizeToCacheInBytes: 1, // default to 2mb per cache
  verbose: true,
  runtimeCaching: cachingStrategeies,
};
/**
 * Returns an array of runtimeCaching strategy for different navigation routes
 * takes array of objects from patterns
 * @return {[type]} [description]
 */

const getPageRoutesRuntimeCaching = (pageRoutes) => pageRoutes.map((v) => ({
  urlPattern: v.pattern,
  handler: v.handler || 'networkFirst',
  options: {
    cache: {
      name: 'pages',
      maxAgeSeconds: 60 * 60 * 24 * 6,
      maxEntries: v.maxEntries || 15,
    },
  },
})
);

config.runtimeCaching = [...config.runtimeCaching, ...(getPageRoutesRuntimeCaching(pages))];

module.exports = config;
