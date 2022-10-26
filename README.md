# Faslet React Widget

### Usage
To use this component in your app, pull down this component with
```bash
npm install @faslet/react-widget
```

#### Widget (Product page)

Example usage with shop id `Faslet Demo`
```jsx
import { FasletWidget } from '@faslet/react-widget';

function ExampleProductPage() {

    // Get the product variants and colors
    const colors = [{ id: 'red', name: 'Magnificent Red'},{ id: 'blue', name: 'Dashing Blue'}];
    const variants = [
        {variantId: 'variant-1', sizeLabel: 'S', inStock: true, sku: 'sku-1', colorId: 'red', price: 11.99, imageUrl: 'https://placekitten.com/300/500' },
        {variantId: 'variant-2', sizeLabel: 'S', inStock: true, sku: 'sku-2', colorId: 'blue', price: 11.99, imageUrl: 'https://placekitten.com/300/500' },
        {variantId: 'variant-3', sizeLabel: 'M', inStock: true, sku: 'sku-3', colorId: 'red', price: 11.99, imageUrl: 'https://placekitten.com/300/500' },
        {variantId: 'variant-4', sizeLabel: 'M', inStock: false, sku: 'sku-4', colorId: 'blue', price: 11.99, imageUrl: 'https://placekitten.com/300/500' },
        {variantId: 'variant-5', sizeLabel: 'L', inStock: false, sku: 'sku-5', colorId: 'red', price: 11.99, imageUrl: 'https://placekitten.com/300/500' },
        {variantId: 'variant-6', sizeLabel: 'L', inStock: false, sku: 'sku-6', colorId: 'blue', price: 11.99, imageUrl: 'https://placekitten.com/300/500' }
    ];
    
    // Render the widget
    return  (
        <>
            <FasletWidget
                productId="product-1"
                shopId="Faslet Demo"
                brandId="Faslet Demo Brand"
                productImageUrl="https://placekitten.com/100/150"
                productName="Jacket"
                colors={colors}
                variants={variants}
                onAddToCart={addToCart}
                onResult={handleResult}
            />
        </>
    );
}


```


#### Order Tracking (After checkout/Thank You page)
Example usage with shop id `Faslet Demo`
```jsx
import { useFasletOrderTracking } from '@faslet/react-widget';

export function ExampleThankYouPage() {
    const productsInOrder = [
        {
            productId: 'product-1',
            variantId: 'variant-1',
            productName: 'Jacket',
            variantName: 'Red Jacket/S',
            priceTimesQuantity: 100,
            quantity: 1,
            sku: 'sku-1'
        }, {
            productId: 'product-1',
            variantId: 'variant-2',
            productName: 'Jacket',
            variantName: 'Blue Jacket/S',
            priceTimesQuantity: 200,
            quantity: 2,
            sku: 'sku-2'
        }
    ];

    useFasletOrderTracking('Faslet Demo', 'Order-1', 'paid', productsInOrder)

    return (<p>Thank you for your order!</p>);
}
```

### Examples

The examples are built with Create-React-App. 
From the examples folder:

```bash
npm install
npm start
```

And then in your browser, navigate to:

http://localhost:3000/

for the Widget example and

http://localhost:3000/thank-you

for the Order Tracking example. Note that Order tracking only sends events, which you would see in the network tab of your browser's dev-tools.


### Development

This project uses npm. First run install before starting development:

```bash
npm install
```
