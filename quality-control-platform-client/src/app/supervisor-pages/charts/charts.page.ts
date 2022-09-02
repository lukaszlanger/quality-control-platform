import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Reports } from 'src/app/models/dtos/reports';
import { DamageType } from 'src/app/models/enums/damage-type';
import { Decision } from 'src/app/models/enums/decision';
import { ReportsService } from 'src/app/services/reports.service';
Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit {
  DamageType = DamageType;
  Decision = Decision;
  @ViewChild('barChart') barChart;
  bars: any;
  currentMonth: number = new Date().getMonth();
  public months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  
  // DAMAGE TYPE CHART
  private data0: number = 0;
  private data1: number = 0;
  private data2: number = 0;
  private data3: number = 0;
  private data4: number = 0;

  constructor(
    private reportsService: ReportsService,
    private http: HttpClient, 
    private router: Router) {
      this.reportsService.getReports().subscribe((response: Reports[]) => this.reportsService.reports = response);
    }

  ngOnInit() {
    this.fetchDataDamageTypeChart(this.currentMonth);
  }

  fetchDataDamageTypeChart(month: number) {
    this.data0 = 0;
    this.data1 = 0;
    this.data2 = 0;
    this.data3 = 0;
    this.data4 = 0;
    this.reportsService.reports.forEach(element => {
      const creationDateMonth = new Date(element.creationDate).getMonth();
      if(creationDateMonth == month) {
        switch(element.damageType) {
          case 0: this.data0 += 1;
          case 1: this.data1 += 1;
          case 2: this.data2 += 1;
          case 3: this.data3 += 1;
          case 4: this.data4 += 1;
        }
      }
    });
    
  }

  ionViewDidEnter() {
    this.createDamageTypeChart();
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
        datasets: [{
          label: 'Ilość produktów',
          data: [this.data0, this.data1, this.data2, this.data3, this.data4],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
              beginAtZero: true
          }
        }
      }
    });
  }

}
