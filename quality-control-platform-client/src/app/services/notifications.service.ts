import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalVariables } from '../global-variables';
import { Notifications } from '../models/dtos/notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  readonly notificationsURL = 'Notifications';
  notifications: Notifications[];

  constructor(private http: HttpClient) {}

  public getNotifications(): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(
      GlobalVariables.apiURL + this.notificationsURL
    );
  }

  public postNotification(
    notification: Notifications
  ): Observable<Notifications> {
    return this.http.post<Notifications>(
      GlobalVariables.apiURL + this.notificationsURL,
      notification
    );
  }

  public deleteNotification(id: number): Observable<Notifications> {
    return this.http.delete<Notifications>(
      GlobalVariables.apiURL + this.notificationsURL + '/' + id
    );
  }
}
