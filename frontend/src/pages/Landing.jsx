import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Lock, 
  Globe, 
  GitBranch, 
  Activity, 
  ChevronRight,
  CheckCircle,
  Play,
  Target,
  Code,
  Server,
  ArrowRight
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Scanning',
      description: 'Autonomous AI agents that find vulnerabilities like real hackers'
    },
    {
      icon: Target,
      title: 'Web App Security',
      description: 'Comprehensive DAST scanning for modern web applications'
    },
    {
      icon: Code,
      title: 'Code Analysis',
      description: 'SAST scanning for repositories with GitHub integration'
    },
    {
      icon: Server,
      title: 'Infrastructure',
      description: 'Network and cloud security assessment capabilities'
    },
    {
      icon: GitBranch,
      title: 'CI/CD Integration',
      description: 'Automated security testing in your development pipeline'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Continuous security monitoring with instant alerts'
    }
  ];

  const testimonials = [
    {
      quote: "SecureVault found critical vulnerabilities we missed for months. Game changer.",
      author: "Sarah Chen",
      role: "CISO, TechCorp"
    },
    {
      quote: "The AI-powered approach reduced our pentest time from weeks to hours.",
      author: "Michael Ross",
      role: "Security Lead, StartupX"
    },
    {
      quote: "Best security investment we've made. Professional grade at a fraction of the cost.",
      author: "Emily Watson",
      role: "CTO, FinanceHub"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SecureVault</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-dark-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-dark-300 hover:text-white transition-colors">Pricing</a>
              <a href="#docs" className="text-dark-300 hover:text-white transition-colors">Docs</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/auth" className="hidden sm:block text-dark-300 hover:text-white font-medium transition-colors">
                Sign in
              </Link>
              <Link to="/auth" className="btn-primary flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/10 via-dark-950 to-dark-950" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-brand-300">Now with AI-powered pentesting</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Penetration Testing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
                in Hours, Not Weeks
              </span>
            </h1>

            <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              SecureVault uses AI agents to find and fix vulnerabilities before they reach production. 
              Connect your repos and domains, and launch a pentest in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 rounded-xl font-semibold text-white transition-all duration-300 shadow-glow hover:shadow-glow-lg">
                <Play className="w-5 h-5" />
                <span>Start Free Trial</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#demo" className="flex items-center gap-2 px-8 py-4 bg-dark-800/50 hover:bg-dark-800 rounded-xl font-medium text-dark-200 transition-all border border-white/5 hover:border-white/10">
                <Globe className="w-5 h-5" />
                <span>Watch Demo</span>
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-dark-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-dark-400">Vulnerabilities Found</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-dark-400">Security Scans</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-dark-400">Uptime SLA</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">&lt;1hr</div>
              <div className="text-dark-400">Avg Scan Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need for Security</h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Comprehensive security testing powered by AI agents. Find vulnerabilities that others miss.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 bg-dark-900/50 border border-white/5 rounded-2xl hover:bg-dark-900 hover:border-brand-500/20 transition-all duration-300">
                <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-dark-400 text-lg">Get started in minutes, not days</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Connect Your Assets</h3>
              <p className="text-dark-400">Add your web apps, APIs, or GitHub repositories to SecureVault.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Launch AI Scan</h3>
              <p className="text-dark-400">Our AI agents autonomously explore and test your applications.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Actionable Reports</h3>
              <p className="text-dark-400">Receive detailed findings with PoCs and remediation guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Security Teams</h2>
            <p className="text-dark-400 text-lg">See what our customers have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-dark-900/50 border border-white/5 rounded-2xl">
                <p className="text-dark-200 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-dark-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative p-12 bg-gradient-to-br from-brand-600/20 to-brand-900/20 border border-brand-500/20 rounded-3xl text-center overflow-hidden">
            <div className="absolute inset-0 bg-brand-600/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Applications?</h2>
              <p className="text-dark-300 mb-8 max-w-xl mx-auto">
                Join thousands of teams using SecureVault to find and fix vulnerabilities before attackers do.
              </p>
              <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 rounded-xl font-semibold text-white transition-all shadow-glow">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">SecureVault</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-dark-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-dark-500">
              © 2026 SecureVault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
