import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private hubConnection: signalR.HubConnection;
  private readonly messageHubUrl = 'https://localhost:7106/messageHub';
  
  private newMessageSource = new BehaviorSubject<Message | null>(null);
  newMessage$ = this.newMessageSource.asObservable();

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.messageHubUrl)
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      console.log('Connected to message hub');
      this.registerOnMessageReceived();
    } catch (error) {
      console.error('Error connecting to message hub:', error);
    }
  }

  private registerOnMessageReceived() {
    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      console.log('Message received:', message);
      this.newMessageSource.next(message);
    });
  }
  


  sendMessageNotification(message: Message) {
    this.hubConnection.invoke('SendMessage', message)
      .catch(err => console.error('Error sending message notification:', err));
  }

  sendMessage(SenderId: string, ReceiverId: string, MessageContent: string): Observable<void> {
    const payload = { SenderId, ReceiverId,  MessageContent };
    return this.http.post<void>('https://localhost:7106/api/Messages', payload);
  }

  getUsernames(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7106/api/User');
  }
  getMessages(SenderId: string, ReceiverId: string): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7106/api/Messages/${SenderId}/${ReceiverId}`);
  }
}

export interface Message {
  senderId: string;
  receiverId: string;
  messageContent: string;
}





// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import * as signalR from '@microsoft/signalr';
// import { Observable, Subject } from 'rxjs';
// @Injectable({
//   providedIn: 'root'
// })
// export class MessageService {
//   private hubConnection: signalR.HubConnection;
//   private apiUrl = 'https://localhost:7106/api/messageHub'; 
//   private newMessageSubject = new Subject<any>();

//   constructor(private http: HttpClient) {
//     this.hubConnection = new signalR.HubConnectionBuilder()
//       .withUrl(this.apiUrl)
//       .configureLogging(signalR.LogLevel.Information)
//       .build();

//   }

//   private startConnection() {
//     this.hubConnection
//       .start()
//       .then(() => {
//         console.log('Connected to message hub');
//         this.hubConnection.on('ReceiveMessage', (message) => {
//           this.newMessageSubject.next(message);
//         });
//       })
//       .catch(err => console.error('Error connecting to message hub:', err));
//   }

//   getNewMessageObservable(): Observable<any> {
//     return this.newMessageSubject.asObservable();
//   }

//   sendMessage(senderId: string, receiverId: string, messageContent: string): Observable<void> {
//     const payload = { senderId, receiverId, message: messageContent };
//     return this.http.post<void>(`${this.apiUrl}/Messages`, payload);
//   }
//   getUsernames(): Observable<any[]> {
//     return this.http.get<any[]>('https://localhost:7106/api/User');
//   }

//   getMessages(senderId: string, receiverId: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/Messages/${senderId}/${receiverId}`);
//   }
// }
