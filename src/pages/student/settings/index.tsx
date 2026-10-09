import { useState } from 'react';
import MentorCoordinatorProfile from '../../mentor-coordinator/profile';
import ChangePassword from './components/ChangePassword';
import { User, KeyRound } from 'lucide-react';

export default function StudentProfile() {
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    return (
        <div className="space-y-6">
            {/* Top Navigation & Tabs Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                        Manage your profile details, academic preferences, and account credentials
                    </p>
                </div>

                {/* Modern Segmented Tab Switcher */}
                <div className="inline-flex items-center p-1.5 bg-slate-100/90 border border-slate-200/90 rounded-2xl shadow-2xs self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                            activeTab === 'profile'
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        }`}
                    >
                        <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>Profile Info</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('password')}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                            activeTab === 'password'
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        }`}
                    >
                        <KeyRound className={`w-4 h-4 ${activeTab === 'password' ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>Change Password</span>
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="pt-2">
                {activeTab === 'profile' && <MentorCoordinatorProfile />}
                {activeTab === 'password' && <ChangePassword />}
            </div>
        </div>
    );
}
