// checkout-module/utils/events.ts

export type EventListener = (...args: unknown[]) => void;

/**
 * Simple event emitter for checkout system
 */
export class CheckoutEventEmitter {
  private listeners: Record<string, EventListener[]> = {};

  /**
   * Add an event listener
   */
  on(event: string, callback: EventListener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remove an event listener
   */
  off(event: string, callback: EventListener): void {
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  /**
   * Add a one-time event listener
   */
  once(event: string, callback: EventListener): void {
    const onceWrapper = (...args: unknown[]) => {
      callback(...args);
      this.off(event, onceWrapper);
    };

    this.on(event, onceWrapper);
  }

  /**
   * Emit an event to all listeners
   */
  emit(event: string, ...args: unknown[]): void {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error);
      }
    });
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

  /**
   * Get all event names that have listeners
   */
  eventNames(): string[] {
    return Object.keys(this.listeners);
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    return this.listeners[event]?.length || 0;
  }
}
