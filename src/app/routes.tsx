import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { Store } from './pages/Store';
import { Rules } from './pages/Rules';
import { Staff } from './pages/Staff';
import { Wiki } from './pages/Wiki';
import { Vote } from './pages/Vote';
import { Support } from './pages/Support';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'store', Component: Store },
      { path: 'wiki', Component: Wiki },
      { path: 'rules', Component: Rules },
      { path: 'vote', Component: Vote },
      { path: 'staff', Component: Staff },
      { path: 'support', Component: Support },
      { path: 'login', Component: Login },
      { path: '*', Component: NotFound },
    ],
  },
]);
