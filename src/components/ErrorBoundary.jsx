import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-8 bg-red-50 min-h-screen flex flex-col items-center justify-center text-red-900">
          <h1 className="text-3xl font-bold mb-4">Algo salió mal :(</h1>
          <p className="mb-4">Por favor, reporta este error al administrador:</p>
          <div className="bg-white p-4 rounded shadow border border-red-200 w-full max-w-2xl overflow-auto">
            <h2 className="text-xl font-mono mb-2 text-red-700">
              {this.state.error && this.state.error.toString()}
            </h2>
            <details className="whitespace-pre-wrap font-mono text-sm text-gray-700">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
