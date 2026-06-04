//Passport middleware
const User = require('../models/User');
module.exports = (passport) => {
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
