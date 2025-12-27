module.exports = {
  locale: "fr",
  lang: "fr",
  permalink: (data) => {
    const file = data.page.filePathStem.split("/").pop(); // "index", "about", etc.
    if (file === "index") return "/fr/";
    return `/fr/${file}/`;
  },
};
