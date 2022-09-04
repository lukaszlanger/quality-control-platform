import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { WorkersService } from './workers.service';
import { Workers } from '../models/dtos/workers';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';
import { RolesService } from './roles.service';
import { Roles } from '../models/dtos/roles';

const TOKEN_KEY = 'user-token';

export interface User {
  uid: string;
  displayName: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public auth: Auth,
    private router: Router,
    private workersService: WorkersService,
    private rolesService: RolesService
  ) {
    this.workersService
      .getWorkers()
      .subscribe(
        (response: Workers[]) => (this.workersService.workers = response)
      );
    this.rolesService
      .getRoles()
      .subscribe((response: Roles[]) => (this.rolesService.roles = response));
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    Storage.get({ key: TOKEN_KEY }).then((res) => {
      if (res.value) {
        this.currentUser.next(JSON.parse(res.value));
      } else {
        this.currentUser.next(false);
      }
    });
  }

  getCurrentUser() {
    return this.currentUser.asObservable();
  }

  async registerUser({ email, password, name, surname, role, isActive }) {
    let userObject: User;
    const displayName = name + ' ' + surname;
    try {
      const userRegisterRequest = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      if (userRegisterRequest) {
        await updateProfile(this.auth.currentUser, {
          displayName,
        });
        if (role) {
          userObject = {
            uid: userRegisterRequest.user.uid,
            displayName: userRegisterRequest.user.displayName,
            role,
          };
          const worker: Workers = {
            name,
            surname,
            email,
            identityNumber: userRegisterRequest.user.uid,
            roleId: role,
            isActive,
          };
          this.workersService.postWorker(worker).subscribe((response) => {
            this.workersService.getWorkers();
            console.log(response);
          });
        } else {
          alert('Błąd! Rola niedozwolona');
        }
      }

      return of(userObject).pipe(
        tap((user) => {
          Storage.set({ key: TOKEN_KEY, value: JSON.stringify(user) });
          this.currentUser.next(user);
        })
      );
    } catch (e) {
      return null;
    }
  }

  async loginUser({ email, password }) {
    let userObject: User;
    try {
      const userLoginRequest = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      if (userLoginRequest) {
        const worker = this.workersService.workers.find(
          (response: Workers) =>
            userLoginRequest.user.uid === response.identityNumber
        );
        const roleToken = this.rolesService.roles.find(
          (response: Roles) => worker.roleId === response.roleId
        ).roleToken;
        if (worker.roleId) {
          userObject = {
            uid: userLoginRequest.user.uid,
            displayName: userLoginRequest.user.displayName,
            role: roleToken,
          };
        } else {
          alert('Błąd! Rola niedozwolona.');
        }
      } else {
        alert('Błąd logowania! Użytkownik nie istnieje.');
      }

      return of(userObject).pipe(
        tap((user) => {
          Storage.set({ key: TOKEN_KEY, value: JSON.stringify(user) });
          this.currentUser.next(user);
        })
      );
    } catch (error) {
      return error;
    }
  }

  async logoutUser() {
    await Storage.remove({ key: TOKEN_KEY });
    this.currentUser.next(false);
    signOut(this.auth).then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }

  // TODO disableuser
  toggleDisableUser() {}
}
