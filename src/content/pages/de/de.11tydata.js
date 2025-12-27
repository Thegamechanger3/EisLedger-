module.exports = {
  locale: "de",
  lang: "de",
  permalink: (data) => {
    const file = data.page.filePathStem.split("/").pop();
    if (file === "index") return "/de/";
    return `/de/${file}/`;
  },
};
