import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { onAuthStateChanged } from 'firebase/auth';
import { Roles } from '../../models/dtos/roles';
import { Workers } from '../../models/dtos/workers';
import { AuthService } from '../../services/auth.service';
import { RolesService } from '../../services/roles.service';
import { WorkersService } from '../../services/workers.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  private registerForm: FormGroup;
  private worker: Workers = {
    name: '',
    surname: '',
    email: '',
    identityNumber: '',
    roleId: null,
    isActive: true
  }

  constructor(
    public authService: AuthService,
    private workersService: WorkersService,
    private rolesService: RolesService,
    private loadingController: LoadingController,
    private form: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    ) {
      this.workersService.getWorkers().subscribe((response: Workers[]) => this.workersService.workers = response);
      this.rolesService.getRoles().subscribe((response: Roles[]) => this.rolesService.roles = response);
    }

  ngOnInit() {
    this.registerForm = this.form.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [null, [Validators.required]],
      isActive: [null]
    });
  }

  get email(): string {
    return this.registerForm.get('email').value;
  }
  get password() {
    return this.registerForm.get('password').value;
  }
  get name(): string {
    return this.registerForm.get('name').value;
  }
  get surname(): string {
    return this.registerForm.get('surname').value;
  }
  get role(): number {
    return this.registerForm.get('role').value;
  }
  get isActive(): boolean {
    return this.registerForm.get('isActive').value;
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    if(this.registerForm.valid) {
      const userRegistration = await this.authService.registerUser({
        email: this.email, 
        password: this.password, 
        name: this.name, 
        surname: this.surname, 
        role: this.role, 
        isActive: this.isActive
      });

      if (userRegistration) {
        const alertRegistrationSuccessed = await this.alertController.create({
          header: 'Sukces!',
          message: 'Rejestracja konta "' + this.name + ' ' + this.surname + ' zakończona pomyślnie.',
          buttons: ['OK']
        });
        alertRegistrationSuccessed.present();
      } else {
        const alertRegistrationFailed = await this.alertController.create({
          header: 'Błąd!',
          message: 'Rejestracja nie powiodła się, spróbuj ponownie!',
          buttons: ['OK']
        });
        alertRegistrationFailed.present();
      }

    }
    await loading.dismiss();
  }
}
