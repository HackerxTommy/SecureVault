import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FileText, Download, Search, Filter, Calendar, Shield, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function AuditReports() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    // Mock data - replace with actual API call
    setReports([
      {
        id: 1,
        name: 'Q1 2024 Security Audit',
        type: 'audit',
        status: 'completed',
        compliance: ['SOC2', 'HIPAA', 'PCI-DSS'],
        vulnerabilities: { critical: 0, high: 2, medium: 5, low: 8 },
        createdAt: new Date(Date.now() - 86400000 * 30),
        author: 'System'
      },
      {
        id: 2,
        name: 'PCI-DSS Compliance Report',
        type: 'compliance',
        status: 'completed',
        compliance: ['PCI-DSS'],
        vulnerabilities: { critical: 0, high: 0, medium: 1, low: 3 },
        createdAt: new Date(Date.now() - 86400000 * 15),
        author: 'System'
      },
      {
        id: 3,
        name: 'SOC2 Type II Assessment',
        type: 'compliance',
        status: 'in_progress',
        compliance: ['SOC2'],
        vulnerabilities: null,
        createdAt: new Date(Date.now() - 86400000 * 7),
        author: 'System'
      }
    ]);
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'in_progress': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.compliance.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === 'all' || filter === report.status || filter === report.type;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-dark-950 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Audit & Compliance Reports</h1>
              <p className="text-dark-400">Security audits and compliance documentation</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg font-medium text-white transition-all">
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{reports.length}</p>
                  <p className="text-xs text-dark-400">Total Reports</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {reports.filter(r => r.status === 'completed').length}
                  </p>
                  <p className="text-xs text-dark-400">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {reports.filter(r => r.status === 'in_progress').length}
                  </p>
                  <p className="text-xs text-dark-400">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {[...new Set(reports.flatMap(r => r.compliance))].length}
                  </p>
                  <p className="text-xs text-dark-400">Compliance Standards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500 w-full"
              />
            </div>
            <div className="flex bg-dark-800/50 rounded-lg p-1">
              {['all', 'audit', 'compliance'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === type 
                      ? 'bg-brand-600 text-white' 
                      : 'text-dark-300 hover:text-white'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:bg-dark-800/70 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-dark-700/50 rounded-lg">
                      <FileText className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">{report.name}</h3>
                        <span className="px-2 py-1 bg-dark-700 rounded text-xs text-dark-300 capitalize">
                          {report.type}
                        </span>
                        {getStatusIcon(report.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        {report.compliance.map((c) => (
                          <span key={c} className="px-2 py-1 bg-brand-500/20 text-brand-400 rounded text-xs">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm mb-4">
                  <span className="text-dark-300">Created {new Date(report.createdAt).toLocaleString()}</span>
                  <span className="text-dark-400">•</span>
                  <span className="text-dark-300">By {report.author}</span>
                  {report.vulnerabilities && (
                    <>
                      <span className="text-dark-400">•</span>
                      <span className="text-red-400">{report.vulnerabilities.critical} Critical</span>
                      <span className="text-orange-400">{report.vulnerabilities.high} High</span>
                      <span className="text-yellow-400">{report.vulnerabilities.medium} Medium</span>
                      <span className="text-blue-400">{report.vulnerabilities.low} Low</span>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm text-white transition-all">
                    <Download className="w-4 h-4 inline mr-1" />
                    Download PDF
                  </button>
                  <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-white transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
