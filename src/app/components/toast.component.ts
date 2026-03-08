import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: ToastMessage | null = null;
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  close(): void {
    this.toastService.hide();
  }
}





