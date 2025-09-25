import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getUserInitials = () => {
        if (!user) return 'U';
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="flex justify-around items-center shadow-lg py-3 bg-white relative z-10 border-b border-gray-100">
            <div className="flex items-center">
                <img src={logo} alt="NAMASTE Logo" className="h-17" onError={(e) => {
                    e.target.style.display = 'none';
                }} />
                <div>
                    <p className="font-bold text-2xl text-[#0a5614]">NAMASTE</p>
                    <p className="text-sm text-[#e6ce78]">Healthcare • Terminology • Platform</p>
                </div>
            </div>

            <div className="flex gap-10 text-[#0a5614] *:cursor-pointer">
                <Link to="/" className="hover:text-[#083f10] transition-colors">Dashboard</Link>
                <Link to="/mapping" className="hover:text-[#083f10] transition-colors">Find Codes</Link>
                <Link to="/ehr" className="hover:text-[#083f10] transition-colors">EHR</Link>
                <Link to="/patients" className="hover:text-[#083f10] transition-colors">Patients</Link>
                {user?.role === 'admin' && (
                    <Link to="/admin" className="hover:text-[#083f10] transition-colors font-semibold">Admin</Link>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <i className="fa-sharp fa-solid fa-moon text-[#0a5614] cursor-pointer hover:text-[#083f10] transition-colors"></i>

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-[#0a5614] to-[#d2ae2e] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {getUserInitials()}
                            </div>
                            <span className="text-[#0a5614] font-medium">
                                {user.first_name} {user.last_name}
                            </span>
                            <i className={`fas fa-chevron-down text-[#0a5614] text-sm transition-transform ${
                                showUserMenu ? 'rotate-180' : ''
                            }`}></i>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                    {user.role && (
                                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                                            user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    )}
                                </div>
                                <Link 
                                    to="/profile" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <i className="fas fa-user mr-2"></i>
                                    Profile
                                </Link>
                                <Link 
                                    to="/settings" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <i className="fas fa-cog mr-2"></i>
                                    Settings
                                </Link>
                                <hr className="my-1" />
                                <button
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        handleLogout();
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                >
                                    <i className="fas fa-sign-out-alt mr-2"></i>
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link 
                        to="/login"
                        className="text-white bg-black px-6 py-3 rounded-full bg-gradient-to-r from-[#0a5614] to-[#d2ae2e] cursor-pointer hover:from-[#083f10] hover:to-[#b8971a] transition-all"
                    >
                        Sign In
                    </Link>
                )}
            </div>

            {/* Click outside to close menu */}
            {showUserMenu && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                ></div>
            )}
        </div>
    )
}
