import GameRoomService from '../modules/game/game.service';

const gameRoomService = new GameRoomService();


export const ioEvents = async (io: any) => {
    io.of("/gameroom").on("connection", (socket: any) => {
        
    });
}