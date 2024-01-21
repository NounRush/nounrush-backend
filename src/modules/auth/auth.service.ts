import AuthRepository from "./auth.repository";
import bcrypt from "bcrypt"
import { NotFoundError, BadRequestError, InternalServerError, ConflictError } from "../../middleware/error";
import { RefreshTokenService, AccessTokenService } from "./tokens.service";
import { sendVerificationEmail } from "../../utils/emails/emails";

const authRepository = new AuthRepository();
const RTS = new RefreshTokenService();
const ATS = new AccessTokenService();

export default class AuthService {
    async createUser (username: string, email: string, password: string) {
        const existingUser = await authRepository.findByEmail(email) || await authRepository.findByUsername(username);
        if (existingUser) {
            // throw new ConflictError("User already exists!");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await authRepository.addUser(username, email, hashedPassword);
        const refreshToken = await RTS.generateToken(user._id);
        return user;
    }

    async loginUser (email: string, password: string) {
        const user = await authRepository.findByEmail(email);
        if (!user) {
            // throw new NotFoundError("User not found!");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            // throw new BadRequestError("Invalid password!");
        }
        const refreshToken = await RTS.replaceToken(user._id);
        const accessToken = await ATS.generateToken(user);
        return accessToken;
    }

    async logoutUser (user_id: string) {
        await RTS.destroyToken(user_id);
    }

    async getUser(user_id: string) {
        const user = await authRepository.findById(user_id);
        if (!user) {
            // throw new NotFoundError("User not found!");
        }
        return user;
    }

    async getAccessToken (user_id: string) {
        const user = await authRepository.findById(user_id);
        if (!user) {
            // throw new NotFoundError("User not found!");
        }
        const accessToken = await ATS.generateToken(user);
        return accessToken;
    }

    async startVerification(user_id: string) {
        const user = await authRepository.findById(user_id);
        if (!user) {
            // throw new NotFoundError("User not found!");
        }
        const verificationToken = Math.random().toString(36).substr(2, 6);
        const userWithToken = await authRepository.updateVerificationToken(user_id, verificationToken);
        await sendVerificationEmail(userWithToken);
    }

    async endVerification(user_id: string, token: string) {
        const user = await authRepository.findById(user_id);
        if (!user) {
            // throw new NotFoundError("User not found!");
        }
        if (user.isVerified) {
            // throw new BadRequestError("User is already verified!");
        }
        if (user.verificationToken !== token) {
            // throw new BadRequestError("Invalid verification token!");
        }
        const userWithToken = await authRepository.revokeVerificationToken(user_id);
        const userVerified = await authRepository.setIsVerified(user_id, true);
        return userVerified;
    }
}