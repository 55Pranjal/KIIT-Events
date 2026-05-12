import React from "react";

/**
 * Top-level error boundary.
 *
 * Catches render-time exceptions in the React tree below it and shows a
 * friendly fallback so a single broken component doesn't blank the entire
 * app. Only catches render errors — async errors (failed fetches, event
 * handlers) still surface through their own paths.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Surface to the console so dev still sees the stack. In production this
    // is the natural place to forward to an error monitoring service later.
    console.error("[ErrorBoundary] caught:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffffb] px-4">
        <div className="max-w-md w-full bg-white border border-[#e5e5e5] rounded-2xl shadow-sm p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-[#111] tracking-tightish mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            An unexpected error stopped this page from loading. Try reloading,
            or head back home.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-left text-xs bg-red-50 border border-red-100 text-red-700 rounded-lg p-3 mb-6 overflow-x-auto whitespace-pre-wrap">
              {String(this.state.error?.message || this.state.error)}
            </pre>
          )}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={this.handleReset}
              className="px-4 py-2.5 text-sm font-medium border border-[#e5e5e5] text-[#333] hover:bg-gray-50 rounded-lg transition-all"
            >
              Try again
            </button>
            <button
              onClick={this.handleReload}
              className="px-4 py-2.5 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg shadow-sm transition-all"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
