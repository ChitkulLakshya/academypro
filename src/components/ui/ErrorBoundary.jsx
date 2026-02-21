import { Component } from 'react'

// ─── Error Boundary ───────────────────────────────────────────
// Catches render errors in the component tree and shows a
// user-friendly fallback instead of a blank screen.

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // in production you'd send this to a logging service
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          background: '#0a0a0a',
          padding: 24,
          textAlign: 'center',
          fontFamily: '"Inter", system-ui, sans-serif',
        }}>
          {/* icon */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(255, 69, 58, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 28 }}>⚠️</span>
          </div>

          <h2 style={{ color: '#f5f5f7', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
            Something went wrong
          </h2>

          <p style={{ color: '#8e8e93', fontSize: 14, margin: '0 0 24px', maxWidth: 320, lineHeight: 1.5 }}>
            An unexpected error occurred. You can try refreshing or going back to the home screen.
          </p>

          {/* error details (collapsed by default) */}
          {this.state.error && (
            <details style={{
              marginBottom: 24,
              width: '100%',
              maxWidth: 360,
              background: '#161616',
              border: '1px solid #2c2c2e',
              borderRadius: 12,
              padding: 12,
              textAlign: 'left',
            }}>
              <summary style={{ color: '#636366', fontSize: 12, cursor: 'pointer', marginBottom: 8 }}>
                Error details
              </summary>
              <pre style={{
                color: '#FF453A',
                fontSize: 11,
                fontFamily: '"JetBrains Mono", monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
              }}>
                {this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <pre style={{
                  color: '#636366',
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: '8px 0 0',
                  maxHeight: 120,
                  overflow: 'auto',
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}

          {/* action buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={this.handleReset}
              style={{
                background: '#F5A623',
                color: '#000',
                border: 'none',
                borderRadius: 10,
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#2c2c2e',
                color: '#f5f5f7',
                border: '1px solid #3a3a3c',
                borderRadius: 10,
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
