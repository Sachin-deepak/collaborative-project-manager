import { Router } from 'express';
import { loginController, logOutController, registerUserController } from '../controllers/auth.controller';
import { passportAuthenticationLocal } from '../config/passport.config';

const authRoutes = Router();

authRoutes.post('/register', registerUserController);
authRoutes.post('/login', passportAuthenticationLocal, loginController);
authRoutes.post('/logout', logOutController);

export default authRoutes;

