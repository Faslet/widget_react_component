import React, { useEffect } from 'react';

export interface Color {
  id: string;
  name: string;
}

export interface Variant {
  variantId: string;
  sizeLabel: string;
  inStock: boolean;
  sku: string;
  colorId: string;
}

export interface FasletWidgetProps {
  shopId: string;
  brandId: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  fasletTag?: string;
  locale?: string;
  variants: Variant[];
  colors?: Color[];
  shopPageUrl?: string;
  onAddToCart?: (id: string) => Promise<unknown>;
}

export function FasletWidget({
  shopId,
  brandId,
  fasletTag,
  productId,
  productName,
  productImageUrl,
  locale,
  variants,
  colors,
  onAddToCart,
  shopPageUrl
}: FasletWidgetProps) {
  // Add script tag to head
  useEffect(() => {
    const existing = document.querySelector('script#faslet-script-tag');
    // Don't add twice
    if (existing) {
      return;
    }
    const root =
      document.getElementsByTagName('script')[0] ?? document.head.lastChild;

    const faslet = document.createElement('script');
    faslet.type = 'text/javascript';
    faslet.id = 'faslet-script-tag';
    faslet.src = 'https://widget.prod.faslet.net/faslet-app.min.js';
    faslet.defer = true;
    if (root) {
      root.parentNode.insertBefore(faslet, root);
    } else {
      document.head.appendChild(faslet);
    }
  }, []);

  window._faslet = {
    ...window._faslet,
    id: productId,
    variants: variants.map((variant) => ({
      size: variant.sizeLabel,
      sku: variant.sku,
      id: variant.variantId,
      available: variant.inStock,
      color: variant.colorId
    })),
    colors,
    shopUrl: shopPageUrl,
    addToCart: onAddToCart
  };

  return (
    <faslet-app
      shop-id={shopId}
      platform="unknown"
      product-name={productName}
      categories={fasletTag}
      brand={brandId}
      product-img={productImageUrl}
      locale={locale}
    />
  );
}
