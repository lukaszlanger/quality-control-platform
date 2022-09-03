import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalVariables } from '../global-variables';
import { Items } from '../models/dtos/items';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  readonly itemsURL = 'Items';
  items: Items[];

  constructor(private http: HttpClient) {}

  public getItems(): Observable<Items[]> {
    return this.http.get<Items[]>(GlobalVariables.apiURL + this.itemsURL);
  }

  public getItemById(id: number): Observable<Items> {
    return this.http.get<Items>(
      GlobalVariables.apiURL + this.itemsURL + '/' + id
    );
  }
}
