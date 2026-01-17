// ELEVENTY CONFIGURATION

// 📦 Plugin Imports
const pluginImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const pluginMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");

// ⚙️ Configuration Files
const configSitemap = require("./src/config/plugins/sitemap");
const configImages = require("./src/config/plugins/images");

// 🔧 Processing Functions
const sass = require("./src/config/processors/sass");
const javascript = require("./src/config/processors/javascript");

// 🛠️ Utilities
const filterPostDate = require("./src/config/filters/postDate");
const filterIsoDate = require("./src/config/filters/isoDate");

const isProduction = process.env.ELEVENTY_ENV === "PROD";

module.exports = function (eleventyConfig) {
  // Build events
  eleventyConfig.on("eleventy.after", javascript);
  eleventyConfig.on("eleventy.after", sass);

  // Plugins
  eleventyConfig.addPlugin(pluginImages, configImages);
  eleventyConfig.addPlugin(pluginSitemap, configSitemap);
  eleventyConfig.addPassthroughCopy("./src/_headers");


  if (isProduction) {
    eleventyConfig.addPlugin(pluginMinifier);
  }

  // Passthrough copies
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addPassthroughCopy("./src/_redirects");

  // Filters
  eleventyConfig.addFilter("postDate", filterPostDate);
  eleventyConfig.addFilter("isoDate", filterIsoDate);

  // Shortcodes
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // ✅ Multilingual Sitemap Collection (hreflang)
  eleventyConfig.addCollection("sitemap", (collectionApi) => {
    // Pick up your content pages only
    const pages = collectionApi.getFilteredByGlob(
      "src/content/pages/**/*.{md,njk,html,liquid}"
    );

    // Group by translationKey (computed from folder structure)
    const groups = {};
    for (const page of pages) {
      const key = page.data.translationKey;
      const lang = page.data.lang;

      // Only include pages that actually have lang+translationKey
      if (!key || !lang) continue;

      if (!groups[key]) groups[key] = [];
      groups[key].push(page);
    }

    // For each page, attach sitemap.links = all translations in the same group
    return pages
      .filter((page) => page.data.translationKey && page.data.lang)
      .map((page) => {
        const siblings = groups[page.data.translationKey] || [];

        return {
          url: page.url,
          date: page.date,
          data: {
            ...page.data,
            sitemap: {
              ...(page.data.sitemap || {}),
              links: siblings
                .filter((p) => p.data.lang && p.url)
                .map((p) => ({
                  lang: p.data.lang,
                  url: p.url,
                })),
            },
          },
        };
      });
  });

  // Eleventy directories / engines
  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
  };
};

