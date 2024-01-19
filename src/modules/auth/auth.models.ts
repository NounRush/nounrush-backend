import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    isInGame: {
        type: Boolean,
        default: false
    }
}, {
    collection: "users",
    timestamps: false
});

// Refreshtoken Model
const RefreshTokenSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    }
},
{
    collection: "refreshtokens",
    timestamps: true,
})


export const User = mongoose.model("User", UserSchema);
export const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

