import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { useAuthStore } from '../../application/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const setAuth = useAuthStore(state => state.setAuth);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleRegister = async () => {
        try {
            const response = await AuthRepository.register(name, email, "default", password);
            setAuth(response.user, response.access_token);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <form className="flex flex-col gap-5">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Full Name</label>
                <input
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full p-3 rounded-md border border-gray-200 outline-none focus:border-primary transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Email Address</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 rounded-md border border-gray-200 outline-none focus:border-primary transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3 rounded-md border border-gray-200 outline-none focus:border-primary transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                type="button"
                onClick={handleRegister}
                className="bg-primary hover:bg-primary-hover text-white p-3 rounded-md border-none font-semibold cursor-pointer mt-2 transition-colors"
            >
                Sign Up
            </button>
            <p className="text-center text-gray-600 text-sm">
                Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
        </form>
    );
};
