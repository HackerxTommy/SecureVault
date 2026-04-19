import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { scanAPI, analyticsAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import ScanCard from '../components/ScanCard';
import NewScanModal from '../components/NewScanModal';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Plus, 
  Zap, 
  GitBranch, 
  Globe, 
  Lock,
  ChevronRight,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Terminal,
  Cpu,
  Search
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNewScanModal, setShowNewScanModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [scansRes, analyticsRes] = await Promise.all([
        scanAPI.list({ limit: 10 }),
        analyticsAPI.getDashboard()
      ]);
      setScans(scansRes.data.scans);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanCreate = async (scanData) => {
    try {
      await scanAPI.create(scanData);
      loadData();
    } catch (error) {
      console.error('Failed to create scan:', error);
    }
  };

  const filteredScans = selectedTab === 'all' 
    ? scans 
    : scans.filter(scan => scan.targetType === selectedTab);

  const stats = analytics?.summary || {
    totalScans: 0,
    totalFindings: 0,
    criticalIssues: 0,
    activeScans: 0,
    avgScanDuration: 0
  };

  const severityData = analytics?.severity || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          {/* Hero Section - Strix.ai Inspired */}
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/10 to-transparent rounded-3xl blur-3xl" />
            <div className="relative bg-dark-800/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/20 rounded-full border border-violet-500/30">
                      <Zap className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-medium text-violet-300">AI-Powered Security</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-green-300">System Active</span>
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-3">
                    Penetration Testing in Hours,
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400"> Not Weeks</span>
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl mb-6">
                    SecureVault uses AI agents to find and fix vulnerabilities before they reach production. 
                    Connect your repos and domains, and launch a pentest in minutes.
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowNewScanModal(true)}
                      className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40"
                    >
                      <Play className="w-5 h-5" />
                      Start New Pentest
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-dark-700/50 hover:bg-dark-700 rounded-xl font-medium text-gray-300 transition-all border border-white/10">
                      <GitBranch className="w-5 h-5" />
                      Connect GitHub
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center">
                      <Shield className="w-24 h-24 text-violet-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Modern Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="group relative bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-dark-800/70 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-sm text-green-400 font-medium">+12%</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalScans}</div>
                <div className="text-sm text-gray-400">Total Scans</div>
              </div>
            </div>

            <div className="group relative bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-dark-800/70 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <span className="text-sm text-red-400 font-medium">Live</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalFindings}</div>
                <div className="text-sm text-gray-400">Vulnerabilities Found</div>
              </div>
            </div>

            <div className="group relative bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-dark-800/70 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-sm text-orange-400 font-medium">{stats.activeScans} Active</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.criticalIssues}</div>
                <div className="text-sm text-gray-400">Critical Issues</div>
              </div>
            </div>

            <div className="group relative bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-dark-800/70 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-sm text-gray-400 font-medium">Avg</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.avgScanDuration}s</div>
                <div className="text-sm text-gray-400">Scan Duration</div>
              </div>
            </div>
          </div>

          {/* Severity Distribution & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Severity Chart */}
            <div className="lg:col-span-1 bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Findings by Severity</h3>
              <div className="space-y-4">
                {[
                  { label: 'Critical', value: severityData.critical, color: 'bg-red-500', textColor: 'text-red-400' },
                  { label: 'High', value: severityData.high, color: 'bg-orange-500', textColor: 'text-orange-400' },
                  { label: 'Medium', value: severityData.medium, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
                  { label: 'Low', value: severityData.low, color: 'bg-green-500', textColor: 'text-green-400' },
                  { label: 'Info', value: severityData.info, color: 'bg-blue-500', textColor: 'text-blue-400' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-gray-400">{item.label}</div>
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max((item.value / (stats.totalFindings || 1)) * 100, 5)}%` }}
                      />
                    </div>
                    <div className={`w-8 text-sm font-medium ${item.textColor}`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                  <span className="text-sm text-green-400">Live</span>
                </div>
              </div>
              <div className="space-y-3">
                {analytics?.scans?.slice(0, 5).map((scan, index) => (
                  <div 
                    key={scan.id}
                    className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-xl border border-white/5 hover:bg-dark-700/50 transition-all"
                  >
                    {getStatusIcon(scan.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">{scan.target}</span>
                        <span className="px-2 py-0.5 text-xs bg-dark-600 rounded-full text-gray-400 capitalize">
                          {scan.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {new Date(scan.date).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${scan.findings > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {scan.findings} issues
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{scan.status}</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scans Section */}
          <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Security Scans</h2>
                <p className="text-sm text-gray-400 mt-1">Monitor and manage your active security tests</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-dark-700/50 rounded-lg p-1">
                  {['all', 'web', 'api', 'repo'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedTab === tab 
                          ? 'bg-violet-600 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowNewScanModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium text-white transition-all"
                >
                  <Plus className="w-4 h-4" />
                  New Scan
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredScans.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-dark-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No scans yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Launch your first AI-powered security scan to start finding vulnerabilities
                </p>
                <button
                  onClick={() => setShowNewScanModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium text-white transition-all"
                >
                  <Play className="w-5 h-5" />
                  Start First Pentest
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScans.map((scan) => (
                  <ScanCard
                    key={scan._id}
                    scan={scan}
                    onClick={() => console.log('View scan:', scan._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <NewScanModal
        isOpen={showNewScanModal}
        onClose={() => setShowNewScanModal(false)}
        onScanCreate={handleScanCreate}
      />
    </div>
  );
}
