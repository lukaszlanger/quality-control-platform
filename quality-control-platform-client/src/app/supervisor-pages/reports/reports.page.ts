import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { report } from 'process';
import { Items } from 'src/app/models/dtos/items';
import { Notifications } from 'src/app/models/dtos/notifications';
import { Reports } from 'src/app/models/dtos/reports';
import { DamageType } from 'src/app/models/enums/damage-type';
import { Decision } from 'src/app/models/enums/decision';
import { ReportAcceptance } from 'src/app/models/enums/report-acceptance';
import { ItemsService } from 'src/app/services/items.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ReportsService } from 'src/app/services/reports.service';
import { WorkersService } from 'src/app/services/workers.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  DamageType = DamageType;
  Decision = Decision;
  ReportAcceptance = ReportAcceptance;
  reportDetails = null;
  public routeId: string;

  constructor(
    private reportsService: ReportsService,
    private itemsService: ItemsService,
    private workersService: WorkersService,
    private activatedRoute: ActivatedRoute,
    private notificationsService: NotificationsService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.routeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.reportsService.getReports().subscribe((response: Reports[]) => this.reportsService.reports = response);
    this.itemsService.getItems().subscribe((response: Items[]) => this.itemsService.items = response);
  }

  async updateReportAcceptance(report: Reports, acceptance: number) {
    report.archivingDate = new Date();
    report.isArchived = true;
    report.reportAcceptance = acceptance;
    const alert = await this.alertController.create({
      header: 'Podejmij decyzję!',
      message: 'Wybierz przeznaczenie uszkodzonego przedmiotu.',
      inputs: [
        {
          label: Decision[0],
          type: 'radio',
          value: 0,
        },
        {
          label: Decision[1],
          type: 'radio',
          value: 1,
        },
        {
          label: Decision[2],
          type: 'radio',
          value: 2,
        },
      ],
      buttons: ['OK']
    });
    await alert.present();
    let res = await (await alert.onDidDismiss()).data;
    report.decision = Number(res.data);
    this.reportsService.putReport(report).subscribe();
    this.createNotification(acceptance - 1, report.workerId, null, report.reportId);
  }

  createPDF() {
    console.log(this.routeId);
  }

  createNotification(type: number, receiver: number, sender: number, reportId: number) {
    let notification: Notifications = {
      sender: sender,
      receiver: receiver,
      reportId: reportId,
      type: type
    }
    this.notificationsService.postNotification(notification);
  }

}
