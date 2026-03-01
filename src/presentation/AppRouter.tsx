import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { Dashboard } from './pages/Dashboard';
import { BoardView } from './pages/BoardView';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { useAuthStore } from '../application/store/useAuthStore';

export const AppRouter = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    return (
        <Routes>
            {/* Public Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route
                path="/"
                element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
            >
                <Route index element={<Dashboard />} />
                <Route path="b/:boardId" element={<BoardView />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
