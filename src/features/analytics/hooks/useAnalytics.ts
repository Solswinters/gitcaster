/**
 * General analytics hook
 */

import { useState, useCallback } from 'react';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

export function useAnalytics() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  const trackEvent = useCallback((name: string, properties?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date(),
    };

    setEvents((prev) => [...prev, event]);

    // Send to analytics service
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(console.error);
  }, []);

  const trackPageView = useCallback((path: string) => {
    trackEvent('page_view', { path });
  }, [trackEvent]);

  const trackClick = useCallback((element: string, context?: Record<string, any>) => {
    trackEvent('click', { element, ...context });
  }, [trackEvent]);

  return {
    events,
    trackEvent,
    trackPageView,
    trackClick,
  };
}
