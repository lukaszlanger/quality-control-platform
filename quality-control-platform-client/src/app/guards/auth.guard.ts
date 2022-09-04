import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { take, filter, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const roleExpected = route.data?.role;

    return this.authService.getCurrentUser().pipe(
      filter((val) => val !== null),
      take(1),
      map((user) => {
        if (!user) {
          this.showNotLoggedInAlert();
          return this.router.parseUrl('/login');
        } else {
          const role = user.role;

          if (!roleExpected || roleExpected === role) {
            return true;
          } else {
            this.showUnauthorizedAlert();
            return false;
          }
        }
      })
    );
  }

  async showUnauthorizedAlert() {
    const alert = await this.alertController.create({
      header: 'Błąd autoryzacji',
      message: 'Nie jesteś uprawniony do odwiedzenia tej strony!',
      buttons: ['OK'],
    });
    alert.present();
  }

  async showNotLoggedInAlert() {
    const alert = await this.alertController.create({
      header: 'Błąd autoryzacji',
      message: 'Nie jesteś zalogowany! Spróbuj ponownie',
      buttons: ['OK'],
    });
    alert.present();
  }
}
