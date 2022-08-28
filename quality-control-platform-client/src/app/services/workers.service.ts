import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalVariables } from '../global-variables';
import { Workers } from '../models/dtos/workers';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {

  readonly workersURL = "Workers";
  workers: Workers[];

  constructor(private http: HttpClient) { }

  public getWorkers(): Observable<Workers[]> {
    return this.http.get<Workers[]>(GlobalVariables.apiURL + this.workersURL);
  }

  public getWorkerById(id: number): Observable<Workers> {
    return this.http.get<Workers>(GlobalVariables.apiURL + this.workersURL + '/' + id);
  }

  public postWorker(worker: Workers): Observable<Workers> {
    return this.http.post<Workers>(GlobalVariables.apiURL + this.workersURL, worker);
  }

  public putWorker(worker: Workers): Observable<Workers> {
    return this.http.put<Workers>(GlobalVariables.apiURL + this.workersURL + '/' + worker.workerId, worker);
  }
}
