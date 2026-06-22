import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#111] border-2 border-gray-800 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon size={40} className="text-red-500" />
            </div>
            
            <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-4">
              Oops! System Error
            </h1>
            
            <p className="text-gray-400 mb-8 text-sm md:text-base">
              We encountered an unexpected glitch. Our engineers have been notified. Please try refreshing the page or head back to home.
            </p>

            {this.state.error && process.env.NODE_ENV === 'development' && (
                <div className="text-left bg-black p-4 rounded-xl border border-gray-800 overflow-x-auto mb-8">
                    <p className="text-red-400 font-mono text-xs">{this.state.error.toString()}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-[#ff007f] hover:bg-[#e60073] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(255,0,127,0.3)]"
              >
                <RefreshCcw size={18} />
                Reload Page
              </button>
              <Link 
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all"
              >
                <Home size={18} />
                Go Home
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
