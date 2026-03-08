import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebrtcService } from '../services/webrtc.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'webrtc-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './webrtc.component.html',
  styleUrls: ['./webrtc.component.css'],
})
export class WebrtcComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo', { static: false }) localVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', { static: false }) remoteVideoRef!: ElementRef<HTMLVideoElement>;

  localStream: MediaStream | null = null;
  remoteStream: MediaStream | null = null;
  connectionState: string = 'disconnected';
  isLocalStreamActive: boolean = false;
  isRemoteStreamActive: boolean = false;
  errorMessage: string = '';

  private subscriptions: Subscription[] = [];

  constructor(private webrtcService: WebrtcService) {}

  ngOnInit(): void {
    const stateSub = this.webrtcService.onConnectionStateChange().subscribe((state) => {
      this.connectionState = state;
      console.log('Connection state changed:', state);
    });

    const remoteStreamSub = this.webrtcService.onRemoteStream().subscribe((stream) => {
      this.remoteStream = stream;
      this.setRemoteVideoStream(stream);
    });

    this.subscriptions.push(stateSub, remoteStreamSub);

    this.checkBrowserSupport();
  }

  private checkBrowserSupport(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.errorMessage =
        'Your browser does not support getUserMedia. Please use a modern browser like Chrome, Firefox, or Edge.';
    } else {
      const isSecure =
        location.protocol === 'https:' ||
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1';
      if (!isSecure) {
        this.errorMessage =
          'Camera access requires HTTPS or localhost. Please use https:// or run on localhost.';
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.stopLocalStream();
    this.webrtcService.closePeerConnection();
  }

  async startLocalStream(): Promise<void> {
    this.errorMessage = '';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.errorMessage = 'getUserMedia is not supported in this browser.';
      alert(this.errorMessage);
      return;
    }

    const isSecure =
      location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1';
    if (!isSecure) {
      this.errorMessage =
        'Camera access requires HTTPS or localhost. Please use https:// or run on localhost.';
      alert(this.errorMessage);
      return;
    }

    try {
      this.localStream = await this.webrtcService.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: true,
      });
      this.setLocalVideoStream(this.localStream);
      this.isLocalStreamActive = true;
      this.errorMessage = '';
      console.log('Local stream started');
    } catch (error: any) {
      console.error('Error starting local stream:', error);

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        this.errorMessage =
          'Permission denied. Please allow camera/microphone access in your browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        this.errorMessage = 'No camera/microphone found. Please connect a device.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        this.errorMessage = 'Camera/microphone is already in use by another application.';
        try {
          this.localStream = await this.webrtcService.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
          this.setLocalVideoStream(this.localStream);
          this.isLocalStreamActive = true;
          this.errorMessage = 'Video only (audio not available)';
          console.log('Local stream started (video only)');
          return;
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } else {
        this.errorMessage = `Error: ${error.message || 'Unknown error occurred'}`;
      }

      alert(this.errorMessage);
    }
  }

  stopLocalStream(): void {
    if (this.localStream) {
      this.webrtcService.stopLocalStream();
      if (this.localVideoRef?.nativeElement) {
        this.localVideoRef.nativeElement.srcObject = null;
      }
      this.localStream = null;
      this.isLocalStreamActive = false;
      console.log('Local stream stopped');
    }
  }

  async startRemoteStream(): Promise<void> {
    this.errorMessage = '';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.errorMessage = 'getUserMedia is not supported in this browser.';
      alert(this.errorMessage);
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');

      let constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      };

      if (videoDevices.length > 1 && this.localStream) {
        const localVideoTrack = this.localStream.getVideoTracks()[0];
        if (localVideoTrack) {
          const localDeviceId = localVideoTrack.getSettings().deviceId;
          const otherDevice = videoDevices.find((device) => device.deviceId !== localDeviceId);
          if (otherDevice) {
            constraints.video = {
              deviceId: { exact: otherDevice.deviceId },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            };
          }
        }
      }

      const testRemoteStream = await navigator.mediaDevices.getUserMedia(constraints);

      this.remoteStream = testRemoteStream;
      this.setRemoteVideoStream(testRemoteStream);
      this.isRemoteStreamActive = true;
      this.errorMessage = '';
      console.log('Remote stream started (test mode)');
    } catch (error: any) {
      console.error('Error starting remote stream:', error);

      let errorMsg = 'Error accessing camera for remote stream. ';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMsg += 'Please allow camera access.';
      } else if (error.name === 'NotFoundError') {
        errorMsg += 'No camera found.';
      } else if (error.name === 'NotReadableError') {
        errorMsg += 'Camera is already in use.';
      } else {
        errorMsg += error.message || 'Unknown error.';
      }

      this.errorMessage = errorMsg;
      alert(errorMsg);
    }
  }

  stopRemoteStream(): void {
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      if (this.remoteVideoRef?.nativeElement) {
        this.remoteVideoRef.nativeElement.srcObject = null;
      }
      this.remoteStream = null;
      this.isRemoteStreamActive = false;
      console.log('Remote stream stopped');
    }
  }

  initializeConnection(): void {
    this.webrtcService.initializePeerConnection();
    console.log('Peer connection initialized');
  }

  async createOffer(): Promise<void> {
    try {
      if (!this.localStream) {
        await this.startLocalStream();
      }

      this.initializeConnection();
      this.webrtcService.addLocalStream(this.localStream!);
      const offer = await this.webrtcService.createOffer();
      console.log('Offer created:', offer);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  private setLocalVideoStream(stream: MediaStream): void {
    if (this.localVideoRef?.nativeElement) {
      this.localVideoRef.nativeElement.srcObject = stream;
      this.localVideoRef.nativeElement.play().catch((err) => {
        console.error('Error playing local video:', err);
      });
    }
  }

  private setRemoteVideoStream(stream: MediaStream): void {
    if (this.remoteVideoRef?.nativeElement) {
      this.remoteVideoRef.nativeElement.srcObject = stream;
      this.remoteVideoRef.nativeElement.play().catch((err) => {
        console.error('Error playing remote video:', err);
      });
    }
  }

  toggleVideo(): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }

  toggleAudio(): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }
}
