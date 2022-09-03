import { Component, OnInit } from '@angular/core';
import { Workers } from 'src/app/models/dtos/workers';
import { AuthService, User } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { WorkersService } from 'src/app/services/workers.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  currentWorker: Workers;
  currentUser: User;

  constructor(
    private notificationsService: NotificationsService,
    private workersService: WorkersService,
    private authService: AuthService
  ) {
    this.getNotifications();
    this.workersService
      .getWorkers()
      .subscribe(
        (response: Workers[]) => (this.workersService.workers = response)
      );
    this.authService
      .getCurrentUser()
      .subscribe((res) => (this.currentUser = res));
  }

  ngOnInit(): void {
    this.currentWorker = this.workersService.workers.find(
      (response) => response.identityNumber === this.currentUser.uid
    );
  }

  public getSender(id: number): string {
    const sender: Workers = this.workersService.workers.find(
      (response) => response.workerId === id
    );
    return sender.name + ' ' + sender.surname;
  }

  private getNotifications() {
    this.notificationsService
      .getNotifications()
      .subscribe(
        (response) => (this.notificationsService.notifications = response)
      );
  }

  private deleteNotification(id: number) {
    this.notificationsService
      .deleteNotification(id)
      .subscribe((response) => this.getNotifications());
  }
}
