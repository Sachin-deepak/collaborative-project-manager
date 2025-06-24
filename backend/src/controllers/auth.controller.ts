// Importing necessary types and modules
import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { registerSchema } from '../validation/auth.validation';
import { HTTPSTATUS } from '../config/http.config';
import { registerUserService } from '../services/auth.service';
import { signJwtToken } from '../utils/jwt';
import { UnauthorizedException } from '../utils/appError';

// User registration controller
export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({ ...req.body });
    const { userId } = await registerUserService(body);
    const access_token = signJwtToken({ userId });
    return res.status(HTTPSTATUS.CREATED).json({
      message: 'User registered successfully',
      access_token,
      user: { _id: userId },
    });
  }
);

// User login controller
export const loginController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new UnauthorizedException('Authentication failed');
  }

  const access_token = signJwtToken({ userId: req.user._id });

  return res.status(HTTPSTATUS.OK).json({
    message: 'Logged in successfully',
    access_token,
    user: req.user,
  });
});

// User logout controller
export const logOutController = asyncHandler(async (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error: ', err);
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Logout failed',
        error: 'Failed to logout',
      });
    }
  });

  req.session = null;

  return res.status(HTTPSTATUS.OK).json({
    message: 'Logged out successfully',
  });
});

/*
  Google Login Callback:

  Redirects the user to the appropriate workspace after successful authentication.
  Uses encodeURIComponent to properly format the redirect URI.
  User Registration Controller:

  Uses the registration schema to validate the incoming request data.
  Calls a service to register the user and sends a success response.
  User Login Controller:

  Uses Passport's local authentication strategy.
  Handles errors, failed login attempts, and successful login scenarios.
  Uses req.logIn() to establish the session after successful authentication.
  User Logout Controller:

  Uses req.logout() to terminate the session.
  Handles errors during logout and clears the session.
  Sends a response indicating successful logout.
*/

