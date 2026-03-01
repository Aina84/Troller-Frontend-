import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-purple-500 p-4">
            <div className="bg-card p-10 rounded-lg shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-primary text-3xl flex items-center justify-center gap-2 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="9" x2="9" y1="9" y2="15" /><line x1="15" x2="15" y1="9" y2="15" /></svg>
                        Troller
                    </h1>
                </div>
                <Outlet />
            </div>
        </div>
    );
};
