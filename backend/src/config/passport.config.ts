// Importing necessary modules and strategies for authentication
import passport from 'passport'; // Passport.js for authentication
import { Strategy as LocalStrategy } from 'passport-local'; // Local authentication strategy
import { config } from './app.config'; // Configuration file for environment variables
import {
  findUserById,
  verifyUserService,
} from '../services/auth.service'; // Authentication services
import { signJwtToken } from '../utils/jwt';
import { StrategyOptions, ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

// Setting up Local authentication strategy (username and password)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Specifies that the username field in the request will be 'email'
      passwordField: 'password', // Specifies that the password field in the request will be 'password'
      session: false, // Disables persistent login sessions
    },
    async (email, password, done) => {
      try {
        // Verify the user with the given email and password using a service
        const user = await verifyUserService({ email, password });
        // If successful, pass the user object to the next middleware
        return done(null, user);
      } catch (error: any) {
        // If authentication fails, pass the error and false to indicate failure
        return done(error, false, { message: error?.message });
      }
    }
  )
);

interface JwtPayload {
  userId: string;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
  audience: ['user'],
  algorithms: ['HS256'],
};

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done) => {
    try {
      const user = await findUserById(payload.userId);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(null, false);
    }
  })
);

export const passportAuthenticationJWT = passport.authenticate('jwt', { session: false });
export const passportAuthenticationLocal = passport.authenticate('local', { session: false });

