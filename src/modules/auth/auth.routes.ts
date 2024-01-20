import express from 'express';
import AuthController from './auth.controller';

const AuthRouter = express.Router();
const authController = new AuthController();

// Routes for player creation, login, and retrieval
AuthRouter.post('/players', authController.createPlayer);
AuthRouter.post('/players/login', authController.loginPlayer);
AuthRouter.get('/players/:user_id', authController.getPlayer);

// Route for player logout
AuthRouter.post('/players/logout/:user_id', authController.logoutPlayer);

// Routes for email verification
AuthRouter.post('/verification/start/:user_id', authController.startVerificationProcess);
AuthRouter.post('/verification/end/:user_id', authController.endVerificationProcess);

export default AuthRouter;
