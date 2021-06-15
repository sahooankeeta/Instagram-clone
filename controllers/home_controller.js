module.exports.home = function (req, res) {
  return res.render("home", {
    title: "Insta | Home",
  });
};
