import express from 'express';
import GameRoomController from './game.controller';

const gameRoomRouter = express.Router();
const gameRoomController = new GameRoomController();

gameRoomRouter.post('/', gameRoomController.createGameRoom);
gameRoomRouter.get('/', gameRoomController.getAllGameRooms);
gameRoomRouter.get('/:link', gameRoomController.getGameRoomByLink);
gameRoomRouter.get('/waiting', gameRoomController.getWaitingGameRooms);

export default gameRoomRouter;
