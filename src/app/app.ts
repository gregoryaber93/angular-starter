
import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-starter');
}
