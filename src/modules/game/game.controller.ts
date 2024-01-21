import { Request, Response } from 'express';
import GameRoomService from './game.service';
import { InternalServerError } from '../../middleware/error';

const gameRoomService = new GameRoomService();

export default class GameRoomController {
  async createGameRoom(req: Request, res: Response) {
    const { name, maxPlayers, rounds } = req.body;
    try {
      const newGameRoom = await gameRoomService.createGameRoom(name, maxPlayers, rounds);
      return res.status(201).json(newGameRoom);
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  async getGameRoomByLink(req: Request, res: Response) {
    const { link } = req.params;
    try {
      const gameRoom = await gameRoomService.getGameRoomByLink(link);
      return res.status(200).json(gameRoom);
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  async getAllGameRooms(req: Request, res: Response) {
    try {
      const allGameRooms = await gameRoomService.getAllGameRooms();
      return res.status(200).json(allGameRooms);
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  async getWaitingGameRooms(req: Request, res: Response) {
    try {
      const waitingGameRooms = await gameRoomService.getWaitingGameRooms();
      return res.status(200).json(waitingGameRooms);
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
