// @vitest-environment jsdom

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
    const xml = '<driver  id="83181" member="0" center="70" num="1" name="SCARMOR" nat="" color="#1ADB23">'
      + '<inf type="class" title="Catégorie" value="ROOKIE"/>'
      + '<driver  id="83525" member="0" num="1" name="FLORENT" nat="" color="#000000"/>'
      + '<driver  id="83526" member="0" num="2" name="FLORIAN" nat="" color="#000000"/>'
      + '<driver  id="83527" member="0" num="3" name="PIERRE" nat="" color="#000000"/>'
      + '<driver  id="83528" member="0" num="4" name="CLEMENT" nat="" color="#000000"/>'
      + '<driver  id="83529" member="0" num="5" name="THOMAS" nat="" color="#000000"/>'
      + '<driver  id="83530" member="0" num="6" name="YANN" nat="" color="#000000"/>'
      + '<driver  id="83531" member="0" num="7" name="ARNAUD" nat="" color="#000000" current="1"/>'
      + '<driver  id="83532" member="0" num="8" name="ALEXANDRE" nat="" color="#000000"/>'
      + '<driver  id="83533" member="0" num="9" name="ERLE" nat="" color="#000000"/>'
      + '</driver>';
    const result = parseInfLine(`D83181.INF#${xml}`);
    expect(result.type).toBe('INF');
    expect(result.xml).toBe(xml);
    expect(result.teamId).toBe('83181');
    expect(result.teamName).toBe('SCARMOR');
    expect(result.category).toBe('ROOKIE');
    expect(result.pilots).toEqual([
      { id: '83181', name: 'SCARMOR' },
      { id: '83525', name: 'FLORENT' },
      { id: '83526', name: 'FLORIAN' },
      { id: '83527', name: 'PIERRE' },
      { id: '83528', name: 'CLEMENT' },
      { id: '83529', name: 'THOMAS' },
      { id: '83530', name: 'YANN' },
      { id: '83531', name: 'ARNAUD' },
      { id: '83532', name: 'ALEXANDRE' },
      { id: '83533', name: 'ERLE' }
    ]);
  });

  it('readLapsFile unknown', async () => {
    const result = await readLapsFile('test.laps');
    expect(result[3]).toEqual({ type: 'UNKNOWN', raw: 'D12345.UNKNOWN#something' });
  });
});
