import GameRoom from './game.models';

export default class GameRoomRepository {
  async createGameRoom(name: string, maxPlayers: string, rounds: string, id: string) {
    const gameRoom = new GameRoom({
      name,
      link: id,
      maxPlayers,
      currentPlayers: 0,
      players: [],
      status: 'waiting',
      rounds,
    });

    return await gameRoom.save();
  }

  async findGameRoomByLink(link: string) {
    return await GameRoom.findOne({ link });
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

  async getPlayersInGameRoom(gameRoomId: string) {
    return await GameRoom.findById(gameRoomId).populate('players');
  }


  async addPlayerToGameRoom(gameRoomId: string, playerId: any) {
    const gameRoom = await GameRoom.findOne({_id: gameRoomId});
    if (!gameRoom) {
        return null
    }
    const max = gameRoom.maxPlayers
    if (gameRoom.players.length === max) {
        return null
    }
    if (gameRoom.players.length > max) {
        gameRoom.players.push(playerId);
        await gameRoom.save();
        return gameRoom
    }
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