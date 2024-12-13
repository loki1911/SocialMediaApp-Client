import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveService {
  private hubConnection: signalR.HubConnection;
  private readonly likeUrl = 'https://localhost:7106/likeHub';

  private likesSource = new BehaviorSubject<Like | null>(null);
  likes$ = this.likesSource.asObservable();
  

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.likeUrl)
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      console.log('SignalR connection established');
      this.registerOnLikeReceived();
    } catch (error) {
      console.error('Error starting SignalR connection: ', error);
    }
  }

  private registerOnLikeReceived() {
    this.hubConnection.on('ReceiveLike', (like: Like) => {
      console.log('Like received:', like);
      this.likesSource.next(like);
    });
  }

  sendLikeNotification(like: Like) {
    this.hubConnection.invoke('SendLike', like).catch(err => console.error('Error sending like notification: ', err));
  }
}

export interface Like {
  userId: number;
  postId: number;
  username: string;
}

