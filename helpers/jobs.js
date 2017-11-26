let nodeServerPatternPrefix = null;
let staticServerPattern = null;
let distServerPatternPrefix = null;

const getUrlPatterns = () => {
  const returnObj = {
    pages: [],
    js: '',
  };
  /*
  http://stackoverflow.com/questions/5090103/javascript-regexp-dynamic-generation-from-variables
  */
  switch (process.env.NODE_ENV) {
    case 'development': {
      nodeServerPatternPrefix = '^http:\\/\\/localhost:3000\\/';
      staticServerPattern = '^http:\\/\\/localhost:3001\\/static\\/';
      distServerPatternPrefix = '^http:\\/\\/localhost:3001\\/static\\/';
      break;
    }
    case 'production': {
      nodeServerPatternPrefix = '^https:\\/\\/www.quikr.com\\/';
      staticServerPattern = '^https:\\/\\/www.quikr.com\\/dist\\/';
      distServerPatternPrefix = 'https:\\/\\/teja8.kuikr.com\\/jobs\\/';
      break;
    }
    case 'stage': {
      nodeServerPatternPrefix = '^https:\\/\\/www.quikr.com\\/';
      staticServerPattern = '^https:\\/\\/www.quikr.com\\/dist\\/';
      distServerPatternPrefix = 'https:\\/\\/teja8.kuikr.com\\/jobs\\/';
      break;
    }
    default: break;
  }
  returnObj.apis = 'https:\\/\\/www.quikr.com\\/jobs\\/api\\/qc\\/jobs\\/v1\\/sme\\/view\\/listing';
  returnObj.assets = new RegExp(`${staticServerPattern}`);
  returnObj.js = new RegExp(`${distServerPatternPrefix}`);
  return returnObj;
};

const patterns = getUrlPatterns();

const jobsStrategies = [
  {
    urlPattern: patterns.assets,
    handler: 'cacheFirst',
    options: {
      cache: {
        name: 'assets',
        maxAgeSeconds: 60 * 60 * 24 * 6,
        maxEntries: 25,

      },
    },
  },
  {
    urlPattern: patterns.js,
    handler: 'cacheFirst',
    options: {
      cache: {
        name: 'js',
        maxAgeSeconds: 60 * 60 * 24 * 6,
        maxEntries: 25,

      },
    },
  },
  {
    urlPattern: patterns.apis,
    handler: 'cacheFirst',
    options: {
      cache: {
        name: 'apis',
        maxAgeSeconds: 60 * 60 * 24 * 6,
        maxEntries: 15,
      },
    },
  },
];

const jobsPages = [
  {
    pattern: new RegExp(`${nodeServerPatternPrefix}jobs`),
  },
];

const pattern = {
  strategy: jobsStrategies,
  pages: jobsPages,
};

module.exports = pattern;
