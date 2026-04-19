import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FileText, Download, Eye, Calendar, Search, Filter } from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data } = await reportAPI.list();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId, format) => {
    try {
      const { data } = await reportAPI.get(reportId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Security Reports</h1>
            <p className="text-dark-400">View and download your security scan reports</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-dark-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-dark-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No reports yet</h3>
              <p className="text-dark-400">Reports will appear here after you complete security scans</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:bg-dark-800/70 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-brand-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-brand-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{report.title}</h3>
                      <p className="text-dark-400 text-sm">{report.scanId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-dark-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDownload(report._id, 'json')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-medium text-white transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDownload(report._id, 'json')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm font-medium text-dark-200 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
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
