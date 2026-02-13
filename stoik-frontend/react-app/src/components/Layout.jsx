import { Outlet } from 'react-router-dom';
import { Nav, Footer } from './index.js';
import ColorCollectionsNav from './ColorCollectionsNav.jsx';

export default function Layout() {
  return (
    <div>
      <Nav />
      <div className="layout-color-nav-wrap">
        <ColorCollectionsNav className="layout-color-nav" />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
}
