import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-artisan-50 flex items-center justify-center p-6 font-sans">
          <div className="card-artisan p-8 max-w-md w-full text-center space-y-4 shadow-warm-xl border border-rose-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-warm-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h2 className="font-serif font-bold text-xl text-artisan-950">
                Something went wrong
              </h2>
              <p className="text-xs text-artisan-600">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('convo_token');
                window.location.href = '/';
              }}
              className="btn-primary !text-xs !py-2 !px-4 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Session & Reload</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
