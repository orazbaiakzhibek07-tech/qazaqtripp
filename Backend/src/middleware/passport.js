// middleware/passport.js
const User = require('../models/User');

module.exports = (passport) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.warn('⚠️  GitHub OAuth баптанбаған — өткізіп жіберілді');
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
      try { const user = await User.findById(id); done(null, user); }
      catch (err) { done(err, null); }
    });
    return;
  }

  const GitHubStrategy = require('passport-github2').Strategy;
  passport.use(new GitHubStrategy({
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find existing user by GitHub ID
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        // Try to find by email
        const email = profile.emails?.[0]?.value;
        if (email) user = await User.findOne({ email });

        if (!user) {
          // Create new user
          user = await User.create({
            name:     profile.displayName || profile.username,
            email:    email || `${profile.id}@github.local`,
            githubId: profile.id,
            avatar:   profile.photos?.[0]?.value || null,
          });
        } else {
          // Link GitHub to existing account
          user.githubId = profile.id;
          user.avatar   = user.avatar || profile.photos?.[0]?.value;
          await user.save();
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

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
