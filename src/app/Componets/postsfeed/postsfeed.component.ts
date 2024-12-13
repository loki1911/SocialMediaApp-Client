
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; 
import { UserService } from 'src/app/user.service';
import { LiveService } from 'src/app/live.service';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-postsfeed',
  templateUrl: './postsfeed.component.html',
  styleUrls: ['./postsfeed.component.css']
})
export class PostsfeedComponent implements OnInit {
  isProfileOpen: boolean = false;
  selectedFile: File | null = null;
  posts: any[] = [];
  notificationCount: number = 0;
  currentUserId: number = 1; 
  notifications: any[] = [];
  newPostContent: string = ''; 
  notificationMessages: { message: string }[] = []; 
  Messages: any[] = [];
  usernames: string[] = []; 
  isPopupVisible: boolean = false;

  isChatBoxOpen = false;
  isNotificationsOpen = false;
  selectedUser: any = null;
  username: string | null = null; 
  userId: string | null = null;
  postsId: number = 5;

  constructor(
    private router: Router, 
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private liveService: LiveService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.setupSignalR(); 
    this.username = sessionStorage.getItem('username'); 
    this.userId = sessionStorage.getItem('userId');
  }

  loadPosts() {
    this.userService.getPosts().subscribe((data: any[]) => {
      this.posts = data.map(post => ({
        ...post,
        image: this.createImageFromBase64(post.image)
      }));
      console.log(this.posts);
    });
  }

  createImageFromBase64(base64String: string): SafeUrl | null {
    if (base64String) {
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${base64String}`);
    }
    return null;
  }
  closePopup() {
    this.isPopupVisible = false;
  }

  toggleLike(post: any) {
    if (typeof post.likes !== 'number') {
      post.likes = 0; 
    }
  
    if (post.liked) {
      post.likes--; 
      this.notificationCount--; 
    } else {
      post.likes++;  
      this.likePost(post.id);
    }
    post.liked = !post.liked; 
  }
  
  setupSignalR() {
    this.liveService.startConnection().then(() => {
      this.liveService.likes$.subscribe((like: Like | null) => {
        if (like) {
          if (like.username !== this.username) {
            this.notificationMessages.push({ message: `${this.username} liked a post!` }); 
            console.log(`User ${this.username} liked post ${like.postId}`);
            this.notificationCount++; 
          }
        }
      });

    }).catch(err => console.error('Error setting up SignalR: ', err));

   
    this.messageService.startConnection().then(() => {
      this.messageService.newMessage$.subscribe((message) => {
          if (message) {
            console.log('New message received:', message);
            if (message.receiverId === this.username) {
              this.notificationMessages.push({ message: `${message.senderId} sent you a message: ${message.messageContent}` });
              this.notificationCount++;
              this.Messages.push({ sender: message.senderId, content: message.messageContent });
            }
          }
        });
      });


  }

  likePost(postId: number) {
    const like = {postId: this.postsId, userId: this.currentUserId, username: this.username! }; 
    this.http.post('https://localhost:7106/api/Like/add', like).subscribe(() => {
      console.log('Like added');
      this.liveService.sendLikeNotification(like);
    });
  }

  toggleChatBox() {
    this.isChatBoxOpen = !this.isChatBoxOpen;
    this.isNotificationsOpen = false;
    if (this.isChatBoxOpen) {
      this.messageService.getUsernames().subscribe(
        (data: any[]) => {
          this.usernames = data.map(user => user.username);
          console.log('Usernames:', this.usernames);
        },
        (error) => {
          console.error('Error fetching usernames:', error);
        }
      );
    }
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isChatBoxOpen = false;
  }

  openChat(user: string) {
    this.selectedUser = user;
    this.messageService.getMessages(this.username!, user).subscribe(
      (messages) => {
        this.Messages = messages
        console.log(this.Messages);
        
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  closeChat() {
    this.selectedUser = null;
  }

  sendMessage() {
    const messageContent = (document.querySelector('input[type="text"]') as HTMLInputElement).value.trim();
    if (messageContent && this.selectedUser) {
      const message = {
        sender: this.username,
        receiver: this.selectedUser,
        messageContent: messageContent
      };

      this.messageService.sendMessage( this.selectedUser,this.username!, messageContent).subscribe(() => {
        this.isPopupVisible = true;

        console.log('Message sent to backend:', messageContent);
        this.displayMessage({ sender: this.username!, content: messageContent }); 
      });
    }
  }

  displayMessage(message: { sender: string; content: string }) {
    // this.Messages.push(message); 
    this.notificationMessages.push({ message: `${message.sender}: sent a message` });
    this.notificationCount++;
  }

  navigatetoProfile() {
    this.router.navigate(['/profile']);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; 
  }

  onSubmit() {
    if (this.selectedFile && this.newPostContent) {
      const formData = new FormData();
      formData.append('content', this.newPostContent);
      formData.append('imageFile', this.selectedFile);
      formData.append('userId', this.userId!); 

      this.userService.createPost(formData).subscribe(response => {
        console.log('Post created:', response);
        this.loadPosts(); 
        this.newPostContent = ''; 
        this.selectedFile = null;
      });
    } else {
      console.log('Error: Post content and image are required.');
    }
  }
}

export interface Like {
  userId: number;
  postId: number;
  username: string;
}
