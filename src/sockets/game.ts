import { Socket } from 'socket.io';
import GameRoomService from '../modules/game/game.service';

const gameRoomService = new GameRoomService();

export const ioEvents = async (io: any) => {
    io.on("connection", (socket: any) => {

        socket.on("joinRoom", async (data: any) => {
            const { roomId, playerId } = data;
            socket.join(roomId);
            const result = await gameRoomService.addPlayerToGameRoom(roomId, playerId);
            io.to(roomId).emit("joinRoomSuccessful", result);
        });

        socket.on("leaveRoom", async (data: any) => {
            const { roomId, playerId } = data;
            socket.leave(roomId);
            const result = await gameRoomService.removePlayerFromGameRoom(roomId, playerId);
            io.to(roomId).emit("leaveRoomSuccessful", result);
        });

        socket.on("fetchPlayers", async (data: any) => {
            const { roomId } = data;
            const result = await gameRoomService.getPlayersInGameRoom(roomId);
            io.to(roomId).emit("fetchPlayersSuccessful", result);
        });
    });
}

