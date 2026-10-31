import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';
import { InvitationPage } from './routes/index';

// Root Route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Index Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: InvitationPage,
});

// Catch-all Wildcard Route
const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: InvitationPage,
});

// Route Tree
const routeTree = rootRoute.addChildren([indexRoute, catchAllRoute]);

// Create Client-side TanStack Router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
