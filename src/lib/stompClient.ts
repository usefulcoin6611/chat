import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const STOMP_ENDPOINT = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';

export interface ChatMessage {
    id?: string;
    chatId?: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp?: string;
}

class StompService {
  private client: Client | null = null;
  public isConnected = false;

  public connect(
    userId: string,
    onMessageReceived: (msg: ChatMessage) => void,
    onConnected?: () => void,
    onError?: (err: any) => void
  ) {
    if (this.client && this.client.active) {
      return; // Already connecting or connected
    }

    // Detect if we should use WSS (WebSocket over SSL)
    const isHttps = STOMP_ENDPOINT.startsWith('https');
    const wsUrl = STOMP_ENDPOINT.replace('http', 'ws');

    this.client = new Client({
      // Prefer direct WebSocket if using HTTPS for better tunnel compatibility
      brokerURL: wsUrl,
      connectHeaders: {
          'ngrok-skip-browser-warning': 'true',
      },
      // If direct websocket fails, try SockJS factory
      webSocketFactory: () => {
          return new (SockJS as any)(STOMP_ENDPOINT, null, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            }
          });
      },
      reconnectDelay: 5000, 
      onConnect: () => {
        this.isConnected = true;
        console.log('Connected to WebSocket as user id', userId);
        
        // Subscribe to user specific queue
        if (this.client) {
            this.client.subscribe(`/user/${userId}/queue/messages`, (message) => {
                if (message.body) {
                    onMessageReceived(JSON.parse(message.body) as ChatMessage);
                }
            });
        }

        if (onConnected) {
          onConnected();
        }
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        if (onError) onError(frame);
      },
      onWebSocketClose: () => {
        this.isConnected = false;
        console.log("WebSocket Disconnected");
      }
    });

    this.client.activate();
  }

  public disconnect() {
    if (this.client && this.client.active) {
      this.client.deactivate();
    }
    this.isConnected = false;
  }

  public sendMessage(chatMessage: ChatMessage) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/chat.private',
        body: JSON.stringify(chatMessage),
      });
    } else {
      console.error("Cannot send message, STOMP client not connected.");
    }
  }
}

export const stompService = new StompService();
