import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { ResumeBuilder } from './components/resume-builder/resume-builder';

export const routes: Routes = [
  { path: '',               component: LandingPage },
  { path: 'login',          component: Login },
  { path: 'signup',         component: Register },
  { path: 'dashboard',      component: Dashboard },
  { path: 'resume-builder', component: ResumeBuilder },
  { path: '**',             redirectTo: '' },
];
