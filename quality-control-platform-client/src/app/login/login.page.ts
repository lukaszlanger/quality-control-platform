import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    private loadingController: LoadingController,
    private form: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    (await this.authService.loginUser(this.loginForm.value)).subscribe(
      (user) => {
        if (user.role === 'ROLE_WORKER') {
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        } else if (user.role === 'ROLE_SUPERVISOR') {
          this.router.navigateByUrl('/menu', { replaceUrl: true });
        }
      }
    );
    await loading.dismiss();
  }
}
