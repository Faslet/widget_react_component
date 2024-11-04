import React from 'react'
import { FasletWidget } from '@faslet/react-widget'

export function ProductPage() {
  const addToCart = async id => {
    window.alert(`Add ${id} to cart`)
  }

  const onResult = ({ label }, resultType) => {
    console.log(`Got Result ${label} from resultType ${resultType}`)
  }

  const onOpen = productId => {
    console.log(`Widget opened for product ${productId}`)
  }

  const onClose = productId => {
    console.log(`Widget closed for product ${productId}`)
  }

  const colors = [
    { id: 'red', name: 'Magnificent Red' },
    { id: 'blue', name: 'Dashing Blue' },
  ]
  const variants = [
    {
      variantId: 'variant-1',
      sizeLabel: 'S',
      inStock: true,
      sku: 'sku-1',
      colorId: 'red',
      price: 11.99,
      imageUrl: 'https://placekitten.com/300/500',
    },
    {
      variantId: 'variant-2',
      sizeLabel: 'S',
      inStock: true,
      sku: 'sku-2',
      colorId: 'blue',
      price: 11.99,
      imageUrl: 'https://placekitten.com/300/500',
    },
    {
      variantId: 'variant-3',
      sizeLabel: 'M',
      inStock: true,
      sku: 'sku-3',
      colorId: 'red',
      price: 11.99,
      imageUrl: 'https://placekitten.com/300/500',
    },
    {
      variantId: 'variant-4',
      sizeLabel: 'M',
      inStock: false,
      sku: 'sku-4',
      colorId: 'blue',
      price: 11.99,
      imageUrl: 'https://placekitten.com/300/500',
    },
    {
      variantId: 'variant-5',
      sizeLabel: 'L',
      inStock: false,
      sku: 'sku-5',
      colorId: 'red',
      price: 11.99,
      imageUrl: 'https://placekitten.com/300/500',
    },
    {
      variantId: 'variant-6',
      sizeLabel: 'L',
      inStock: false,
      sku: 'sku-6',
      colorId: 'blue',
      price: 11.99,
      imageUrl: 'https://placekitten.com/300/500',
    },
  ]

  return (
    <>
      <h2>Faslet Jacket</h2>
      <p>The best jacket in this store</p>
      <div className="row">
        <div className="images column">
          <img className="main-image" src="https://placekitten.com/400/500" alt="main" />
          <div className="row">
            <img className="small-image" src="https://placekitten.com/90/120?1" alt="secondary" />
            <img className="small-image" src="https://placekitten.com/90/120?2" alt="secondary" />
            <img className="small-image" src="https://placekitten.com/90/120?3" alt="secondary" />
          </div>
        </div>
        <div className="gap"></div>
        <div className="column">
          <p>Some text about this great jacket. This is definitely the best jacket in this store!</p>
          <div className="gap"></div>
          <div className="row">
            <p className="label">Size: </p>
            <div className="gap"></div>
            <select className="flex-auto">
              <option>S</option>
              <option>M</option>
              <option>L</option>
            </select>
          </div>
          <div className="gap"></div>
          <div className="row">
            <p className="label">Color: </p>
            <div className="gap"></div>
            <select className="flex-auto">
              <option>Magnificent Red</option>
              <option>Dashing Blue</option>
            </select>
          </div>
          <div className="gap"></div>
          <div className="row">
            <div className="flex-auto row">
              <p className="vertical-center">Qty</p>
              <div className="gap"></div>
              <input type="number" value="1"></input>
            </div>
            <div id="faslet-container">
              <FasletWidget
                productId="product-1"
                shopId="Faslet Demo"
                brandId="Faslet Demo Brand"
                productImageUrl="https://placekitten.com/100/150"
                productName="Jacket"
                colors={colors}
                variants={variants}
                onAddToCart={addToCart}
                onResult={onResult}
                onOpen={onOpen}
                onClose={onClose}
              />
            </div>
          </div>
          <div className="gap"></div>
          <button className="add-to-cart">Dummy Add to Cart</button>
        </div>
      </div>
    </>
  )
}
