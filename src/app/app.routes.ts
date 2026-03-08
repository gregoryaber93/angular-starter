import { Routes } from '@angular/router';
import { App } from './app';
import { RestComponent } from './components/rest.component';
import { WebrtcComponent } from './components/webrtc.component';
// import { GraphqlComponent } from './components/graphql.component';
import { WebsocketComponent } from './components/websocket.component';
import { LoginComponent } from './components/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: RestComponent },
  { path: 'rest', component: RestComponent },
  { path: 'webrtc', component: WebrtcComponent },
  // { path: 'graphql', component: GraphqlComponent },
  { path: 'websocket', component: WebsocketComponent },
  { path: '**', redirectTo: '' },
];
