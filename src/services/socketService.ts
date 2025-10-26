import io, { Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(serverUrl: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    try {
      this.socket = io(serverUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.setupConnectionListeners();
    } catch (error) {
      console.error('Socket connection failed:', error);
      throw error;
    }
  }


  private setupConnectionListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinDesign(designId: string, clientId: string): void {
    if (!this.socket) return;
    console.log('📤 Emitting design:join', { designId, clientId });
    this.socket.emit('design:join', { designId, clientId });
  }

  leaveDesign(designId: string): void {
    if (!this.socket) return;
    console.log('📤 Emitting design:leave', { designId });
    this.socket.emit('design:leave', { designId });
  }

  emitUpdate(designId: string, clientId: string, timestamp: number, changes: any): void {
    if (!this.socket) return;
    console.log('📤 Emitting design:update', { designId, clientId });
    this.socket.emit('design:update', { designId, clientId, timestamp, changes });
  }

  emitElementAdd(designId: string, clientId: string, timestamp: number, element: any): void {
    if (!this.socket) return;
    console.log('📤 Emitting design:element-add', { designId, elementId: element.id });
    this.socket.emit('design:element-add', { designId, clientId, timestamp, element });
  }

  emitElementUpdate(designId: string, clientId: string, timestamp: number, elementId: string, updates: any): void {
    if (!this.socket) return;
    console.log('📤 Emitting design:element-update', { designId, elementId });
    this.socket.emit('design:element-update', { designId, clientId, timestamp, elementId, updates });
  }

  emitElementDelete(designId: string, clientId: string, timestamp: number, elementId: string): void {
    if (!this.socket) return;
    console.log('📤 Emitting design:element-delete', { designId, elementId });
    this.socket.emit('design:element-delete', { designId, clientId, timestamp, elementId });
  }

  emitBackgroundChange(designId: string, clientId: string, timestamp: number, canvasBackground: string): void {
    if (!this.socket) return;
    console.log('📤 Emitting design:background-change', { designId });
    this.socket.emit('design:background-change', { designId, clientId, timestamp, canvasBackground });
  }

  emitResize(designId: string, clientId: string, timestamp: number, width: number, height: number): void {
    if (!this.socket) return;
    console.log('📤 Emitting design:resize', { designId, width, height });
    this.socket.emit('design:resize', { designId, clientId, timestamp, width, height });
  }

  emitNameChange(designId: string, clientId: string, timestamp: number, name: string): void {
    if (!this.socket) return;
    console.log('📤 Emitting design:name-change', { designId, name });
    this.socket.emit('design:name-change', { designId, clientId, timestamp, name });
  }

  onUserJoined(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('design:user-joined', (data) => {
      console.log('📥 Received design:user-joined', data);
      callback(data);
    });
  }

  onUserLeft(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('design:user-left', (data) => {
      console.log('📥 Received design:user-left', data);
      callback(data);
    });
  }

  onDesignUpdate(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('design:update-received', (data) => {
      console.log('📥 Received design:update-received', data);
      callback(data);
    });
  }

  onElementAdded(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('design:element-added', (data) => {
      console.log('📥 Received design:element-added', data);
      callback(data);
    });
  }

  onElementUpdated(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('design:element-updated', (data) => {
      console.log('📥 Received design:element-updated', data);
      callback(data);
    });
  }

  onElementDeleted(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('design:element-deleted', (data) => {
      console.log('📥 Received design:element-deleted', data);
      callback(data);
    });
  }

  onBackgroundChanged(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('design:background-changed', (data) => {
      console.log('📥 Received design:background-changed', data);
      callback(data);
    });
  }

  onCanvasResized(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('design:resized', (data) => {
      console.log('📥 Received design:resized', data);
      callback(data);
    });
  }

  onDesignNameChanged(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('design:name-changed', (data) => {
      console.log('📥 Received design:name-changed', data);
      callback(data);
    });
  }

  removeAllListeners(event: string): void {
    if (!this.socket) return;
    this.socket.removeAllListeners(event);
  }

  off(event: string): void {
    if (!this.socket) return;
    this.socket.off(event);
  }
}

export const socketService = new SocketService();

