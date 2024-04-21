import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {jwtDecode} from "jwt-decode";
import {Router} from "@angular/router";
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/';
  private tokenKey = 'authToken';
  private roleKey = 'userRole';

  constructor(private http: HttpClient,private router:Router) { }
  login(credentials: { email: string, password: string }): Observable<any> {
    const url = `${this.apiUrl}auth/login`;
    return this.http.post<any>(url, credentials);
  }
  storeTokenAndRole(token: string): void {
    localStorage.setItem(this.tokenKey, token);

    const decodedToken: any = jwtDecode(token);
    const userRole: string = decodedToken.roles[0];
    localStorage.setItem(this.roleKey, userRole);
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }
  clearTokenAndRole(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem("currentUser")
  }
  getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}userinfo`);
  }

  logout() {
    this.clearTokenAndRole();
    this.router.navigate(['/login']);
  }
  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}admin/signup`, user);
  }
  getAllUserExceptAdmin()
  {
    return this.http.get<User>(`${this.apiUrl}admin/all-except-admin`);

  }

  deleteUser(id: number):Observable<any> {
    return this.http.delete(`${this.apiUrl}admin/${id}`,{responseType:'text'});

  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}admin/${id}`);
  }
}
