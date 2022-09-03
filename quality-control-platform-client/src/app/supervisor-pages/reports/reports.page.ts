import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthService, User } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  currentUser: User;
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
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.routeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.reportsService
      .getReports()
      .subscribe(
        (response: Reports[]) => (this.reportsService.reports = response)
      );
    this.itemsService
      .getItems()
      .subscribe((response: Items[]) => (this.itemsService.items = response));
    this.authService
      .getCurrentUser()
      .subscribe((res) => (this.currentUser = res));
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
      buttons: ['OK'],
    });
    await alert.present();
    const res = await (await alert.onDidDismiss()).data;
    report.decision = Number(res.data);
    this.reportsService.putReport(report).subscribe();
    this.createNotification(
      acceptance - 1,
      report.workerId,
      null,
      report.reportId
    );
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = url;
    });
  }

  async createPDF(id: number) {
    const report = this.reportsService.reports.find(
      (response) => response.reportId === id
    );

    const item = this.itemsService.items.find(
      (response) => response.itemId === report.itemId
    );

    const worker = this.workersService.workers.find(
      (response) => response.workerId === report.workerId
    );

    const docDefinition = {
      content: [
        {
          columns: [
            {
              image: 'logo',
              width: 50,
            },
            {
              width: 'auto',
              text: 'Quality Control Platform',
              fontSize: 25,
            },
            {
              alignment: 'right',
              text: this.datePipe.transform(new Date(), 'dd.MM.YYYY r. HH:mm'),
              fontSize: 10,
            },
          ],
        },
        '\n\n',
        'Raport z analizy wyników kontroli jakości wykonanej w dniu ' +
          this.datePipe.transform(report.creationDate, 'dd.MM.YYYY r. HH:mm'),
        'Raport sprawdzony i oceniony przez ' + this.currentUser.displayName,
        '\n',
        {
          style: 'header',
          columns: [
            {
              width: '50%',
              text: 'Pracownik tworzący raport',
            },
            {
              width: '50%',
              text: 'Pracownik oceniający',
            },
          ],
        },
        {
          columns: [
            {
              width: '50%',
              text: worker.name + ' ' + worker.surname,
            },
            {
              width: '50%',
              text: this.currentUser.displayName,
            },
          ],
        },
        '\n',
        {
          style: 'header',
          columns: [
            {
              width: '50%',
              text: 'Przedmiot kontroli',
            },
            {
              width: '50%',
              text: 'Producent',
            },
          ],
        },
        {
          columns: [
            {
              width: '50%',
              text: item.name,
            },
            {
              width: '50%',
              text: item.manufacturer,
            },
          ],
        },
        '\n',
        {
          style: 'header',
          columns: [
            {
              width: '50%',
              text: 'Numer seryjny',
            },
            {
              width: '50%',
              text: 'Rodzaj uszkodzenia',
            },
          ],
        },
        {
          columns: [
            {
              width: '50%',
              text: item.serialNumber,
            },
            {
              width: '50%',
              text: DamageType[report.damageType],
            },
          ],
        },
        '\n',
        {
          style: 'header',
          columns: [
            {
              width: '100%',
              text: 'Opis uzupełniający',
            },
          ],
        },
        {
          columns: [
            {
              width: '100%',
              text: report.description,
              alignment: 'justify',
            },
          ],
        },
        '\n',
        {
          style: 'header',
          columns: [
            {
              width: '50%',
              text: 'Raport zarchiwizowano',
            },
            {
              width: '50%',
              text: 'Decyzja',
            },
          ],
        },
        {
          columns: [
            {
              width: '50%',
              text: this.datePipe.transform(
                report.archivingDate,
                'dd.MM.YYYY r. HH:mm'
              ),
            },
            {
              width: '50%',
              text: Decision[report.decision],
            },
          ],
        },
        '\n',
        'Zdjęcie szkody',
        {
          image: 'reportPhoto',
          width: 350,
        },
        '\n',
        'Podpis pracownika kontrolującego',
        {
          image: 'signature',
          width: 200,
        },
      ],
      images: {
        logo: await this.getBase64ImageFromURL('../../../assets/icon/logo.png'),
        reportPhoto: await this.getBase64ImageFromURL(
          '../../../assets/icon/tarcza.jpg'
        ),
        signature: await this.getBase64ImageFromURL(
          '../../../assets/icon/podpis.png'
        ),
      },
      styles: {
        header: {
          fontSize: 12,
          bold: true,
        },
        bigger: {
          fontSize: 15,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };

    const pdfObject = pdfMake.createPdf(docDefinition);
    pdfObject.download();
  }

  downloadPdf() {}

  createNotification(
    type: number,
    receiver: number,
    sender: number,
    reportId: number
  ) {
    const notification: Notifications = {
      sender: sender,
      receiver: receiver,
      reportId: reportId,
      type: type,
    };
    this.notificationsService.postNotification(notification);
  }
}
