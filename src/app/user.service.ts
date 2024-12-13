import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:7106/api';

  constructor(private http: HttpClient) {}

  signUp(fullName: string, username: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const user = { fullName, username, email, password };

    return this.http.post(`${this.apiUrl}/User/signup`, user, { headers });
}
login(username: string, password: string): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const loginData = { username, password };

  return this.http.post(`${this.apiUrl}/User/login`, loginData, { headers });
}
getPosts(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/Post/get-posts`);
}

createPost(post: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/Post/create`, post);
}


}
