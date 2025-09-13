// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { getLapsFilesList, getAllLapsDataIndexed } from './laps_files';

describe('getLapsFilesList', () => {
  beforeEach(() => {
    const mockFiles = ['D10001.laps', 'D10002.laps'];
    const mockLapsContent: Record<string, string> = {
      'D10001.laps': [
        'D10001.INF#<driver id="10001" name="TEAM1"><inf type="class" value="GT3"/><driver id="1" name="Alice"/><driver id="2" name="Bob"/></driver>',
        'D10001.L1#|||123',
        'D10001.P1#1|1|100|200|10|20|2|1|30'
      ].join('\n'),
      'D10002.laps': [
        'D10002.INF#<driver id="10002" name="TEAM2"><inf type="class" value="GT4"/><driver id="3" name="Charlie"/><driver id="4" name="Dana"/></driver>',
        'D10002.L1#|||456',
        'D10002.P1#1|2|300|400|20|30|3|3|40'
      ].join('\n')
    };
  (globalThis as unknown as { fetch: typeof fetch }).fetch = async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.endsWith('laps_files.json')) {
        return { ok: true, json: async () => mockFiles } as Response;
      }
      const file = mockFiles.find(f => url.endsWith(f));
      if (file) {
        return { ok: true, text: async () => mockLapsContent[file] } as Response;
      }
      return { ok: false } as Response;
    };
  });

  it('parse laps_files.json', async () => {
    const result = await getLapsFilesList();
    expect(result).toEqual(['D10001.laps', 'D10002.laps']);
  });

  it('getAllLapsDataIndexed indexe toutes les données par équipe et type', async () => {
    const data = await getAllLapsDataIndexed();
    expect(Object.keys(data)).toEqual(['10001', '10002']);
    expect(data['10001'].INF?.teamName).toBe('TEAM1');
    expect(data['10001'].INF?.category).toBe('GT3');
    expect(data['10001'].L.length).toBe(1);
    expect(data['10001'].P.length).toBe(1);
    expect(data['10002'].INF?.teamName).toBe('TEAM2');
    expect(data['10002'].INF?.category).toBe('GT4');
    expect(data['10002'].L.length).toBe(1);
    expect(data['10002'].P.length).toBe(1);
  });
});
