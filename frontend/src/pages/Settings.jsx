import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { 
  User, 
  Bell, 
  Shield as ShieldIcon, 
  Key, 
  Globe, 
  Save,
  CheckCircle2,
  Settings as SettingsIcon
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: ShieldIcon },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'preferences', name: 'Preferences', icon: Globe }
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-dark-400">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? 'bg-brand-500/20 text-brand-300 border border-brand-500/20'
                            : 'text-dark-300 hover:bg-dark-700/50 hover:text-dark-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.email?.split('@')[0]}
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          disabled
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-dark-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">Role</label>
                        <input
                          type="text"
                          defaultValue={user?.role || 'User'}
                          disabled
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-dark-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      {[
                        'Email notifications for completed scans',
                        'Email notifications for critical findings',
                        'Push notifications for scan updates',
                        'Weekly security summary reports'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-white/5">
                          <span className="text-dark-200">{item}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                            <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">Current Password</label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">New Password</label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-400 text-sm">
                          Password must be at least 8 characters and include a mix of letters, numbers, and symbols.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'api' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">API Keys</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-dark-900/50 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">Production API Key</span>
                          <span className="text-green-400 text-xs">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-sm text-dark-400 bg-dark-800 px-3 py-2 rounded">
                            sk_live_************************
                          </code>
                          <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                            <Key className="w-4 h-4 text-dark-400" />
                          </button>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-brand-600 hover:bg-brand-500 rounded-lg font-medium text-white transition-all">
                        Generate New API Key
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">Timezone</label>
                        <select className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500">
                          <option>UTC</option>
                          <option>America/New_York</option>
                          <option>Europe/London</option>
                          <option>Asia/Kolkata</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-200 mb-2">Language</label>
                        <select className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-white/5">
                        <div>
                          <span className="text-white font-medium">Dark Mode</span>
                          <p className="text-dark-400 text-sm">Use dark theme across the platform</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                  {saved && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Settings saved</span>
                    </div>
                  )}
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-lg font-medium text-white transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
