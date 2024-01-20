import mongoose from "mongoose";

const GameRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    maxPlayers: {
        type: Number,
        required: true
    },
    currentPlayers: {
        type: Number,
        required: true
    },
    players: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    status:{
        enum: ["waiting", "playing", "finished"],
        type: String,
        default: "waiting",
        required: true
    },
    rounds: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: "gamerooms"
});

const GameRoom = mongoose.model("GameRoom", GameRoomSchema)

export default GameRoom;