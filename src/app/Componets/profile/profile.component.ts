import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/post.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  implements OnInit{
  userData: any;
  posts: any[] = [];
  username : any = null;
  userId : any = null;


  constructor(private postService: PostService , private sanitizer : DomSanitizer) {
    this.username = sessionStorage.getItem('username');
    this.userId = sessionStorage.getItem('userId')
  }
  

  ngOnInit(): void {
    this.userData = {
      username : this.username,
    
    };
    this.loadPosts();

  }

  onEditProfile(): void {
    console.log('Edit profile clicked');
  }
  loadPosts(): void {
    this.postService.getPostsByUserId(this.userId).subscribe(data => {
      this.posts = data.map(post => ({
        ...post,
        image: post.image ? this.createImageFromBase64(post.image): null
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
}
