import { Shield, Bell, HelpCircle, ChevronRight } from 'lucide-react';

export default function AccountControls() {
  const controlItems = [
    { icon: Shield, label: 'Security & Privacy', href: '#' },
    { icon: Bell, label: 'Notification Settings', href: '#' },
    { icon: HelpCircle, label: 'Help Center', href: '#' },
  ];

  return (
    <section>
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-[0.1em]">Account Controls</h3>
      <div className="bg-white border border-gray-200 overflow-hidden shadow-sm rounded-2xl">
        {controlItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
              index < controlItems.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-5 h-5 text-[#009ADA]" />
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </a>
        ))}
      </div>
    </section>
  );
}
