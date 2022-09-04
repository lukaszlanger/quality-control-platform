import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { Reports } from 'src/app/models/dtos/reports';
import { DamageType } from 'src/app/models/enums/damage-type';
import { ReportsService } from 'src/app/services/reports.service';
Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit {
  @ViewChild('barChart') barChart;
  @ViewChild('lineChart') lineChart;
  bars: any;
  lines: any;
  currentMonth: number = new Date().getMonth();
  chosenMonth: number = new Date().getMonth();
  public months = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ];

  // DAMAGE TYPE CHART
  private data0: number;
  private data1: number;
  private data2: number;
  private data3: number;
  private data4: number;

  constructor(
    private reportsService: ReportsService,
    private alertController: AlertController
  ) {
    this.reportsService
      .getReports()
      .subscribe(
        (response: Reports[]) => (this.reportsService.reports = response)
      );
    this.fetchDataDamageTypeChart(this.currentMonth);
  }

  ngOnInit() {}

  async onMonthButtonClick() {
    const monthsInputs = [];
    for (let i = 0; i < this.months.length; i++) {
      monthsInputs.push({
        type: 'radio',
        label: this.months[i],
        value: i,
      });
    }
    const alert = await this.alertController.create({
      header: 'Wybierz miesiąc',
      inputs: monthsInputs,
      buttons: [
        {
          text: 'OK',
          handler(value) {
            this.chosenMonth = value;
          },
        },
      ],
    });
    await alert.present();
    const response = await (await alert.onDidDismiss()).data;
    const valueMonth = Number(response.data);
    //this.chosenMonth = valueMonth;
    this.fetchDataDamageTypeChart(valueMonth);
    console.log(this.chosenMonth);
  }

  async fetchDataDamageTypeChart(month: number) {
    this.data0 = 1;
    this.data1 = 3;
    this.data2 = 2;
    this.data3 = 1;
    this.data4 = 4;
    // this.reportsService.reports.forEach(element => {
    //   const creationDateMonth = new Date(element.creationDate).getMonth();
    //   if(creationDateMonth == month) {
    //     switch(element.damageType) {
    //       case 0: this.data0 += 1;
    //       case 1: this.data1 += 1;
    //       case 2: this.data2 += 1;
    //       case 3: this.data3 += 1;
    //       case 4: this.data4 += 1;
    //     }
    //   }
    // });
    // this.bars.destroy();
    // this.createDamageTypeChart();
  }

  ionViewDidEnter() {
    this.createDamageTypeChart();
    this.createLinesChart();
  }

  createDamageTypeChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          DamageType[0],
          DamageType[1],
          DamageType[2],
          DamageType[3],
          DamageType[4],
        ],
        datasets: [
          {
            label: 'Ilość przedmiotów',
            data: [this.data0, this.data1, this.data2, this.data3, this.data4],
            backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createLinesChart() {
    this.lines = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: [
          this.months[0],
          this.months[1],
          this.months[2],
          this.months[3],
          this.months[4],
          this.months[5],
          this.months[6],
          this.months[7],
          this.months[8],
          this.months[9],
          this.months[10],
          this.months[11],
        ],
        datasets: [
          {
            label: 'Ilość zgłoszonych szkód w miesiącu',
            data: [
              this.data0,
              this.data1,
              this.data2,
              this.data3,
              this.data4,
              15,
              9,
              5,
              11,
            ],
            backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'x',
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
