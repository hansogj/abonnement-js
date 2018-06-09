module.exports = function(config) {
  config.set({

    frameworks: ["jasmine", "karma-typescript"],

    files: [
      { pattern: "src/**/*.ts" },
      { pattern: "node_modules/array.defined/_bundle/polyfill.js" },
      { pattern: "test/**/*.ts" }
    ],

    preprocessors: {
      "src/**/*.ts": ["karma-typescript", "coverage"],
      "test/**/*.ts": ["karma-typescript"]
    },

    reporters: ["progress", "coverage", "karma-typescript"],

    browsers: ["PhantomJS"]
  });
};
