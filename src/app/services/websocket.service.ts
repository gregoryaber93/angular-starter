import { Injectable } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { WebSocketMessage } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<WebSocketMessage>();
  private statusSubject = new Subject<string>();

  private wsUrl = 'wss://localhost:3002/';

  connect(url?: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.statusSubject.next('connecting');
    
    try {
      this.socket = new WebSocket(this.wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.statusSubject.next('connected');
      };

      this.socket.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        const message: WebSocketMessage = {
          type: 'message',
          data: event.data,
          timestamp: Date.now()
        };
        this.messageSubject.next(message);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.statusSubject.next('error');
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.statusSubject.next('disconnected');
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.statusSubject.next('error');
    }
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const data = typeof message === 'string' ? message : JSON.stringify(message);
      this.socket.send(data);
      console.log('Message sent:', message);
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(): Observable<WebSocketMessage> {
    return this.messageSubject.asObservable();
  }

  onStatusChange(): Observable<string> {
    return this.statusSubject.asObservable();
  }

  getStatus(): string {
    if (!this.socket) return 'disconnected';
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.statusSubject.next('disconnected');
    }
  }

  reconnect(url?: string): void {
    this.disconnect();
    setTimeout(() => this.connect(url), 1000);
  }

  startHeartbeat(intervalMs: number = 30000): Observable<number> {
    return new Observable(observer => {
      const heartbeat = interval(intervalMs).subscribe(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.sendMessage({ type: 'ping', timestamp: Date.now() });
          observer.next(Date.now());
        }
      });

      return () => heartbeat.unsubscribe();
    });
  }

}