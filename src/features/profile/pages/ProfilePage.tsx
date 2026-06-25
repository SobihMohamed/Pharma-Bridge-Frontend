import ProfileDetailsCard from '../components/ProfileDetailsCard';
import AddressList from '../components/AddressList';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your personal information and delivery addresses.</p>
      </div>

      <section>
        <ProfileDetailsCard />
      </section>

      <section>
        <AddressList />
      </section>
    </div>
  );
}
