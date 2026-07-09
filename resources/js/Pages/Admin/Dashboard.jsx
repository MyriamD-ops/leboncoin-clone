import { Link } from '@inertiajs/react';

export default function AdminDashboard({ stats, recentAnnonces }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.key} className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">{stat.key}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Announcements</h2>
          {recentAnnonces.length === 0 ? (
            <p className="text-gray-600">No announcements yet</p>
          ) : (
            <ul>
              {recentAnnonces.map((ann) => (
                <li key={ann.id} className="py-2 border-b">
                  {ann.title} - {ann.status}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8">
          <Link href={route('annonces.index')} className="text-blue-600 hover:underline">
            Back to announcements
          </Link>
        </div>
      </div>
    </div>
  );
}
