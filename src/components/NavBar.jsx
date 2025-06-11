import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFullName } from '../hooks/useFullName';

function NavBar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const name = useFullName();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Check In', path: '/check-in' },
    { name: 'Manifest', path: '/manifest' },
    { name: 'Waivers', path: '/waivers' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-accent text-button-text px-6 py-4 flex items-center justify-between shadow-md border-b border-fg/20">
  {/* LEFT SIDE: Logo + Welcome */}
  <div className="flex items-center gap-4">
    <Link to="/" className="text-2xl font-bold tracking-tight hover:opacity-90">
      STACK
    </Link>
    <span className="text-sm font-bold">
      Welcome, {name}{' '}
      <button onClick={signOut} className="underline hover:opacity-70 font-light text-xs ml-1">
        (Sign out)
      </button>
    </span>
  </div>

  {/* RIGHT SIDE: Navigation */}
  <ul className="flex gap-6 text-lg">
    {navItems.map((item) => (
      <li key={item.name}>
        <Link
          to={item.path}
          className={`hover:text-hover ${
            location.pathname === item.path ? 'underline underline-offset-4' : ''
          }`}
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</nav>

  );
}

export default NavBar;
