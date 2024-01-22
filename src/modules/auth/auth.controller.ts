import AuthService from "./auth.service";
import { NotFoundError, BadRequestError, InternalServerError, ConflictError } from "../../middleware/error";
import * as validator from "./auth.validator"
import { Request, Response } from "express";

const authService = new AuthService();

export default class AuthController {
    async createPlayer (req: Request, res: Response) {
        const data = req.body;
        const { error } = validator.registerBody.validate(data);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        const { username, email, password } = data;
        const user = await authService.createUser(username, email, password);
        if (!user) {
            throw new ConflictError("User already exists");
        }
        return res.status(201).json(user);
    }

    async loginPlayer (req: Request, res: Response) {
        const data = req.body;
        const { error } = validator.loginBody.validate(data);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        const { email, password } = data;
        const accessToken = await authService.loginUser(email, password);
        if (!accessToken) {
            throw new InternalServerError("Login failed");
        }
        return res.status(200).json({ accessToken });
    }

    async logoutPlayer (req: Request, res: Response) {
        const { user_id } = req.params;
        await authService.logoutUser(user_id)
        return res.status(200).json({ message: "Logout successful" });
    }

    async getPlayer (req: Request, res: Response) {
        const { user_id } = req.params;
        const user = await authService.getUser(user_id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return res.status(200).json(user);
    }

    async startVerificationProcess(req: Request, res: Response) {
        const { user_id } = req.params;
        const token = await authService.startVerification(user_id);
        if (!token) {
            throw new InternalServerError("Verification failed");
        }
        return res.status(200).json({ message: "Verification email sent" });
    }

    async endVerificationProcess(req: Request, res: Response) {
        const { user_id } = req.params;
        const token = req.body.token;
        const userVerified = await authService.endVerification(user_id, token);
        if (!userVerified) {
            throw new InternalServerError("Verification failed");
        }
        return res.status(200).json({ message: "Verification successful" });
    }
}