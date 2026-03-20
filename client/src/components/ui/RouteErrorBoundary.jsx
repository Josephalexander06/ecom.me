import React from 'react';
import { Link } from 'react-router-dom';

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep this in console for quick debugging when a route crashes in production.
    console.error('Route render error:', error);
    this.setState({ errorMessage: error?.message ? String(error.message) : 'Unknown render error' });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="site-shell py-10">
          <div className="panel p-6 md:p-8 text-center">
            <h2 className="text-2xl font-display font-bold text-text-primary">Something went wrong on this page</h2>
            <p className="mt-2 text-sm text-text-secondary">
              We hit an unexpected error while rendering this route.
            </p>
            {this.state.errorMessage ? (
              <p className="mt-2 text-xs text-danger break-all">
                Error: {this.state.errorMessage}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="h-10 rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                Reload page
              </button>
              <Link
                to="/products"
                className="h-10 rounded-xl border border-border-default px-4 text-sm font-semibold text-text-secondary hover:text-text-primary inline-flex items-center"
              >
                Back to products
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
