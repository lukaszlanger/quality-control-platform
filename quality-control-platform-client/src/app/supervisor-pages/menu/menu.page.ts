import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Items } from 'src/app/models/dtos/items';
import { Reports } from 'src/app/models/dtos/reports';
import { AuthService, User } from 'src/app/services/auth.service';
import { ItemsService } from 'src/app/services/items.service';
import { ReportsService } from 'src/app/services/reports.service';
import { RegisterPage } from '../register/register.page';
import { ReportsPage } from '../reports/reports.page';
import { ChartsPage } from '../charts/charts.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  currentUser: User;

  public appPages = [
    { title: 'Raporty oczekujące', url: 'reports/:waiting', icon: 'document', component: ReportsPage },
    { title: 'Raporty zarchiwizowane', url: 'reports/:archived', icon: 'archive', component: ReportsPage },
    { title: 'Wykresy', url: 'charts', icon: 'bar-chart', component: ChartsPage },
    { title: 'Zarejestruj pracownika', url: 'register', icon: 'person-add', component: RegisterPage },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(res => this.currentUser = res);
  }

  redirectToPage(url: string) {
    this.router.navigateByUrl('menu/' + url, { replaceUrl: true });
  }

  logout() {
    return this.authService.logoutUser();
  }
}
