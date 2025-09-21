// import { readLapsFile } from './parsers';

const LAP_DIR_PATH = './data/laps'
const LAPS_FILE_PATH = `${LAP_DIR_PATH}/laps_files.json`

/**
 * Lit tous les fichiers .laps listés dans laps_files.json,
 * parse chaque ligne et indexe les données par type et par équipe.
 * Retourne une structure : { [teamId]: { L: [], P: [], INF: {} } }
 */
/*
export async function getAllLapsDataIndexed(): Promise<LapsDataIndex> {
  const files = await getLapsFilesList();
  const index: LapsDataIndex = {};
  for (const file of files) {
    const lines = await readLapsFile(file);
    for (const line of lines) {
      let teamId: string | undefined;
      if (line.type === 'INF') {
        const inf = line as InfLine;
        teamId = inf.teamId;
        if (!teamId) continue;
        if (!index[teamId]) index[teamId] = { L: [], P: [], INF: undefined };
        index[teamId].INF = inf;
      } else if (line.type === 'L') {
        const lap = line as LapLine;
        teamId = lap.teamId;
        if (!teamId) continue;
        if (!index[teamId]) index[teamId] = { L: [], P: [], INF: undefined };
        index[teamId].L.push(lap);
      } else if (line.type === 'P') {
        const pit = line as PitLine;
        teamId = pit.teamId;
        if (!teamId) continue;
        if (!index[teamId]) index[teamId] = { L: [], P: [], INF: undefined };
        index[teamId].P.push(pit);
      }
    }
  }
  return index;
}

export type LapLine = {
  type: 'L';
  teamId: string;
  id: string;
  value: string;
  raw?: string;
};
export type PitLine = {
  type: 'P';
  teamId: string;
  lineNum: string;
  pitNum: string;
  lapNum: string;
  raceTimeBefore: string;
  raceTimeAfter: string;
  pitDuration: string;
  driverDuration: string;
  nbLapSinceLast: string;
  idDriver: string;
  totalDriverDuration: string;
  raw?: string;
};
export type InfLine = {
  type: 'INF';
  xml: string;
  teamId?: string;
  teamName?: string;
  category?: string;
  pilots: { id: string; name: string }[];
  raw?: string;
};

export type LapsDataIndex = {
  [teamId: string]: {
    L: LapLine[];
    P: PitLine[];
    INF?: InfLine;
  };
};
*/

/**
 * Parse le fichier laps_files.json et retourne la liste des fichiers .laps
 */
export async function getLapsFilesList(): Promise<string[]> {
  const response = await fetch(LAPS_FILE_PATH);
  if (!response.ok) throw new Error('Fichier laps_files.json non trouvé');
  return await response.json();
}
