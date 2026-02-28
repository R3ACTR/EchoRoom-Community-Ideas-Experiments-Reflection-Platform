import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { loginWithGoogle } from "../services/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";
        const avatar = profile.photos?.[0]?.value;

        const result = await loginWithGoogle(
          email,
          firstName,
          lastName,
          avatar
        );

        return done(null, result);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;