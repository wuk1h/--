import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe('public asset deployment paths', () => {
  it('keeps local assets at the root for local builds', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
    const { assetPath } = await import('./asset-path');
    expect(assetPath('/archive/test.webp')).toBe('/archive/test.webp');
  });

  it('prefixes project Pages assets exactly once', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/--/');
    const { assetPath } = await import('./asset-path');
    expect(assetPath('/archive/test.webp')).toBe('/--/archive/test.webp');
    expect(assetPath('/--/archive/test.webp')).toBe('/--/archive/test.webp');
    for (const external of ['https://example.com/a.webp', '//example.com/a.webp', 'data:image/png;base64,AAAA']) {
      expect(assetPath(external)).toBe(external);
    }
  });
});
