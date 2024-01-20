import { User } from "./auth.models";

export default class AuthRepository {

    addUser (username: string, email: string, password: string) {
        const user = new User({ username, email, password });
        return user.save();
    }

    async getPassword(id: string) {
        return User.findById(id).select("password");
    }

    async updateVerificationToken(id: string, verificationToken: string) {
        return User.updateOne({ _id: id }, { verificationToken });  
    }

    async updatePassword(id: string, password: string) {
        return User.updateOne({ _id: id }, { password });
    }

    async setIsVerified(id: string, isVerified: boolean) {
        return User.updateOne({ _id: id }, { isVerified });
    }

    async revokeVerificationToken(id: string) {
        return User.updateOne({ _id: id }, { verificationToken: null });
    }

    async getIsVerified(id: string) {
        return User.findById(id).select("isVerified");
    }

    async findById(id: string) {
        return User.findById(id);
    }

    async findByEmail(email: string) {
        return User.findOne({ email });
    }

    async getRating(id: string) {
        return User.findById(id).select("rating");
    }

    async getIsInGame(id: string) {
        return User.findById(id).select("isInGame");
    }

    async setIsInGame(id: string, isInGame: boolean) {
        return User.updateOne({ _id: id }, { isInGame });
    }

    async setRating(id: string, rating: number) {
        return User.updateOne({ _id: id }, { rating });
    }

    async setUsername(id: string, username: string) {
        return User.updateOne({ _id: id }, { username });
    }

    async findByUsername(username: string) {
        return User.findOne({ username });
    }
}