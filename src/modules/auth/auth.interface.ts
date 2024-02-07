import { Request } from "express";

export default interface AuthRequest extends Request {
    user: any; // Replace 'any' with the type of 'user' if available
}