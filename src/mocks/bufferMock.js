import { Buffer as BufferClass } from 'buffer/';

export { BufferClass as Buffer };
export const SlowBuffer = BufferClass;
export const INSPECT_MAX_BYTES = 50;
export const kMaxLength = 2147483647;

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = BufferClass;
}
if (typeof globalThis !== 'undefined' && !globalThis.Buffer) {
  globalThis.Buffer = BufferClass;
}

export default {
  Buffer: BufferClass,
  SlowBuffer: BufferClass,
  INSPECT_MAX_BYTES: 50,
  kMaxLength: 2147483647
};
