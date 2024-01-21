import GameRoomRepository from './game.repository';
import { NotFoundError } from '../../middleware/error';
import shortid from 'short-uuid';

const gameRoomRepository = new GameRoomRepository()

export default class GameRoomService {


  async createGameRoom(name: string, maxPlayers: string, rounds: string) {
    if (!name || !maxPlayers || !rounds) {
      // throw new NotFoundError('All fields are required');
    }
    const gameRoomId = shortid.generate();
    return await gameRoomRepository.createGameRoom(name, maxPlayers, rounds, gameRoomId);
  }

  async getAllGameRooms() {
    return await gameRoomRepository.getAllGameRooms();
  }

  async getWaitingGameRooms() {
    return await gameRoomRepository.getWaitingGameRooms();
  }

  async getRecentGameRooms(limit: number = 10) {
    return await gameRoomRepository.getRecentGameRooms(limit);
  }

  async getGameRoomByLink(link: string) {
    return await gameRoomRepository.findGameRoomByLink(link);
  }

  async getGameRoomById(gameRoomId: string) {
    return await gameRoomRepository.getGameRoomById(gameRoomId);
  }

  async updateGameRoomStatus(gameRoomId: string, newStatus: string) {
    return await gameRoomRepository.updateGameRoomStatus(gameRoomId, newStatus);
  }

  async addPlayerToGameRoom(gameRoomId: string, playerId: any) {
    const gameRoom = await gameRoomRepository.findGameRoomById(gameRoomId);

  if (!gameRoom) {
    // throw new NotFoundError('Game room not found');
  }
   if (gameRoom.players.length < gameRoom.maxPlayers) {
     const newGameRoom = await gameRoomRepository.addPlayerToGameRoom(gameRoomId, playerId);
     if (newGameRoom?.players.length === gameRoom.maxPlayers) {
      const newGameRoom = await gameRoomRepository.updateGameRoomStatus(gameRoomId, 'playing');
      return newGameRoom;
     }
  } else {
    // throw new Error('Game room is full!');
    }
  }

  async removePlayerFromGameRoom(gameRoomId: string, playerId: string) {
    return await gameRoomRepository.removePlayerFromGameRoom(gameRoomId, playerId);
  }
}
