import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from '@angular/fire/auth';
import { WorkersService } from './workers.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Workers } from '../models/dtos/workers';
import { updateCurrentUser } from 'firebase/auth';
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
  providedIn: 'root'
})
export class AuthService {
  private currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  
  constructor(
    private router: Router,
    public auth: Auth,
    private workersService: WorkersService,
    private rolesService: RolesService,
  ) {
    this.workersService.getWorkers().subscribe((response: Workers[]) => this.workersService.workers = response);
    this.rolesService.getRoles().subscribe((response: Roles[]) => this.rolesService.roles = response);
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    Storage.get({ key: TOKEN_KEY }).then(res => {
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
    let displayName = name + " " + surname;
    try {
      const userRegisterRequest = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      if(userRegisterRequest) {
        await updateProfile(this.auth.currentUser, {displayName: displayName});
        if(role) {
          userObject = {
            uid: userRegisterRequest.user.uid,
            displayName: userRegisterRequest.user.displayName,
            role: role
          }
          let worker: Workers = {
            name: name,
            surname: surname,
            email: email,
            identityNumber: userRegisterRequest.user.uid,
            roleId: role,
            isActive: isActive
          }
          this.workersService.postWorker(worker).subscribe((response) => {
            this.workersService.getWorkers();
            console.log(response);
          });
        } else {
          alert("Błąd! Rola niedozwolona");
        }
      }
      
      return of(userObject).pipe(
        tap(user => {
          Storage.set({ key: TOKEN_KEY, value: JSON.stringify(user) });
          this.currentUser.next(user);
        })
      );
    } catch (e) {
      return null;
    }
  }

  // TODO sprawdzic czy isActive
  async loginUser({ email, password }) {
    let userObject: User;
    try {
      const userLoginRequest = await signInWithEmailAndPassword(this.auth, email, password);
      if(userLoginRequest) {
        var worker = this.workersService.workers.find((response: Workers) => userLoginRequest.user.uid === response.identityNumber);
        var roleToken = this.rolesService.roles.find((response: Roles) => worker.roleId === response.roleId).roleToken;
        if(worker.roleId) {
          userObject = {
            uid: userLoginRequest.user.uid,
            displayName: userLoginRequest.user.displayName,
            role: roleToken
          }
        } else {
          alert("Błąd! Rola niedozwolona");
        }
      } else
      alert('brak uzytkownika');

      return of(userObject).pipe(
        tap(user => {
          Storage.set({ key: TOKEN_KEY, value: JSON.stringify(user) });
          this.currentUser.next(user);
        })
      );
    } catch (e) {
      return null;
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
  toggleDisableUser() {

  }
}
