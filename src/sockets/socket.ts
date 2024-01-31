import http from 'http';
import { Server } from 'socket.io';
import app from '../server'; // Import your Express app
import { ioEvents } from './game';
import { AccessTokenService } from '../modules/auth/tokens.service';

const server = http.createServer(app);
const io = new Server(server);
const ATS = new AccessTokenService();

const verifyToken = async (token: string) => {
  try {
    const user = await ATS.verifyToken(token);
    return user;
  } catch (error) {
    throw new Error('Authentication error');
  }
};

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const user = await verifyToken(token);

    if (!user) {
      return next(new Error('Authentication error'));
    }

    (socket as any).user = user;
    next();
  } catch (error) {
    return next(new Error('Authentication error'));
  }
});

ioEvents(io);

export default server;
