import { Activity, Bell, CheckCircle, FileClock } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      title: 'New pharmacy offer received',
      time: '2 hours ago',
      icon: Bell,
      iconBg: 'bg-teal-100 text-teal-600',
    },
    {
      id: 2,
      title: 'Order accepted by City Health',
      time: 'Yesterday',
      icon: CheckCircle,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 3,
      title: 'Request status updated to pending',
      time: '2 days ago',
      icon: FileClock,
      iconBg: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center gap-2">
        <Activity className="w-5 h-5 text-gray-500" />
        <h2 className="font-semibold text-lg text-gray-900">Recent Activity</h2>
      </div>
      <div className="p-5">
        <div className="relative border-s-2 border-gray-100 ms-3 space-y-6">
          {activities.map((item) => (
            <div key={item.id} className="relative ps-6">
              <span 
                className={`absolute -start-[17px] flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white ${item.iconBg}`}
              >
                <item.icon className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
