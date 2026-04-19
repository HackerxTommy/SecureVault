import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { scanAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Activity as ActivityIcon, CheckCircle2, XCircle, Clock, Shield, Globe, GitBranch, Server } from 'lucide-react';

export default function Activity() {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadActivity();
    const interval = setInterval(loadActivity, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadActivity = async () => {
    try {
      const { data } = await scanAPI.list({ limit: 100 });
      setScans(data.scans || []);
    } catch (error) {
      console.error('Failed to load activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <ActivityIcon className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTargetIcon = (targetType) => {
    switch (targetType) {
      case 'web': return <Globe className="w-4 h-4 text-blue-400" />;
      case 'api': return <Server className="w-4 h-4 text-purple-400" />;
      case 'repo': return <GitBranch className="w-4 h-4 text-orange-400" />;
      default: return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Activity Log</h1>
            <p className="text-dark-400">Track all your security scan activities</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : scans.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-dark-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ActivityIcon className="w-10 h-10 text-dark-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No activity yet</h3>
              <p className="text-dark-400">Your scan activities will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => (
                <div
                  key={scan._id}
                  className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:bg-dark-800/70 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-dark-700/50 rounded-lg">
                      {getStatusIcon(scan.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{scan.target}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          scan.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          scan.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          scan.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {scan.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-dark-400 mb-3">
                        <div className="flex items-center gap-2">
                          {getTargetIcon(scan.targetType)}
                          <span className="capitalize">{scan.targetType}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(scan.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {scan.status === 'completed' && scan.findings && (
                        <div className="text-sm">
                          <span className="text-dark-300">Found {scan.findings.length} vulnerabilities</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
