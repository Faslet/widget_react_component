import { useEffect, useState } from 'react';

export interface Product {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  priceTimesQuantity: number;
  quantity: number;
  sku: string;
}

export const useFasletOrderTracking = (
  shopId: string,
  orderNumber: string,
  paymentStatus: string,
  products: Product[]
) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existing = document.querySelector('script#faslet-order-tracking-tag');
    // Don't add twice
    if (!existing) {
      const root =
        document.getElementsByTagName('script')[0] ?? document.head.lastChild;

      const faslet = document.createElement('script');
      faslet.type = 'text/javascript';
      faslet.id = 'faslet-order-tracking-tag';
      faslet.src = 'https://widget.prod.faslet.net/faslet-orders.js';
      if (root) {
        root.parentNode.insertBefore(faslet, root);
      } else {
        document.head.appendChild(faslet);
      }

      const gtm = document.createElement('script');
      gtm.type = 'text/javascript';
      gtm.id = 'faslet-gtm-tag';
      gtm.src = 'https://www.googletagmanager.com/gtag/js?id=G-6J8TML143D';
      gtm.defer = true;
      if (root) {
        root.parentNode.insertBefore(gtm, root);
      } else {
        document.head.appendChild(gtm);
      }

      faslet.onload = () => {
        window._faslet_orders.configure();
        setLoaded(true);
      };
    }

    if (loaded) {
      products.forEach((product) => {
        window._faslet_orders?.event('widget_order_track', shopId, {
          sku: product.sku,
          correlationId: product.productId,
          title: product.productName,
          variant_id: product.variantId,
          variant: product.variantName,
          price: product.priceTimesQuantity,
          quantity: product.quantity,
          order: orderNumber,
          payment_status: paymentStatus
        });
      });
    }
  }, [shopId, orderNumber, products, loaded]);
};
