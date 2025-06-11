import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { useInitTheme } from '../hooks/useInitTheme'; // adjust path if needed

function Layout() {
  useInitTheme();

  return (
    <>
      <NavBar />
      <main className="p-8">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
