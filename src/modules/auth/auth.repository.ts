import logger from "../../utils/logging/logger";
import { User } from "./auth.models";
import mongoose from "mongoose";

export default class AuthRepository {

    addUser (username: string, email: string, password: string) {
        const user = new User({ username, email, password });
        return user.save();
    }

    async getPassword(id: string) {
        return User.findById(id).select("password");
    }

    async updateVerificationToken(id: string, verificationToken: string | null) {
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

     updateVerificationAndIsVerified = async (userId: string) => {
        // Working with transactions in Mongoose for fun
        const session = await mongoose.startSession();
        session.startTransaction();    
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $set: { verificationToken: null, isVerified: true } },
                { session, new: true } // Use { new: true } to return the updated document
            ).exec();
    
            await session.commitTransaction();
            session.endSession();

            return updatedUser;

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
    
            logger.error('Transaction aborted:', error);
            throw error; // Rethrow the error to be handled by the caller
        }
    };
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