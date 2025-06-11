import { useAuth } from './contexts/AuthContext';

function Widget({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 min-w-[250px] max-w-md w-full">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}

export default function Home() {
  const { session, user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome to STACK 🪂</h1>
      <p className="text-gray-600 mb-6">The brains behind the planes ✈️</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Widget title="Today's Jumpers">
          <p>📋 12 jumpers checked in</p>
        </Widget>

        <Widget title="Weather">
          <p>☀️ Clear skies, 72°F</p>
        </Widget>

        <Widget title="Waivers Signed">
          <p>📝 34 waivers today</p>
        </Widget>

        <Widget title="Quick Actions">
          <ul className="list-disc list-inside">
            <li>📥 Check in jumper</li>
            <li>📤 Upload media</li>
          </ul>
        </Widget>
      </div>
    </div>
  );
}
