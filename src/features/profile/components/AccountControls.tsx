import { Shield, Bell, HelpCircle, ChevronRight } from 'lucide-react';

export default function AccountControls() {
  const controlItems = [
    { icon: Shield, label: 'Security & Privacy', href: '#' },
    { icon: Bell, label: 'Notification Settings', href: '#' },
    { icon: HelpCircle, label: 'Help Center', href: '#' },
  ];

  return (
    <section>
      <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-2 tracking-[0.1em]">Account Controls</h3>
      <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm rounded-2xl">
        {controlItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${
              index < controlItems.length - 1 ? 'border-b border-gray-200 dark:border-slate-800' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-5 h-5 text-[#009ADA] dark:text-sky-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-slate-500" />
          </a>
        ))}
      </div>
    </section>
  );
}
