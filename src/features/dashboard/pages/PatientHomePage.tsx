import WelcomeHeader from '../components/WelcomeHeader';
import ActiveRequestCard from '../components/ActiveRequestCard';
import ActiveOrderCard from '../components/ActiveOrderCard';
import RecentActivity from '../components/RecentActivity';
import RecentRequests from '../components/RecentRequests';

export default function PatientHomePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <WelcomeHeader />

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActiveRequestCard />
        <ActiveOrderCard />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2">
          <RecentRequests />
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
