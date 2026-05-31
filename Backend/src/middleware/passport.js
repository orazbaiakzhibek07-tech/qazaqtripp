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

  if (!process.env.GITHUB_CLIENT_ID) return;

  const GitHubStrategy = require('passport-github2').Strategy;
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        const email = profile.emails?.[0]?.value;
        user = await User.create({
          name: profile.displayName || profile.username,
          email: email || `${profile.id}@github.local`,
          githubId: profile.id,
          avatar: profile.photos?.[0]?.value || null,
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
};