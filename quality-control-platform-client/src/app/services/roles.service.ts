import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalVariables } from '../global-variables';
import { Roles } from '../models/dtos/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  readonly rolesURL = "Roles";
  roles: Roles[];

  constructor(private http: HttpClient) { }

  public getRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(GlobalVariables.apiURL+this.rolesURL).pipe(tap(response => this.roles = response))
  }
}
