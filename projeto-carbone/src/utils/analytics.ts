// Sistema de Analytics customizado

interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  timestamp: number;
  page: string;
  sessionId: string;
}

class Analytics {
  private sessionId: string;
  private userId: string | null = null;
  private queue: AnalyticsEvent[] = [];
  private apiEndpoint = import.meta.env.VITE_ANALYTICS_API || '/api/analytics';

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.setupPageTracking();
    this.setupPerformanceTracking();
    this.startQueueFlush();
  }

  // Gerar/recuperar Session ID
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session', sessionId);
    }
    return sessionId;
  }

  // Definir usuário
  setUser(userId: string) {
    this.userId = userId;
    localStorage.setItem('analytics_user', userId);
  }

  // Limpar usuário
  clearUser() {
    this.userId = null;
    localStorage.removeItem('analytics_user');
  }

  // Rastrear evento
  track(event: string, category: string, label?: string, value?: number) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      label,
      value,
      userId: this.userId || undefined,
      timestamp: Date.now(),
      page: window.location.pathname + window.location.hash,
      sessionId: this.sessionId,
    };

    this.queue.push(analyticsEvent);
    console.log('📊 Analytics:', analyticsEvent);

    // Flush imediato para eventos críticos
    if (category === 'error' || category === 'conversion') {
      this.flush();
    }
  }

  // Rastrear pageview
  pageView(page?: string) {
    this.track(
      'pageview',
      'navigation',
      page || window.location.pathname + window.location.hash
    );
  }

  // Rastrear clique
  click(element: string, label?: string) {
    this.track('click', 'engagement', label || element);
  }

  // Rastrear formulário
  formSubmit(formName: string, success: boolean) {
    this.track(
      success ? 'form_submit_success' : 'form_submit_error',
      'form',
      formName
    );
  }

  // Rastrear erro
  error(_errorMessage: string, errorType: string) {
    this.track('error', 'error', errorType, undefined);
  }

  // Rastrear conversão
  conversion(conversionName: string, value?: number) {
    this.track('conversion', 'conversion', conversionName, value);
  }

  // Rastrear tempo na página
  timeOnPage(page: string, seconds: number) {
    this.track('time_on_page', 'engagement', page, seconds);
  }

  // Setup automático de pageview
  private setupPageTracking() {
    // Rastrear mudanças de hash
    window.addEventListener('hashchange', () => {
      this.pageView();
    });

    // Rastrear pageview inicial
    this.pageView();
  }

  // Setup de métricas de performance
  private setupPerformanceTracking() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.track('lcp', 'performance', 'largest_contentful_paint', lastEntry.renderTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP não suportado');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.track('fid', 'performance', 'first_input_delay', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID não suportado');
      }
    }

    // Page Load Time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        this.track('page_load', 'performance', 'load_time', pageLoadTime);
      }, 0);
    });
  }

  // Enviar eventos para servidor
  private async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error('Erro ao enviar analytics:', error);
      // Voltar eventos para a fila
      this.queue.unshift(...events);
    }
  }

  // Flush automático a cada 10 segundos
  private startQueueFlush() {
    setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, 10000);

    // Flush antes de sair da página
    window.addEventListener('beforeunload', () => {
      if (this.queue.length > 0) {
        navigator.sendBeacon(
          this.apiEndpoint,
          JSON.stringify({ events: this.queue })
        );
      }
    });
  }
}

// Singleton
const analytics = new Analytics();

export default analytics;

// Hooks para React
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    pageView: analytics.pageView.bind(analytics),
    click: analytics.click.bind(analytics),
    formSubmit: analytics.formSubmit.bind(analytics),
    error: analytics.error.bind(analytics),
    conversion: analytics.conversion.bind(analytics),
    setUser: analytics.setUser.bind(analytics),
    clearUser: analytics.clearUser.bind(analytics),
  };
};
