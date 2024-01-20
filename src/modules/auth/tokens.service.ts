import { User, RefreshToken } from "./auth.models"
import jwt from "jsonwebtoken"
import { NotFoundError, BadRequestError, InternalServerError, ConflictError, BadTokenError } from "../../middleware/error";
import { ObjectId } from "mongoose";

class Token {
    private jwtSecret: string;
    protected timeToExpire: string;
    

    constructor(timeToExpire: string) {
        this.jwtSecret = process.env.JWT_SECRET || "";
        this.timeToExpire = timeToExpire;
    }

    async generate(user: any, options: { encrypt: "user" | "id" } = { encrypt: "id" }) {
        if (options.encrypt == "user") {
            const token = jwt.sign({ user }, this.jwtSecret, { expiresIn: this.timeToExpire });
            return token;
        } else {
            const token = jwt.sign({ id: user._id }, this.jwtSecret, { expiresIn: this.timeToExpire });
            return token;
        }
    }

    async verify(token: string) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new BadTokenError();
        }
    }
}

export class RefreshTokenService extends Token {
    constructor() {
        super("30d");
    }

    async generateToken(user: any): Promise<string> {

        const token = this.generate(user, { encrypt: "id" });
        const refreshToken = new RefreshToken({ token, user_id: user._id });
        await refreshToken.save();
        return token;
    }

    async replaceToken(userId: any) {
        const user = await User.findById(userId);
        const token = this.generate(user);
        const refreshToken = await RefreshToken.findOneAndReplace({ user_id: userId }, { token });
        return refreshToken;
    }

    async verifyToken(token: string): Promise<any> {
        const data = await this.verify(token);
        if (data) {
            const refreshToken = await RefreshToken.findOne({ token });
            if (refreshToken) {
                const user = await User.findById(refreshToken.user_id);
                if (user) {
                    return user;
                }
            }
        }
        throw new BadTokenError();
    }

    async destroyToken(user_id: string) {
     await RefreshToken.findOneAndDelete({ user_id });
    }

    async getTokenByUser(user_id: string) {
        return await RefreshToken.findOne({ user_id });
    }
}

export class AccessTokenService extends Token {
    constructor() {
        super("10m");
    }

    async generateToken(user: any) {
        const token = this.generate(user, { encrypt: "user" });
        return token;
    }

    async verifyToken(token: string) {
        const data: any = await this.verify(token);
        if (data) {
            const user = await User.findById(data.user._id);
            if (user) {
                return user;
            }
        }
        throw new BadTokenError();
    }
}