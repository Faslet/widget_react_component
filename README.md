# Faslet Widget NPM Module

### Usage
To use this project in your own, pull down this plugin with
```bash
npm install @faslet/widget
```

#### Widget (Product page)

Example usage with shop id `Faslet Demo`
```typescript
import { createWidget } from '@faslet/widget';

const widget = createWidget('Faslet Demo')
    .withBrand('Faslet Demo Brand')
    .withProductId('product-1')
    .withProductImage('https://placekitten.com/100')
    .withProductName('Jacket')
    .withFasletProductTag('Faslet_Jacket_Male')
    .withAddToCart(myAddToCartFunction);

widget
    .addColor('red', 'Magnificent Red')
    .addColor('blue', 'Dashing Blue');

widget
    .addVariant('variant-1', 'S', true, 'sku-1', 'red')
    .addVariant('variant-2', 'S', true, 'sku-2', 'blue')
    .addVariant('variant-3', 'M', true, 'sku-3', 'red')
    .addVariant('variant-4', 'M', false, 'sku-4', 'blue')
    .addVariant('variant-5', 'L', false, 'sku-5', 'red')
    .addVariant('variant-6', 'L', false, 'sku-6', 'blue');

widget.injectScriptTag();

// Add to this Selector in your HTML
widget.addToDom('#faslet-container');
```


#### Order Tracking (After checkout/Thank You page)
Example usage with shop id `Faslet Demo`
```typescript
import { createOrderTracking } from '@faslet/widget';

const ot = createOrderTracking('Faslet Demo')
    .withOrderNumber('Order-1')
    .withPaymentStatus('paid');

ot.addProduct(
    'product-1',
    'variant-1',
    'Jacket',
    'Red Jacket/S',
    100,
    1,
    'sku-1'
).addProduct(
    'product-1',
    'variant-2',
    'Jacket',
    'Blue Jacket/S',
    200,
    2,
    'sku-2'
);

ot.buildOrderTracking();
```

### Examples

To run the examples, first make sure you have [rollup](https://rollupjs.org) installed:
```bash
npm install --global rollup
```

Then, from the examples folder:

```bash
npm install
npm run build
npx serve -l 6677 ./static
```

And then in your browser, navigate to:

http://localhost:6677/product

for the Widget example and

http://localhost:6677/thank-you

for the Order Tracking example. Note that Order tracking only sends events, which you would see in the network tab of your browser's dev-tools.


### Development

This project uses npm. First run install before starting development:

```bash
npm install
```

### Testing

This project uses Jest for testing. To run, simply run the following command:
```bash
npm run test
```
