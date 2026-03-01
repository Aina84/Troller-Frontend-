import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../application/store/useAuthStore';

export const MainLayout = () => {
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center px-6 justify-between sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-primary">
                        <LayoutDashboard size={24} />
                        Troller
                    </Link>
                    <nav className="flex gap-4">
                        <Link to="/" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">Workspaces</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <UserIcon size={16} />
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="bg-transparent border-none cursor-pointer text-gray-600 flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};
