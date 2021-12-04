import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleClientId, googleClientSecret } from './config';

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: 'http://localhost:3001/auth/google/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile.id);
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    },
  ),
);

// Saves user's ID to a session
passport.serializeUser((user, done) => {
  // @ts-ignore
  done(null, user.id);
});
// Retrieve user's ID from a session
passport.deserializeUser((id, done) => {
  done(null, { id });
});
