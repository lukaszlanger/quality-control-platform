import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalVariables } from '../global-variables';
import { Reports } from '../models/dtos/reports';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  readonly reportsURL = 'Reports';
  reports: Reports[];

  constructor(private http: HttpClient) {}

  public getReports(): Observable<Reports[]> {
    return this.http.get<Reports[]>(GlobalVariables.apiURL + this.reportsURL);
  }

  public postReport(report: Reports): Observable<Reports> {
    return this.http.post<Reports>(
      GlobalVariables.apiURL + this.reportsURL,
      report
    );
  }

  public putReport(report: Reports): Observable<Reports> {
    return this.http.put<Reports>(
      GlobalVariables.apiURL + this.reportsURL + '/' + report.reportId,
      report
    );
  }
}
