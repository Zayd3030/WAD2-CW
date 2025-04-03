function checkAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect("/login");
  }
  
  function checkOrganiser(req, res, next) {
    if (req.session.user && req.session.user.role === "organiser") return next();
    res.status(403).send("Forbidden: Organiser access only.");
  }
  
  module.exports = { checkAuthenticated, checkOrganiser };
  