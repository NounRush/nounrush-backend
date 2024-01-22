import GameRoomService from '../modules/game/game.service';

const gameRoomService = new GameRoomService();


export const ioEvents = async (io: any) => {
    io.of("/gameroom").on("connection", (socket: any) => {
        socket.on("joinRoom", async (data: any) => {
            const result = await gameRoomService.addPlayerToGameRoom(data.gameRoomId, data.playerId);
            socket.emit("joinRoomSuccessful", result);
        });
    });
}