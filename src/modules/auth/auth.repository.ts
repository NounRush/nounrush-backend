import { User } from "./auth.models";

export default class AuthRepository {

    addUser (username: string, email: string, password: string) {
        const user = new User({ username, email, password });
        return user.save();
    }

    async getPassword(id: string) {
        return User.findById(id).select("password");
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