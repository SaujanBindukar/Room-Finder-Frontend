import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RoomFinderApiProvider {
  BASEURL = "http://patancollegeroomfinder.herokuapp.com/room-finder";
    // BASEURL = "http://192.168.1.87:3000/room-finder";

  constructor(public http: HttpClient) { }

  createUser(data): Observable<any> {
    return this.http.post(`${this.BASEURL}/auth/register`, data);
  }

  login(data): Observable<any> {
    return this.http.post(`${this.BASEURL}/auth/login`, data);
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.BASEURL}/user/profile`);
  }

  getRoomForHome(): Observable<any> {
    return this.http.get(`${this.BASEURL}/rooms/getRoomForHome`);
  }

  getRoomsPosts(): Observable<any> {
    return this.http.get(`${this.BASEURL}/rooms/getRoomsPosts`);
  }

  addRoom(data): Observable<any> {
    return this.http.post(`${this.BASEURL}/rooms/addRoom`, data);
  }

  search(data): Observable<any> {
    return this.http.post(`${this.BASEURL}/rooms/search`, data)
  }

  deleteRoom(id): Observable<any> {
    return this.http.delete(`${this.BASEURL}/rooms/delete/${id}`);
  }

  //Alternative
  newChat(recipient): Observable<any> {
    return this.http.post(`${this.BASEURL}/chat/newChat`, recipient);
  }

  getConversations(): Observable<any> {
    return this.http.get(`${this.BASEURL}/chat/conversations`);
  }

  getConversation(conversationId): Observable<any> {
    return this.http.get(`${this.BASEURL}/chat/conversation/${conversationId}`);
  }

  sendReply(body): Observable<any> {
    return this.http.post(`${this.BASEURL}/chat/sendReply`, body);
  }

  updatePersonalInfo(body): Observable<any> {
    return this.http.put(`${this.BASEURL}/user/updatePersonalInfo`, body);
  }

  getPersonalInfo(): Observable<any> {
    return this.http.get(`${this.BASEURL}/user/getPersonalInfo`);
  }

  //Notification

  sendNotifications(body) : Observable<any> {
    return this.http.put(`${this.BASEURL}/user/sendNotifications`,body);
  }
  getNotifications(): Observable<any> {
    return this.http.get(`${this.BASEURL}/user/notifications`);
  }

  viewNotification(notification): Observable<any> {
    return this.http.put(`${this.BASEURL}/user/viewNotification`, notification);
  }

  notifiedNotification(notification): Observable<any> {
    return this.http.put(`${this.BASEURL}/user/notifiedNotification`, notification);
  }

  //Testing
  whatIGot(body): Observable<any> {
    return this.http.post(`${this.BASEURL}/rooms/testing`, body);
  }
}
