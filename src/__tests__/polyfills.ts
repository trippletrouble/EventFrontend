// Polyfill TextEncoder and TextDecoder which are missing in JSDOM
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Polyfill web streams which are missing in JSDOM
import { ReadableStream, WritableStream, TransformStream } from 'stream/web';
// @ts-expect-error - Stream types
global.ReadableStream = ReadableStream;
// @ts-expect-error - Stream types
global.WritableStream = WritableStream;
// @ts-expect-error - Stream types
global.TransformStream = TransformStream;

// Polyfill BroadcastChannel which is missing in JSDOM
import { BroadcastChannel } from 'worker_threads';
// @ts-expect-error - BroadcastChannel type
global.BroadcastChannel = BroadcastChannel;

// Polyfill fetch, Headers, Request, Response for MSW in JSDOM
import fetch, { Headers, Request, Response } from 'node-fetch';
// @ts-expect-error - fetch type mismatch
global.fetch = fetch;
// @ts-expect-error - Headers type mismatch
global.Headers = Headers;
// @ts-expect-error - Request type mismatch
global.Request = Request;
// @ts-expect-error - Response type mismatch
global.Response = Response;

// Polyfill PointerEvent and Pointer Capture APIs for Radix UI under JSDOM
if (typeof window !== 'undefined') {
  if (!window.PointerEvent) {
    // @ts-expect-error - mock PointerEvent
    window.PointerEvent = class PointerEvent extends MouseEvent {};
  }
  if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = () => false;
  }
  if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = () => {};
  }
  if (!HTMLElement.prototype.releasePointerCapture) {
    HTMLElement.prototype.releasePointerCapture = () => {};
  }
  if (!HTMLElement.prototype.scrollIntoView) {
    HTMLElement.prototype.scrollIntoView = () => {};
  }
  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}

