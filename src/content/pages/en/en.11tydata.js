module.exports = {
  locale: "en",
  permalink: (data) => {
    const file = data.page.filePathStem.split("/").pop();
    if (file === "index") return "/en/";
    return `/en/${file}/`;
  },
};