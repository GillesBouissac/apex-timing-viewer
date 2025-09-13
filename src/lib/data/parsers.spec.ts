
import { describe, it, expect, beforeEach } from 'vitest';
import { readLapsFile, parseLapLine, parsePitLine, parseInfLine } from './parsers';

describe('parsers', () => {
  beforeEach(() => {
    // Mock fetch for unit test
    (globalThis as { fetch: typeof fetch }).fetch = async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      let text = '';
      if (url.endsWith('test.laps')) {
        text = [
          'D12345.L100#|||55555',
          'D12345.P1#1|100|200|300|400',
          'D12345.INF#<driver id="12345" name="TEST"/>',
          'D12345.UNKNOWN#something',
        ].join('\n');
      }
      return {
        ok: true,
        text: async () => text
      } as Response;
    };
  });

  it('parseLapLine .L', () => {
    expect(parseLapLine('D12345.L100#|||55555')).toEqual({ type: 'L', id: '100', value: '55555' });
  });

  it('parsePitLine .P', () => {
    expect(parsePitLine('D83223.P34#34|1117|86516941|2076767|29|83813|12731449|1|123456')).toEqual({
      type: 'P',
      lineNum: '34',
      pitNum: '34',
      lapNum: '1117',
      raceTimeBefore: '86516941',
      raceTimeAfter: '2076767',
      pitDuration: '29',
      driverDuration: '83813',
      nbLapSinceLast: '12731449',
      idDriver: '1',
      totalDriverDuration: '123456'
    });
  });

  it('parseInfLine .INF', () => {
    expect(parseInfLine('D12345.INF#<driver id="12345" name="TEST"/>')).toEqual({ type: 'INF', xml: '<driver id="12345" name="TEST"/>' });
  });

  it('readLapsFile unknown', async () => {
    const result = await readLapsFile('test.laps');
    expect(result[3]).toEqual({ type: 'UNKNOWN', raw: 'D12345.UNKNOWN#something' });
  });
});
