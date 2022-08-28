import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'folder/:id',
        loadChildren: () => import('../folder/folder.module').then(m => m.FolderPageModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('../charts/charts.module').then(m => m.ChartsPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('../register/register.module').then( m => m.RegisterPageModule)
      },
      {
        path: 'reports/:id',
        loadChildren: () => import('../reports/reports.module').then( m => m.ReportsPageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('../reports/reports.module').then( m => m.ReportsPageModule)
      },
      {
        path: '',
        redirectTo: 'notifications',
        pathMatch: 'full'
      },

    ],
    canActivate: [AuthGuard],
    data: {
      role: 'ROLE_SUPERVISOR'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
