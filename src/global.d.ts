interface Window {
  _faslet?: {
    id: string // The product identifier
    sku: string // The product SKU if it exists
    shopUrl: string
    addToCart?: (variantId: string) => Promise<unknown>
    onButtonShow?: () => unknown
    onButtonHidden?: () => unknown
    openWidget?: () => unknown
    onResult?: ({ label: string }, resultType: 'auto' | 'result-screen') => unknown
    onColorSelected?: (colorId: string) => unknown
    selectColor?: (colorId: string) => unknown
    variants: {
      size: string
      color?: string
      id: string
      available: boolean
      sku: string
      price?: number
      imageUrl?: string
    }[]
    colors?: {
      id: string
      name: string
    }[]
    onDataChanged?: (userData: {
      userId: string
      widgetVersion?: string
      seenExperiments?: string
      experimentVariants?: string
      profile?: unknown
    }) => unknown
  }
  _faslet_orders?: {
    configure: () => unknown
    event: (name: string, shopId: string, eventData: unknown) => unknown
  }
}
