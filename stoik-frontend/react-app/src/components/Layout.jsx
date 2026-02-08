import { Outlet } from 'react-router-dom';
import { Nav, Footer } from './index.js';

export default function Layout() {
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}
