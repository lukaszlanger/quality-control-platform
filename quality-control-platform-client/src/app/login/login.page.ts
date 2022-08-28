import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { Workers } from '../models/dtos/workers';
import { AuthService } from '../services/auth.service';
import { WorkersService } from '../services/workers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  currentWorker: Workers;

  constructor(
    public authService: AuthService,
    private workersService: WorkersService,
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

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
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

  redirectToRegister() {
    this.router.navigateByUrl('register', { replaceUrl: true });
  }
}
