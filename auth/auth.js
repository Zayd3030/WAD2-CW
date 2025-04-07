function checkAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login");
}

function checkOrganiser(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "organiser") {
    return next();
  }
  res.redirect("/login");
}

module.exports = {
  checkAuthenticated,
  checkOrganiser
};
