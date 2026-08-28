import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import { ChatProvider } from './context/ChatContext';
import { PlatformNav } from './components/common/PlatformNav';
import { PlatformHome } from './pages/PlatformHome';
import { BusinessStorefront } from './pages/BusinessStorefront';
import { EmbedView } from './pages/EmbedView';
import { DashboardPage } from './pages/DashboardPage';
import { AuthModal } from './components/auth/AuthModal';
import { Toast, ToastMessage } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function getNormalizedPath(): string {
  // Support both standard browser paths and hash fallback
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('/')) return hash;
  return window.location.pathname || '/';
}

export const AppRouter: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(getNormalizedPath());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getNormalizedPath());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    try {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.location.hash = path;
      setCurrentPath(path);
    }
  };

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Route matching
  const isEmbedRoute = currentPath.startsWith('/embed/');
  const embedSlug = isEmbedRoute ? currentPath.replace('/embed/', '').split('/')[0] : '';

  const isStorefrontRoute = currentPath.startsWith('/b/');
  const storefrontSlug = isStorefrontRoute ? currentPath.replace('/b/', '').split('/')[0] : '';

  // If this is a standalone embed iframe, render only the embed widget
  if (isEmbedRoute && embedSlug) {
    return <EmbedView slug={embedSlug} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-terracotta-200 selection:text-terracotta-900 bg-artisan-50 text-artisan-900 font-sans">
      
      {/* Platform Navigation */}
      <PlatformNav currentRoute={currentPath} navigate={navigate} />

      {/* Main View Controller */}
      <main className="flex-1">
        {isStorefrontRoute && storefrontSlug ? (
          <BusinessStorefront slug={storefrontSlug} navigate={navigate} />
        ) : currentPath === '/dashboard' ? (
          <DashboardPage navigate={navigate} onNotify={(msg) => addToast(msg, 'success')} />
        ) : (
          <PlatformHome navigate={navigate} />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal />

      {/* Toast Feedback */}
      <Toast toasts={toasts} onDismiss={removeToast} />

    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BusinessProvider>
          <ChatProvider>
            <AppRouter />
          </ChatProvider>
        </BusinessProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
