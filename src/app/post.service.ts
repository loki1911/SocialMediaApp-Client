import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'https://localhost:7106/api/Post';

  constructor(private http: HttpClient) {}

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/${userId}`);
  }
}
export interface Post {
  userId: number;
  content: string;
  image: string | null; 
}
