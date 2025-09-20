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
          'D12345.P1#1|100|200|300|400|500|600|700|800|900',
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

  describe('parseLapLine', () => {
    it('parse un tour normal', () => {
        const line = 'D83223.L1095#|||74298';
        expect(parseLapLine(line)).toEqual({
            type: 'L',
            teamId: '83223',
            inter1: '',
            inter2: '',
            inter3: '',
            lapNum: '1095',
            lapType: undefined,
            lapTime: '74298',
            flags: { pitStop: false, bestTeamLap: false, bestGlobalLap: false }
        });
    });
    it('parse un tour avec temps intermédiaires', () => {
        const line = 'D83223.L1095#1251|2565|5481|74298';
        expect(parseLapLine(line)).toEqual({
            type: 'L',
            teamId: '83223',
            inter1: '1251',
            inter2: '2565',
            inter3: '5481',
            lapNum: '1095',
            lapType: undefined,
            lapTime: '74298',
            flags: { pitStop: false, bestTeamLap: false, bestGlobalLap: false }
        });
    });
    it('parse un tour avec pit stop', () => {
        const line = 'D83223.L1089#|||b87593';
        expect(parseLapLine(line)).toEqual({
            type: 'L',
            teamId: '83223',
            inter1: '',
            inter2: '',
            inter3: '',
            lapNum: '1089',
            lapType: 'b',
            lapTime: '87593',
            flags: { pitStop: true, bestTeamLap: false, bestGlobalLap: false }
        });
    });
    it('parse un meilleur tour équipe', () => {
        const line = 'D83223.L1088#|||g74649';
        expect(parseLapLine(line)).toEqual({
            type: 'L',
            teamId: '83223',
            inter1: '',
            inter2: '',
            inter3: '',
            lapNum: '1088',
            lapType: 'g',
            lapTime: '74649',
            flags: { pitStop: false, bestTeamLap: true, bestGlobalLap: false }
        });
    });
    it('parse un meilleur tour global', () => {
        const line = 'D83223.L1087#|||p74000';
        expect(parseLapLine(line)).toEqual({
            type: 'L',
            teamId: '83223',
            inter1: '',
            inter2: '',
            inter3: '',
            lapNum: '1087',
            lapType: 'p',
            lapTime: '74000',
            flags: { pitStop: false, bestTeamLap: false, bestGlobalLap: true }
        });
    });
  });

  describe('parsePitLine', () => {
    it('parse une ligne pit stop', () => {
        const line = 'D83223.P02#2|71|5385563|5477940|92377|2655404|36|83813|2655404';
        expect(parsePitLine(line)).toEqual({
            type: 'P',
            teamId: '83223',
            lineNum: '02',
            pitNum: '2',
            lapNum: '71',
            raceTimeBefore: '5385563',
            raceTimeAfter: '5477940',
            pitDuration: '92377',
            driverDuration: '2655404',
            nbLapSinceLast: '36',
            idDriver: '83813',
            totalDriverDuration: '2655404'
        });
    });
  });

  describe('parseInfLine', () => {
    it('parse une ligne INF', () => {
        const line = `D83223.INF#<driver  id="83223" member="0" center="70" num="561" name="INTERMARCHE TEAM RTB56" nat="" color="#0000FF">
    <inf type="class" title="Catégorie" value="AM"/>
    <driver  id="83813" member="0" num="1" name="DANIEL" nat="" color="#000000" current="1"/>
    <driver  id="83814" member="0" num="2" name="PHILIPPE" nat="" color="#000000"/>
    <driver  id="83815" member="0" num="3" name="GILLES" nat="" color="#000000"/>
    <driver  id="83816" member="0" num="4" name="CEDRIC" nat="" color="#000000"/>
    <driver  id="83817" member="0" num="5" name="OLIVIER" nat="" color="#000000"/>
    <driver  id="83818" member="0" num="6" name="THOMAS" nat="" color="#000000"/>
    <driver  id="83819" member="0" num="7" name="DENIS" nat="" color="#000000"/>
</driver>`;
        expect(parseInfLine(line)).toEqual({
            type: 'INF',
            teamId: '83223',
            teamName: 'INTERMARCHE TEAM RTB56',
            category: 'AM',
            pilots: [
                { id: '83813', name: 'DANIEL' },
                { id: '83814', name: 'PHILIPPE' },
                { id: '83815', name: 'GILLES' },
                { id: '83816', name: 'CEDRIC' },
                { id: '83817', name: 'OLIVIER' },
                { id: '83818', name: 'THOMAS' },
                { id: '83819', name: 'DENIS' }
            ]
        });
    });
  });

  it('readLapsFile unknown', async () => {
    const result = await readLapsFile('test.laps');
    expect(result[3]).toEqual({ type: 'UNKNOWN', raw: 'D12345.UNKNOWN#something' });
  });
});
