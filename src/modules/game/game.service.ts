import GameRoomRepository from './game.repository';
import { NotFoundError } from '../../middleware/error';
import shortid from 'short-uuid';

const gameRoomRepository = new GameRoomRepository()

export default class GameRoomService {


  /**
   * Create a game room with the given name, maximum number of players, and rounds.
   *
   * @param {string} name - the name of the game room
   * @param {string} maxPlayers - the maximum number of players allowed
   * @param {string} rounds - the number of rounds for the game
   * @return {Promise<any>} the created game room object or null if input validation fails
   */
  async createGameRoom(name: string, maxPlayers: string, rounds: string) {
    if (!name || !maxPlayers || !rounds) {
      return null;
    }
    const gameRoomId = shortid.generate();
    return await gameRoomRepository.createGameRoom(name, maxPlayers, rounds, gameRoomId);
  }

  /**
   * Retrieve all game rooms from the repository.
   *
   * @return {Promise<GameRoom[]>} The list of all game rooms.
   */
  async getAllGameRooms() {
    return await gameRoomRepository.getAllGameRooms();
  }

  /**
   * Get the waiting game rooms.
   *
   * @return {Promise<GameRoom[]>} The waiting game rooms.
   */
  async getWaitingGameRooms() {
    return await gameRoomRepository.getWaitingGameRooms();
  }

  /**
   * Asynchronously retrieves recent game rooms.
   *
   * @param {number} limit - The maximum number of game rooms to retrieve
   * @return {Promise<any>} The recent game rooms
   */
  async getRecentGameRooms(limit: number = 10) {
    return await gameRoomRepository.getRecentGameRooms(limit);
  }

  /**
   * Retrieves the game room by the given link.
   *
   * @param {string} link - the link to search for
   * @return {Promise<GameRoom>} the found game room
   */
  async getGameRoomByLink(link: string) {
    return await gameRoomRepository.findGameRoomByLink(link);
  }

  /**
   * Retrieves a game room by its ID.
   *
   * @param {string} gameRoomId - the ID of the game room
   * @return {Promise<type>} the game room with the specified ID
   */
  async getGameRoomById(gameRoomId: string) {
    return await gameRoomRepository.getGameRoomById(gameRoomId);
  }

  /**
   * Update the status of a game room.
   *
   * @param {string} gameRoomId - the ID of the game room
   * @param {string} newStatus - the new status to update to
   * @return {Promise<void>} a promise that resolves when the status is updated
   */
  async updateGameRoomStatus(gameRoomId: string, newStatus: string) {
    return await gameRoomRepository.updateGameRoomStatus(gameRoomId, newStatus);
  }

  async getPlayersInGameRoom(gameRoomId: string) {
    return await gameRoomRepository.getPlayersInGameRoom(gameRoomId);
  }

  /**
   * Add a player to a game room if the room exists and has available space.
   *
   * @param {string} gameRoomId - the ID of the game room
   * @param {any} playerId - the ID of the player
   * @return {any} the updated game room if the player was successfully added, or null
   */
  async addPlayerToGameRoom(gameRoomId: string, playerId: any) {
    const gameRoom = await gameRoomRepository.findGameRoomById(gameRoomId);

  if (!gameRoom) {
    return null
  }

if (gameRoom.status !== 'waiting') {
  return null
}
   if (gameRoom.players.length < gameRoom.maxPlayers) {
     const newGameRoom = await gameRoomRepository.addPlayerToGameRoom(gameRoomId, playerId);
     if (newGameRoom?.players.length === gameRoom.maxPlayers) {
      const newGameRoom = await gameRoomRepository.updateGameRoomStatus(gameRoomId, 'playing');
      return newGameRoom;
     }
     return newGameRoom;
  } else {
    return null
    }
  }

  /**
   * Remove a player from a game room.
   *
   * @param {string} gameRoomId - the ID of the game room
   * @param {string} playerId - the ID of the player to be removed
   * @return {Promise<any | null>} a promise indicating the success of the removal
   */
  async removePlayerFromGameRoom(gameRoomId: string, playerId: string): Promise<any | null> {
    return await gameRoomRepository.removePlayerFromGameRoom(gameRoomId, playerId);
  }
}
