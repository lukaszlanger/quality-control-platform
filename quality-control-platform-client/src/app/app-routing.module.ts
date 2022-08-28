import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./supervisor-pages/register/register.module').then( m => m.RegisterPageModule),
    canActivate: [AuthGuard],
    data: {
      role: 'ROLE_SUPERVISOR'
    }
  },
  {
    path: 'tabs',
    loadChildren: () => import('./worker-pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
    data: {
      role: 'ROLE_WORKER'
    }
  },
  {
    path: 'menu',
    loadChildren: () => import('./supervisor-pages/menu/menu.module').then(m => m.MenuPageModule),
    canActivate: [AuthGuard],
    data: {
      role: 'ROLE_SUPERVISOR'
    }
  },
  {
    path: 'menu',
    loadChildren: () => import('./supervisor-pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./supervisor-pages/reports/reports.module').then( m => m.ReportsPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
