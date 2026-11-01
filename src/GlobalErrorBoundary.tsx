import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ShieldAlert, RefreshCw, Trash2, Copy, Check, ChevronDown, ChevronUp, Stethoscope } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('CRITICAL APPLET ERROR CAUGHT BY BOUNDARY:', error, errorInfo);
  }

  handleReload = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.reload();
    } else {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  };

  handleResetStorageAndReload = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        // Clear active session keys to recover from corrupted state
        window.localStorage.removeItem('ogoo_active_chat_id_v3');
        window.sessionStorage.clear();
      } catch (_) {}
      window.location.reload();
    } else {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  };

  handleCopyDiagnostics = () => {
    const report = `Ogoo Healthcare Suite - Diagnostics Report
Timestamp: ${new Date().toISOString()}
Error: ${this.state.error?.message || 'Unknown error'}
Stack: ${this.state.error?.stack || 'No stack'}
Component Stack: ${this.state.errorInfo?.componentStack || 'No component stack'}
User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}`;

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(report).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2500);
      }).catch(() => {});
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.card}>
            {/* Header Icon & Title */}
            <View style={styles.iconCircle}>
              <ShieldAlert color="#FF4B4B" size={38} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Stethoscope color="#d8b4fe" size={18} style={{ marginRight: 6 }} />
              <Text style={styles.suiteBadge}>Universal Healthcare Suite • Safety Guard</Text>
            </View>

            <Text style={styles.title}>System Safe Mode Activated</Text>
            <Text style={styles.description}>
              An unexpected interface anomaly occurred. Your medical history, vital ledgers, and consultation records remain secure and protected.
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={this.handleReload}
                style={styles.primaryBtn}
                activeOpacity={0.8}
              >
                <RefreshCw color="#FFFFFF" size={16} style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Reload Consultation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleResetStorageAndReload}
                style={styles.secondaryBtn}
                activeOpacity={0.8}
              >
                <Trash2 color="#fca5a5" size={16} style={{ marginRight: 6 }} />
                <Text style={styles.secondaryBtnText}>Reset Corrupted State</Text>
              </TouchableOpacity>
            </View>

            {/* Error Diagnostics Toggle */}
            <TouchableOpacity
              onPress={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
              style={styles.detailsToggle}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsToggleText}>
                {this.state.showDetails ? 'Hide Technical Diagnostics' : 'Show Technical Diagnostics'}
              </Text>
              {this.state.showDetails ? (
                <ChevronUp color="#a78bfa" size={16} />
              ) : (
                <ChevronDown color="#a78bfa" size={16} />
              )}
            </TouchableOpacity>

            {this.state.showDetails && (
              <View style={styles.diagnosticsBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={styles.diagnosticsTitle}>Error Stack Trace:</Text>
                  <TouchableOpacity
                    onPress={this.handleCopyDiagnostics}
                    style={styles.copyBtn}
                  >
                    {this.state.copied ? (
                      <>
                        <Check color="#34d399" size={13} style={{ marginRight: 4 }} />
                        <Text style={{ color: '#34d399', fontSize: 11, fontWeight: '700' }}>Copied</Text>
                      </>
                    ) : (
                      <>
                        <Copy color="#d8b4fe" size={13} style={{ marginRight: 4 }} />
                        <Text style={{ color: '#d8b4fe', fontSize: 11, fontWeight: '700' }}>Copy Report</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ maxHeight: 180 }}>
                  <Text style={styles.codeText}>
                    {this.state.error?.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </Text>
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#0a0114',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    maxWidth: 580,
    width: '100%',
    backgroundColor: '#1b0630',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 75, 75, 0.35)',
    padding: 28,
    alignItems: 'center',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.6)'
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 75, 75, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 75, 75, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  suiteBadge: {
    color: '#d8b4fe',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center'
  },
  description: {
    color: '#c4b5fd',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5c1794',
    borderWidth: 1,
    borderColor: '#d8b4fe',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 180
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 75, 75, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 75, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18
  },
  secondaryBtnText: {
    color: '#fca5a5',
    fontSize: 13,
    fontWeight: '600'
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8
  },
  detailsToggleText: {
    color: '#a78bfa',
    fontSize: 12.5,
    fontWeight: '600',
    marginRight: 4
  },
  diagnosticsBox: {
    width: '100%',
    backgroundColor: '#0f021c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(216, 180, 254, 0.2)',
    padding: 12,
    marginTop: 12
  },
  diagnosticsTitle: {
    color: '#e9d5ff',
    fontSize: 12,
    fontWeight: '700'
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(92, 23, 148, 0.4)'
  },
  codeText: {
    color: '#f87171',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    fontSize: 11,
    lineHeight: 16
  }
});
