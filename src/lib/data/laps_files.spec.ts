import { describe, it, expect, beforeEach } from 'vitest';
import { getLapsFilesList } from './laps_files';

describe('getLapsFilesList', () => {
  beforeEach(() => {
    (globalThis as { fetch: typeof fetch }).fetch = async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      let json: string[] = [];
      if (url.endsWith('laps_files.json')) {
        json = ['D83181.laps', 'D83182.laps', 'D83183.laps'];
      }
      return {
        ok: true,
        json: async () => json
      } as Response;
    };
  });

  it('parse laps_files.json', async () => {
    const result = await getLapsFilesList();
    expect(result).toEqual(['D83181.laps', 'D83182.laps', 'D83183.laps']);
  });
});
