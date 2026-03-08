import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebrtcService {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream = new Subject<MediaStream>();
  private messages = new Subject<string>();
  private connectionState = new BehaviorSubject<string>('disconnected');

  private iceServers: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  initializePeerConnection(): RTCPeerConnection {
    if (this.peerConnection) {
      this.closePeerConnection();
    }

    this.peerConnection = new RTCPeerConnection(this.iceServers);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE Candidate:', event.candidate);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState || 'disconnected';
      console.log('Connection state:', state);
      this.connectionState.next(state);
    };

    this.peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event.streams[0]);
      this.remoteStream.next(event.streams[0]);
    };

    return this.peerConnection;
  }

  createDataChannel(label: string = 'chat'): RTCDataChannel {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    this.dataChannel = this.peerConnection.createDataChannel(label);
    this.setupDataChannel(this.dataChannel);
    return this.dataChannel;
  }

  private setupDataChannel(channel: RTCDataChannel) {
    channel.onopen = () => {
      console.log('Data channel opened');
    };

    channel.onclose = () => {
      console.log('Data channel closed');
    };

    channel.onmessage = (event) => {
      console.log('Data channel message:', event.data);
      this.messages.next(event.data);
    };
  }

  sendMessage(message: string): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(message);
      console.log('Message sent:', message);
    } else {
      console.error('Data channel is not open');
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    console.log('Offer created:', offer);
    return offer;
  }

  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    console.log('Answer created:', answer);
    return answer;
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('Remote answer set');
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    console.log('ICE candidate added');
  }

  async getUserMedia(
    constraints: MediaStreamConstraints = { video: true, audio: true }
  ): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Local stream obtained:', this.localStream);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  addLocalStream(stream: MediaStream): void {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    stream.getTracks().forEach((track) => {
      this.peerConnection?.addTrack(track, stream);
    });
    console.log('Local stream added to peer connection');
  }

  async getDisplayMedia(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      console.log('Display stream obtained:', stream);
      return stream;
    } catch (error) {
      console.error('Error accessing display media:', error);
      throw error;
    }
  }

  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
      console.log('Local stream stopped');
    }
  }

  closePeerConnection(): void {
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
      this.connectionState.next('disconnected');
    }

    this.stopLocalStream();
  }

  onMessage(): Observable<string> {
    return this.messages.asObservable();
  }

  onRemoteStream(): Observable<MediaStream> {
    return this.remoteStream.asObservable();
  }

  onConnectionStateChange(): Observable<string> {
    return this.connectionState.asObservable();
  }

  async getStats(): Promise<RTCStatsReport | null> {
    if (this.peerConnection) {
      return await this.peerConnection.getStats();
    }
    return null;
  }
}
