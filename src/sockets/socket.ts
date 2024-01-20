import http from 'http';
import { Server } from 'socket.io';
import app from '../server'; // Import your Express app
import { ioEvents } from './game';
import { AccessTokenService } from '../modules/auth/tokens.service';

const server = http.createServer(app);
const io = new Server(server);
const ATS = new AccessTokenService();

const verifyToken = async (token: string) => {
  const user = await ATS.verifyToken(token); 
  return user;
};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  const user = verifyToken(token);
  if (!user) {
    return next(new Error('Authentication error'));
  }

  (socket as any).user = user;
  next();
});

ioEvents(io);

export default server;
