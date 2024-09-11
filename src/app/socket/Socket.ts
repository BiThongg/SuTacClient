import { io, Socket } from 'socket.io-client';
// import { env } from 'process';


class SocketService {
  private socket: Socket | null = null;
  private readonly url: string = `http://127.0.0.1:5000`; // Your socket server URL

  constructor() {
    this.socket = io(this.url, {
      transports: ['websocket'], // Ensure websocket is used
    });
  }

  // Connect to the socket
  connect(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to the server. hhaah');
    });
  }

  // Listen to events
  listen(eventName: string, callback: (data: any) => void): void {
    if (!this.socket) return;

    this.socket.on(eventName, callback);
  }

  // Emit events
  emit(eventName: string, data: any): void {
    if (!this.socket) return;
    this.socket.emit(eventName, data);
  }

  // Disconnect from the socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Disconnected from the server.');
    }
  }
}

const socketService = new SocketService();
export default socketService;
