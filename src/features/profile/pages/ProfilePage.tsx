import ProfileDetailsCard from '../components/ProfileDetailsCard';
import AddressList from '../components/AddressList';
import StatsGrid from '../components/StatsGrid';
import AccountControls from '../components/AccountControls';
import RecentActivity from '../components/RecentActivity';
import { usePatientProfileQuery } from '../hooks/useProfileQueries';

export default function ProfilePage() {
  const { data: profile } = usePatientProfileQuery();

  return (
    <div className="pt-6 pb-16 px-4 max-w-[1200px] mx-auto w-full">
      {/* Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Overview */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileDetailsCard />
          <AccountControls />
        </div>

        {/* Right Column: Stats, Addresses & Activities */}
        <div className="lg:col-span-8 space-y-8">
          {/* Page Title */}
          <div className="hidden lg:block">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Welcome back{profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}. Here's an overview of your recent activity.
            </p>
          </div>

          {/* Stats Grid */}
          <StatsGrid />

          {/* Addresses Section */}
          <AddressList />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
