import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Items } from '../../models/dtos/items';
import { Reports } from '../../models/dtos/reports';
import { Workers } from '../../models/dtos/workers';
import { DamageType } from '../../models/enums/damage-type';
import { Decision } from '../../models/enums/decision';
import { ReportAcceptance } from '../../models/enums/report-acceptance';
import { AuthService, User } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';
import { ReportsService } from '../../services/reports.service';
import { WorkersService } from '../../services/workers.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  currentWorker: Workers;
  DamageType = DamageType;
  Decision = Decision;
  ReportAcceptance = ReportAcceptance;
  reportDetails = null;
  currentUser: User;

  constructor(
    private reportsService: ReportsService,
    private itemsService: ItemsService,
    private workersService: WorkersService,
    private authService: AuthService
    ) {
      this.reportsService.getReports().subscribe((response: Reports[]) => this.reportsService.reports = response);
      this.itemsService.getItems().subscribe((response: Items[]) => this.itemsService.items = response);
      this.workersService.getWorkers().subscribe((response: Workers[]) => this.workersService.workers = response);
      this.authService.getCurrentUser().subscribe(res => this.currentUser = res);
    }

  ngOnInit(): void {
    this.reportDetails = document.querySelector('.ion-page');
  }

  logout() {
    return this.authService.logoutUser();
  }

  createPDF() {
  }
}
