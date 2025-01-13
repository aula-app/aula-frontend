import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  name: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error boundary wrapper to save Application parts from falling
 * @component ErrorBoundary
 * @param {string} [props.name] - name of the wrapped segment, "Error Boundary" by default
 */
class ErrorBoundary extends Component<Props, State> {
  static defaultProps = {
    name: 'Error Boundary',
  };

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // The next render will show the Error UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Save information to help render Error UI
    this.setState({ error, errorInfo });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error(`Error in ${this.props.name}:`, error);
      console.error('Component Stack:', errorInfo.componentStack);
    }

    // Here you could add error reporting service integration
    // e.g., Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      // Error UI rendering
      return (
        <div
          style={{
            padding: '20px',
            margin: '20px',
            borderRadius: '8px',
            backgroundColor: '#fff3f3',
            border: '1px solid #ffcdd2',
          }}
        >
          <h2 style={{ color: '#d32f2f', margin: '0 0 16px 0' }}>{this.props.name} - Something went wrong</h2>
          <p style={{ color: '#555', margin: '0 0 16px 0' }}>
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          {import.meta.env.DEV && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary style={{ cursor: 'pointer', color: '#666' }}>Error Details</summary>
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                {this.state?.error?.toString()}
                <br />
                {this.state?.errorInfo?.componentStack}
              </div>
            </details>
          )}
        </div>
      );
    }

    // Normal UI rendering
    return this.props.children;
  }
}

export default ErrorBoundary;
