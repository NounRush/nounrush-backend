import AuthRepository from "./auth.repository";
import bcrypt from "bcrypt"
import { NotFoundError, BadRequestError, InternalServerError, ConflictError } from "../../middleware/error";
import { RefreshTokenService, AccessTokenService } from "./tokens.service";
import redis from "../../utils/cache/redis";
import { sendVerificationEmail } from "../../utils/emails/emails";

const authRepository = new AuthRepository();
const RTS = new RefreshTokenService();
const ATS = new AccessTokenService();

export default class AuthService {
    /**
     * Asynchronously creates a new user if the user does not already exist,
     * using the provided username, email, and password.
     *
     * @param {string} username - the username of the new user
     * @param {string} email - the email of the new user
     * @param {string} password - the password of the new user
     * @return {Promise<User | null>} the newly created user if successful, 
     * or null if the user already exists
     */
    async createUser (username: string, email: string, password: string) {
        const existingUser = await authRepository.findByEmail(email) || await authRepository.findByUsername(username);
        if (existingUser) {
            return null;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await authRepository.addUser(username, email, hashedPassword);
        const refreshToken = await RTS.generateToken(user._id);
        return user;
    }

    /**
     * Asynchronously logs in a user using the provided email and password.
     *
     * @param {string} email - the user's email
     * @param {string} password - the user's password
     * @return {Promise<string | null>} the access token for the logged in user or null if login fails
     */
    async loginUser (email: string, password: string) {
        const user = await authRepository.findByEmail(email);
        if (!user) {
            return null;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return null;
        }
        const refreshToken = await RTS.replaceToken(user._id);
        const accessToken = await ATS.generateToken(user);
        return accessToken;
    }

    /**
     * Logout a user by destroying their token.
     *
     * @param {string} user_id - the ID of the user
     * @return {Promise<void>} a promise that resolves when the token is destroyed
     */
    async logoutUser (user_id: string) {
        await RTS.destroyToken(user_id);
    }

    /**
     * Asynchronously retrieves a user by their user ID.
     *
     * @param {string} user_id - The ID of the user to retrieve
     * @return {Promise<User | null>} The user object, or null if not found
     */
    async getUser(user_id: string) {
        const user = await authRepository.findById(user_id);
        if (!user) {
            return null;
        }
        return user;
    }

    /**
     * Asynchronously retrieves the access token for the specified user.
     *
     * @param {string} user_id - The ID of the user for whom to retrieve the access token.
     * @return {Promise<string>} The access token for the specified user.
     */
    async getAccessToken (user_id: string) {
        const user = await authRepository.findById(user_id);
        if (!user) {
            return null;
        }
        const accessToken = await ATS.generateToken(user);
        return accessToken;
    }

    /**
     * Asynchronously starts the verification process for a user.
     *
     * @param {string} user_id - The ID of the user to start verification for.
     * @return {Promise<void>} Returns a Promise that resolves when the verification process is started.
     */
    async startVerification(user_id: string) {
        const user = await authRepository.findById(user_id);
        if (!user) {
            return null
        }
        const verificationToken = Math.random().toString(36).substr(2, 6);
        const redisToken = redis.set(user_id, verificationToken, { "EX": 600 });
        if (!redisToken) {
            return null;
        }
        await sendVerificationEmail(user);
        return true;
    }

async endVerification(user_id: string, token: string) {
    try {
        const user = await authRepository.findById(user_id);
        if (!user) {
            return null;
        }
        const redisToken = await redis.get(user_id);
        if (redisToken !== token) {
            return null;
        }
        const userWithToken = await authRepository.updateVerificationAndIsVerified(user_id);
        return userWithToken;
    } catch (error) {
        throw error;
    }
}
}