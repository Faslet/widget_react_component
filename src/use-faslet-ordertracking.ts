import { useEffect } from 'react';

export interface Product {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  priceTimesQuantity: number;
  quantity: number;
  sku: string;
}

type OrderTracker = NonNullable<Window['_faslet_orders']>;

const EXISTING_SCRIPT_TIMEOUT_MS = 15_000;
let trackerReady: Promise<OrderTracker> | undefined;
const dispatchedLines = new Map<string, number>();

function loadOrderTracker(): Promise<OrderTracker> {
  if (trackerReady) return trackerReady;

  trackerReady = getOrderTracker().then((tracker) => {
    tracker.configure();
    return tracker;
  }).catch((error) => {
    trackerReady = undefined;
    throw error;
  });
  return trackerReady;
}

function getOrderTracker(): Promise<OrderTracker> {
  if (typeof window._faslet_orders?.event === 'function') {
    return Promise.resolve(window._faslet_orders);
  }

  const existing = document.querySelector<HTMLScriptElement>('script#faslet-order-tracking-tag');
  const faslet = existing ?? document.createElement('script');

  return new Promise<OrderTracker>((resolve, reject) => {
    let timeout: number | undefined;

    function cleanup() {
      window.clearTimeout(timeout);
      faslet.removeEventListener('load', onLoad);
      faslet.removeEventListener('error', onError);
    }

    function onLoad() {
      cleanup();
      const tracker = window._faslet_orders;
      if (typeof tracker?.event !== 'function') {
        reject(new Error('Faslet order tracker is unavailable after script load'));
      } else {
        resolve(tracker);
      }
    }

    function onError() {
      cleanup();
      reject(new Error('Failed to load the Faslet order tracking script'));
    }

    faslet.addEventListener('load', onLoad);
    faslet.addEventListener('error', onError);

    if (existing) {
      // The existing tag may have failed before we could observe its error event.
      timeout = window.setTimeout(onError, EXISTING_SCRIPT_TIMEOUT_MS);
    } else {
      faslet.id = 'faslet-order-tracking-tag';
      faslet.src = 'https://widget.prod.faslet.net/faslet-orders.js';
      document.head.appendChild(faslet);
    }
  }).catch((error) => {
    // Remove the failed tag, including an existing tag we adopted, so a later mount can retry.
    faslet.remove();
    throw error;
  });
}

export const useFasletOrderTracking = (
  shopId: string,
  orderNumber: string,
  paymentStatus: string,
  products: Product[]
) => {
  useEffect(() => {
    let active = true;

    loadOrderTracker().then((tracker) => {
      if (!active) return;

      const occurrences = new Map<string, number>();
      for (const product of products) {
        const data = {
          sku: product.sku,
          correlationId: product.productId,
          title: product.productName,
          variant_id: product.variantId,
          variant: product.variantName,
          price: product.priceTimesQuantity,
          quantity: product.quantity,
          order: orderNumber,
          payment_status: paymentStatus
        };
        const key = JSON.stringify([shopId, data]);
        const count = (occurrences.get(key) ?? 0) + 1;
        occurrences.set(key, count);

        // Keep identical rows within the same order, but don't replay them on a rerender.
        if (count > (dispatchedLines.get(key) ?? 0)) {
          tracker.event('widget_order_track', shopId, data);
          dispatchedLines.set(key, count);
        }
      }
    }).catch((error) => {
      if (active) console.error('Faslet order tracking failed', error);
    });

    return () => { active = false; };
  }, [shopId, orderNumber, paymentStatus, products]);
};
