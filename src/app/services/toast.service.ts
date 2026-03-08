import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  message: string;
  data?: any;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  public toast$: Observable<ToastMessage | null> = this.toastSubject.asObservable();

  show(message: string, data?: any, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000): void {
    this.toastSubject.next({ message, data, type, duration });
    
    if (duration > 0) {
      setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  hide(): void {
    this.toastSubject.next(null);
  }
}





