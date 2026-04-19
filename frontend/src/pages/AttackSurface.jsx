import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Radar, Globe, Server, Database, AlertTriangle, Shield, Activity, RefreshCw } from 'lucide-react';

export default function AttackSurface() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    // Mock data - replace with actual API call
    setAssets([
      {
        id: 1,
        type: 'domain',
        name: 'example.com',
        subdomains: 12,
        vulnerabilities: 5,
        riskLevel: 'high',
        lastScanned: new Date()
      },
      {
        id: 2,
        type: 'ip',
        name: '192.168.1.1',
        ports: [80, 443, 22],
        vulnerabilities: 2,
        riskLevel: 'medium',
        lastScanned: new Date()
      },
      {
        id: 3,
        type: 'api',
        name: 'api.example.com',
        endpoints: 15,
        vulnerabilities: 8,
        riskLevel: 'critical',
        lastScanned: new Date()
      }
    ]);
    setLoading(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'domain': return Globe;
      case 'ip': return Server;
      case 'api': return Database;
      default: return Globe;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Attack Surface Monitoring</h1>
              <p className="text-dark-400">Monitor and manage your organization's attack surface</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg font-medium text-white transition-all">
              <RefreshCw className="w-4 h-4" />
              Scan Now
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/20 rounded-lg">
                  <Radar className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{assets.length}</p>
                  <p className="text-xs text-dark-400">Total Assets</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {assets.filter(a => a.riskLevel === 'critical' || a.riskLevel === 'high').length}
                  </p>
                  <p className="text-xs text-dark-400">High Risk</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {assets.reduce((acc, a) => acc + a.vulnerabilities, 0)}
                  </p>
                  <p className="text-xs text-dark-400">Vulnerabilities</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Active</p>
                  <p className="text-xs text-dark-400">Monitoring</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assets List */}
          <div className="space-y-4">
            {assets.map((asset) => {
              const Icon = getIcon(asset.type);
              return (
                <div
                  key={asset.id}
                  className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:bg-dark-800/70 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-dark-700/50 rounded-lg">
                        <Icon className="w-6 h-6 text-brand-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
                        <p className="text-sm text-dark-400 capitalize">{asset.type}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(asset.riskLevel)}`}>
                      {asset.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm mt-4 mb-4">
                    <span className="text-dark-300">
                      {asset.subdomains || asset.ports?.length || asset.endpoints} {asset.type === 'domain' ? 'Subdomains' : asset.type === 'ip' ? 'Open Ports' : 'Endpoints'}
                    </span>
                    <span className="text-dark-300">{asset.vulnerabilities} Vulnerabilities</span>
                    <span className="text-dark-400">•</span>
                    <span className="text-dark-300">Last scanned {new Date(asset.lastScanned).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm text-white transition-all">
                      Scan Asset
                    </button>
                    <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-white transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
