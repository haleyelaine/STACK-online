import { Link } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
  VideoCameraIcon,
  UserGroupIcon,
  IdentificationIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

const settings = [
  {
    label: 'Jump Types',
    icon: ClipboardDocumentListIcon,
    path: '/jump-types',
  },
  {
    label: 'Tandem Altitudes',
    icon: ArrowTrendingUpIcon,
    path: '/tandem-altitudes',
  },
  {
    label: 'Media Options',
    icon: VideoCameraIcon,
    path: '/media-options',
  },
  {
    label: 'Student Jumps',
    icon: UserGroupIcon,
    path: '/student-jumps',
  },
  {
    label: 'Roles & Ratings',
    icon: IdentificationIcon,
    path: '/roles-and-ratings',
  },
  {
    label: 'Customize View',
    icon: AdjustmentsHorizontalIcon,
    path: '/customize-view',
  },
  {
    label: 'Create User',
    icon: UserGroupIcon,
    path: '/create-user',
  },
];

export default function SettingsDashboard() {
  return (
    <div className="p-6 min-h-screen bg-bg text-title">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-hover mb-10">
        Build <span className="italic">your</span> STACK
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings.map(({ label, icon: Icon, path }) => (
          <Link
            to={path}
            key={path}
            className="group flex items-center gap-4 border border-fg/10 rounded-xl p-5 bg-bg hover:bg-fg/5 transition"
          >
            <div className="bg-fg/10 group-hover:bg-fg/20 p-3 rounded-lg">
              <Icon className="h-6 w-6 text-fg group-hover:text-fg" />
            </div>
            <span className="text-lg font-medium text-title group-hover:text-fg">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
