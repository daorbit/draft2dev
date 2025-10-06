import { ComponentType } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
import AIComponentAgent from './pages/AIComponentAgent';

export interface RouteConfig {
  path: string;
  component: ComponentType;
  title: string;
  requiresAuth: boolean;
}

export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: Login,
    title: 'Login',
    requiresAuth: false,
  },
  {
    path: '/signup',
    component: Signup,
    title: 'Sign Up',
    requiresAuth: false,
  },
];

export const privateRoutes: RouteConfig[] = [
  {
    path: '/',
    component: AIComponentAgent,
    title: 'Dashboard',
    requiresAuth: true,
  },
  // {
  //   path: '/',
  //   component: Dashboard,
  //   title: 'Dashboard',
  //   requiresAuth: true,
  // },
  // {
  //   path: '/ai-agent',
  //   component: AIComponentAgent,
  //   title: 'AI HTML Generator',
  //   requiresAuth: true,
  // },
];

 export const allRoutes = [...publicRoutes, ...privateRoutes];

export const DEFAULT_PUBLIC_PATH = '/login';
export const DEFAULT_PRIVATE_PATH = '/';