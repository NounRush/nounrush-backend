import AuthRepository from "./auth.repository";
import bcrypt from "bcrypt"
import { NotFoundError, BadRequestError, InternalServerError, ConflictError } from "../../middleware/error";
import { RefreshTokenService, AccessTokenService } from "./tokens.service";

const authRepository = new AuthRepository();

export default class AuthService {
    async createUser (username: string, email: string, password: string) {
        const existingUser = await authRepository.findByEmail(email) || await authRepository.findByUsername(username);
        if (existingUser) {
            throw new ConflictError("User already exists!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await authRepository.addUser(username, email, hashedPassword);
        return user;
    }
}