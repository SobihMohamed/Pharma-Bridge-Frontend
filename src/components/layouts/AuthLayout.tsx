import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
      <main className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <Outlet />
      </main>
    </div>
  );
}
