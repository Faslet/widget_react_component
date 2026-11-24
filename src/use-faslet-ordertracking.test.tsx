import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import type { Product, useFasletOrderTracking } from './use-faslet-ordertracking';

const product: Product = {
  productId: 'product', variantId: 'variant', productName: 'Jacket',
  variantName: 'Blue', sku: 'SKU', priceTimesQuantity: 30, quantity: 1
};
const products = [product];
const event = jest.fn();
const configure = jest.fn();
const script = () => document.querySelector<HTMLScriptElement>('#faslet-order-tracking-tag')!;
let root: HTMLDivElement;
let useOrderTracking: typeof useFasletOrderTracking;

function Tracker({ order, lines = products, shop = 'shop', status = 'paid' }: {
  order: string; lines?: Product[]; shop?: string; status?: string;
}) {
  useOrderTracking(shop, order, status, lines);
  return null;
}

async function mount(node: React.ReactElement) {
  await act(async () => { render(node, root); });
}

function unmount() {
  act(() => { unmountComponentAtNode(root); });
}

async function finishLoad() {
  window._faslet_orders = { configure, event };
  await act(async () => { script().dispatchEvent(new Event('load')); });
}

function sentOrders() {
  return event.mock.calls.map(([, , data]) => data.order);
}

beforeEach(() => {
  // Each test starts with a fresh page-level loader and dispatch history.
  jest.resetModules();
  jest.doMock('react', () => React);
  useOrderTracking = require('./use-faslet-ordertracking').useFasletOrderTracking;
  root = document.createElement('div');
  document.body.appendChild(root);
  jest.clearAllMocks();
});

afterEach(() => {
  unmount();
  root.remove();
  script()?.remove();
  document.getElementById('faslet-gtm-tag')?.remove();
  delete window._faslet_orders;
});

test('dispatches a new order after remounting with an already-loaded script', async () => {
  await mount(<Tracker order="A" />);
  const originalScript = script();
  await finishLoad();
  unmount();
  await mount(<Tracker order="B" />);

  expect(sentOrders()).toEqual(['A', 'B']);
  expect(script()).toBe(originalScript);
  expect(configure).toHaveBeenCalledTimes(1);
});

test('dispatches only the active order when remounted during loading', async () => {
  await mount(<Tracker order="A" />);
  unmount();
  await mount(<Tracker order="B" />);
  await finishLoad();

  expect(sentOrders()).toEqual(['B']);
});

test('does not re-dispatch identical order lines on rerender or remount', async () => {
  await mount(<Tracker order="A" />);
  await finishLoad();
  await mount(<Tracker order="A" lines={[{ ...product }]} />);
  unmount();
  await mount(<Tracker order="A" />);

  expect(sentOrders()).toEqual(['A']);
});

test('shares one script across concurrent consumers without duplicating an order', async () => {
  await mount(<><Tracker order="A" /><Tracker order="A" /><Tracker order="B" /></>);
  await finishLoad();

  expect(sentOrders()).toEqual(['A', 'B']);
  expect(configure).toHaveBeenCalledTimes(1);
  expect(document.querySelectorAll('#faslet-order-tracking-tag')).toHaveLength(1);
  expect(document.querySelectorAll('#faslet-gtm-tag, script[src*="googletagmanager.com"]')).toHaveLength(0);
});

test('dispatches an additional identical row without replaying the first row', async () => {
  await mount(<Tracker order="A" />);
  await finishLoad();
  await mount(<Tracker order="A" lines={[product, { ...product }]} />);
  await mount(<Tracker order="A" lines={[{ ...product }, product]} />);

  expect(sentOrders()).toEqual(['A', 'A']);
});

test('uses the latest shop and payment status as part of the dispatch identity', async () => {
  await mount(<Tracker order="A" status="pending" />);
  await finishLoad();
  await mount(<Tracker order="A" status="paid" />);
  await mount(<Tracker order="A" status="paid" shop="other-shop" />);

  expect(event.mock.calls.map(([, shop, data]) => [shop, data.payment_status])).toEqual([
    ['shop', 'pending'], ['shop', 'paid'], ['other-shop', 'paid']
  ]);
});

test.each([false, true])('retries a failed script on remount (existing tag: %s)', async (existing) => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    if (existing) {
      const tag = document.createElement('script');
      tag.id = 'faslet-order-tracking-tag';
      document.head.appendChild(tag);
    }
    await mount(<Tracker order="A" />);
    const failedScript = script();
    await act(async () => { failedScript.dispatchEvent(new Event('error')); });
    expect(log).toHaveBeenCalledTimes(1);
    expect(event).not.toHaveBeenCalled();
    unmount();
    await mount(<Tracker order="B" />);
    expect(script()).not.toBe(failedScript);
    await finishLoad();

    expect(sentOrders()).toEqual(['B']);
    expect(document.querySelectorAll('#faslet-gtm-tag, script[src*="googletagmanager.com"]')).toHaveLength(0);
  } finally {
    log.mockRestore();
  }
});

test('recovers on remount when an existing script failed before the hook mounted', async () => {
  jest.useFakeTimers();
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const failedScript = document.createElement('script');
    failedScript.id = 'faslet-order-tracking-tag';
    document.head.appendChild(failedScript);
    failedScript.dispatchEvent(new Event('error'));
    await mount(<Tracker order="A" />);
    await act(async () => { jest.runOnlyPendingTimers(); });
    expect(script()).toBeNull();
    expect(event).not.toHaveBeenCalled();
    unmount();
    await mount(<Tracker order="B" />);
    await finishLoad();
    expect(sentOrders()).toEqual(['B']);
  } finally {
    log.mockRestore();
    jest.useRealTimers();
  }
});

test('retries configuration before dispatching after initialization fails', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    configure.mockImplementationOnce(() => { throw new Error('Configuration failed'); });
    await mount(<Tracker order="A" />);
    await finishLoad();
    expect(event).not.toHaveBeenCalled();
    unmount();
    await mount(<Tracker order="B" />);

    expect(configure).toHaveBeenCalledTimes(2);
    expect(sentOrders()).toEqual(['B']);
  } finally {
    log.mockRestore();
  }
});
