import GameRoom from './game.models';

export default class GameRoomRepository {
  async createGameRoom(name: string, maxPlayers: string, rounds: string) {
    const gameRoom = new GameRoom({
      name,
      maxPlayers,
      currentPlayers: 0,
      players: [],
      status: 'waiting',
      rounds,
    });

    return await gameRoom.save();
  }

  async findGameRoomById(gameRoomId: string) {
    return await GameRoom.findById(gameRoomId);
  }

  async getAllGameRooms() {
    return await GameRoom.find();
  }

  async getWaitingGameRooms() {
    return await GameRoom.find({ status: 'waiting' });
  }

  async getRecentGameRooms(limit = 10) {
    return await GameRoom.find().sort({ createdAt: -1 }).limit(limit);
  }

  async getGameRoomById(gameRoomId: string) {
    return await GameRoom.findById(gameRoomId);
  }

  async updateGameRoomStatus(gameRoomId: string, newStatus: string) {
    return await GameRoom.findByIdAndUpdate(gameRoomId, { status: newStatus }, { new: true });
  }


async addPlayerToGameRoom(gameRoomId: string, playerId: any) {
    return await GameRoom.findByIdAndUpdate(
        gameRoomId,
        {
          $push: { players: playerId },
          $inc: { currentPlayers: 1 },
        },
        { new: true }
      );
}

  async removePlayerFromGameRoom(gameRoomId: string, playerId: string) {
    return await GameRoom.findByIdAndUpdate(
      gameRoomId,
      {
        $pull: { players: playerId },
        $inc: { currentPlayers: -1 },
      },
      { new: true }
    );
  }
}