import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Items } from 'src/app/models/dtos/items';
import { Reports } from 'src/app/models/dtos/reports';
import { DamageType } from 'src/app/models/enums/damage-type';
import { Decision } from 'src/app/models/enums/decision';
import { ReportAcceptance } from 'src/app/models/enums/report-acceptance';
import { ItemsService } from 'src/app/services/items.service';
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
  ) { }

  ngOnInit() {
    this.routeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.reportsService.getReports().subscribe((response: Reports[]) => this.reportsService.reports = response);
    this.itemsService.getItems().subscribe((response: Items[]) => this.itemsService.items = response);
  }

  acceptReport(report: Reports) {
    report.archivingDate = new Date();
    report.isArchived = true;
    report.decision = 1;
    this.reportsService.putReport(report);
  }

  createPDF() {
    console.log(this.routeId);
  }

}
