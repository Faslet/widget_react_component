import React, { useEffect } from 'react'

export interface Color {
  id: string
  name: string
}

export interface Variant {
  variantId: string
  sizeLabel: string
  inStock: boolean
  sku: string
  colorId: string
  price?: number
  imageUrl?: string
}

export interface FasletWidgetProps {
  shopId: string
  brandId: string
  productId: string
  productName: string
  productImageUrl: string
  fasletTag?: string
  locale?: string
  disableProductRecommendations?: boolean
  variants: Variant[]
  colors?: Color[]
  shopPageUrl?: string
  onAddToCart?: (id: string) => Promise<unknown>
  onResult?: ({ label }: { label: string }, resultType: 'auto' | 'result-screen') => unknown
  onDataChanged?: (userData: {
    userId: string
    widgetVersion?: string
    seenExperiments?: string
    experimentVariants?: string
    profile?: unknown
  }) => unknown
  userId?: string
  onButtonShow?: () => unknown
  onButtonHidden?: () => unknown
}

export function FasletWidget({
  shopId,
  brandId,
  fasletTag,
  productId,
  productName,
  productImageUrl,
  locale,
  disableProductRecommendations,
  variants,
  colors,
  onAddToCart,
  shopPageUrl,
  onResult,
  onDataChanged,
  userId,
  onButtonShow,
  onButtonHidden,
}: FasletWidgetProps) {
  // Add script tag to head
  useEffect(() => {
    const existing = document.querySelector('script#faslet-script-tag')
    // Don't add twice
    if (existing) {
      return
    }
    const root = document.getElementsByTagName('script')[0] ?? document.head.lastChild

    const faslet = document.createElement('script')
    faslet.type = 'text/javascript'
    faslet.id = 'faslet-script-tag'
    faslet.src = 'https://widget.prod.faslet.net/faslet-app.min.js'
    faslet.defer = true
    if (root) {
      root.parentNode.insertBefore(faslet, root)
    } else {
      document.head.appendChild(faslet)
    }
  }, [])

  window._faslet = {
    ...window._faslet,
    id: productId,
    variants: variants.map(variant => ({
      size: variant.sizeLabel,
      sku: variant.sku,
      id: variant.variantId,
      available: variant.inStock,
      color: variant.colorId,
      price: variant.price,
      imageUrl: variant.imageUrl,
    })),
    colors,
    shopUrl: shopPageUrl,
    addToCart: onAddToCart,
    onResult,
    onDataChanged,
    onButtonShow,
    onButtonHidden,
  }

  const extraAttributes: Record<string, any> = {}

  if (disableProductRecommendations) {
    extraAttributes['disable-product-recommendations'] = true
  }

  if (userId) {
    extraAttributes['user-id'] = userId
  }

  return (
    <faslet-app
      shop-id={shopId}
      platform="unknown"
      product-name={productName}
      categories={fasletTag}
      brand={brandId}
      product-img={productImageUrl}
      locale={locale}
      {...extraAttributes}
    />
  )
}
