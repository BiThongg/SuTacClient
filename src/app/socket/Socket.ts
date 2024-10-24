import { io, Socket } from 'socket.io-client';



interface User {
  id: string;
  sid: string;
  name: string;
}

class SocketService {
  private socket: Socket | null = null;
  private readonly url: string = "localhost:5000"; // Your socket server URL

  constructor() {
    this.socket = io(this.url, {
      transports: ['websocket'], // Ensure websocket is used
    });
  }

  // Connect to the socket
  connect(): void {
    if (!this.socket) return;

    const user: User = JSON.parse(localStorage.getItem('user') || '{}');

    this.socket = io(this.url, {
      query: { user_id: user.id },
    })

    this.socket.on('error', (error: any) => {
      localStorage.removeItem('user')
    })
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

  status(): boolean {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();
export default socketService;
