const path = require("path");

module.exports = {
  eleventyComputed: {
    // language based on folder: en / fr / de
    lang: (data) => {
      const stem = data.page.filePathStem.replace(/\\/g, "/"); // windows-safe
      const m = stem.match(/\/content\/pages\/(en|fr|de)\//);
      return m ? m[1] : undefined;
    },

    // groups translations together:
    // en/about -> "about"
    // fr/about -> "about"
    // de/services/audit -> "services/audit"
    translationKey: (data) => {
      const stem = data.page.filePathStem.replace(/\\/g, "/");
      const m = stem.match(/\/content\/pages\/(en|fr|de)\/(.+)$/);
      return m ? m[2] : stem;
    },
  },
};
