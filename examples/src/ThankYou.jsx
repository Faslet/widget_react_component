import React from "react";
import {useFasletOrderTracking} from "@faslet/react-widget";

export function ThankYou() {
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


    useFasletOrderTracking("Faslet Demo", "Order-1", "paid", productsInOrder)

    return <>
        <div className="column">
            <h2>Thank you</h2>
            <p>Your order has been received!</p>

            <img className="main-image" src="https://placekitten.com/600/400" alt="main"/>
        </div>
    </>
}