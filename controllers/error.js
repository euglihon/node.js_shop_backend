exports.get404 = (req, res) => {
  res.status(404).render("404.pug", {
    docTitle: "Page not found",
    isAuthenticated: req.isLoggedIn,
  });
};

exports.get500 = (req, res) => {
  res.status(500).render("500.pug", {
    docTitle: "Error 500 !",
    isAuthenticated: req.isLoggedIn,
  });
};
