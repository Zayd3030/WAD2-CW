//  middleware functions to check if a user is authenticated and if they are an organiser.
function checkAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect("/login");
  }
  
  // Middleware to check if the user is an organiser
  function checkOrganiser(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === "organiser") {
      return next();
    }
    res.status(403).send("Forbidden: Organiser access only.");
  }
  
  
  module.exports = { checkAuthenticated, checkOrganiser };
  