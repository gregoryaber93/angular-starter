import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';
import { WebSocketMessage } from '../models/api-models';

@Component({
  selector: 'websocket-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.css'],
})
export class WebsocketComponent implements OnInit, OnDestroy {
  messageText: string = '';
  messages: WebSocketMessage[] = [];
  connectionStatus: string = 'disconnected';
  error: string = '';

  private messageSubscription?: Subscription;
  private statusSubscription?: Subscription;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    this.subscribeToMessages();
    this.subscribeToStatus();
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();
    this.websocketService.disconnect();
  }

  subscribeToMessages() {
    this.messageSubscription = this.websocketService.onMessage().subscribe({
      next: (message: WebSocketMessage) => {
        this.messages.push(message);
        console.log('Received message:', message);
      },
      error: (err: any) => {
        this.error = 'Error receiving message: ' + err.message;
      },
    });
  }

  subscribeToStatus() {
    this.statusSubscription = this.websocketService.onStatusChange().subscribe({
      next: (status: string) => {
        this.connectionStatus = status;
        console.log('Connection status:', status);
      },
      error: (err: any) => {
        this.error = 'Status error: ' + err.message;
      },
    });
  }

  connect() {
    this.error = '';
    try {
      this.websocketService.connect();
    } catch (err: any) {
      this.error = 'Failed to connect: ' + err.message;
    }
  }

  disconnect() {
    this.websocketService.disconnect();
  }

  reconnect() {
    this.error = '';
    this.websocketService.reconnect();
  }

  sendMessage(text?: string) {
    const message = text || this.messageText;
    if (!message) return;

    try {
      this.websocketService.sendMessage(message);
      if (!text) {
        this.messageText = '';
      }
    } catch (err: any) {
      this.error = 'Failed to send message: ' + err.message;
    }
  }

  sendJsonMessage() {
    const jsonMessage = {
      type: 'greeting',
      data: {
        message: 'Hello from Angular!',
        timestamp: new Date().toISOString(),
      },
    };
    this.websocketService.sendMessage(jsonMessage);
  }

  clearMessages() {
    this.messages = [];
  }

  formatMessage(data: any): string {
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }
}
