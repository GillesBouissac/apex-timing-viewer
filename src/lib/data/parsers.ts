const LAP_DIR_PATH = './data/laps'

export interface LapData {
    type?: string;
    teamId?: string;
    driverId?: string;
    driverName?: string;
    lapType: string;
    lapNum: number;
    inter1?: number;
    inter2?: number;
    inter3?: number;
    lapTime: number;
    raceTime: number,
    flags: {
        pitStop: boolean;
        bestTeamLap: boolean;
        bestGlobalLap: boolean;
        normalLap: boolean;
        raceStartLap: boolean;
    }
}

export interface PitData {
    type: string,
    teamId: string,
    lineNum: number,
    pitNum: number,
    lapNum: number,
    raceTimeBefore: number,
    raceTimeAfter: number,
    pitDuration: number,
    driverDuration: number,
    nbLapSinceLast: number,
    driverId: string,
    totalDriverDuration: number
}

export interface TeamInfo {
    type: string,
    teamId: string,
    teamName: string,
    category: string,
    pilots: { [key: string]: string }
}

export class TeamData {
    laps: Array<LapData>;
    pits: Array<PitData>;
    info?: TeamInfo;
    constructor() {
        this.laps = new Array<LapData>();
        this.pits = new Array<PitData>();
        this.info = undefined;
    }
}

/**
 * Lit et parse un fichier .laps depuis le dossier static/data/laps
 * @param filename Nom du fichier (ex: D83181.laps)
 * @returns Tableau d'objets { id, value }
 */
export function parseLapLine(line: string): LapData | null {
    const lMatch = line.match(
        /^D(\d+)\.L(\d+)#(\d*)\|(\d*)\|(\d*)\|([bgp]?)(\d*)/i
    );
    if (lMatch) {
        const teamId = lMatch[1];
        const lapNum = +lMatch[2];
        const inter1 = +lMatch[3];
        const inter2 = +lMatch[4];
        const inter3 = +lMatch[5];
        const lapType = lMatch[6] || "l";
        const lapTime = +lMatch[7] || 0;
        const flags = {
            pitStop: lapType === 'b',
            bestTeamLap: lapType === 'g',
            bestGlobalLap: lapType === 'p',
            normalLap: lapType === 'l',
            raceStartLap: lapTime === 0
        };
        return {
            type: 'L',
            teamId,
            lapNum,
            lapType,
            inter1,
            inter2,
            inter3,
            lapTime,
            raceTime: 0,
            flags
        };
    }
    return null;
}

/**
 * Parse une ligne .P du fichier .laps
 * @param line Ligne du fichier
 * @returns Objet structuré ou raw si non conforme
 */
export function parsePitLine(line: string): PitData | null {
    const pMatch = line.match(
        /^D(\d+)\.P(\d+)#(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)/
    );
    if (pMatch) {
        return {
            type: 'P',
            teamId: pMatch[1],
            lineNum: +pMatch[2],
            pitNum: +pMatch[3],
            lapNum: +pMatch[4]+1, // Duno why there is a lap difference between pit data and lap data
            raceTimeBefore: +pMatch[5],
            raceTimeAfter: +pMatch[6],
            pitDuration: +pMatch[7],
            driverDuration: +pMatch[8],
            nbLapSinceLast: +pMatch[9],
            driverId: pMatch[10],
            totalDriverDuration: +pMatch[11]
        };
    }
    return null;
}

/**
 * Parse une ligne .INF du fichier .laps
 * @param line Ligne du fichier
 * @returns Objet structuré ou raw si non conforme
 */
export function parseInfLine(line: string): TeamInfo | null {
    const infMatch = line.match(
        /^D(\d+)\.INF#(.*)/s
    );
    if (!infMatch) return null;
    const teamId = infMatch[1];
    const xml = infMatch[2].trim();
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        const driverNode = doc.querySelector('driver');
        const teamName = driverNode?.getAttribute('name') ?? '';
        const category = driverNode?.querySelector('inf')?.getAttribute('value') ?? '';
        const pilotsArray = Array
            .from(driverNode?.querySelectorAll(':scope > driver') ?? [])
            .map(pilot => [
                pilot.getAttribute('id') ?? '',
                pilot.getAttribute('name') ?? ''
            ]);
        return {
            type: 'INF',
            teamId,
            teamName,
            category,
            pilots: Object.fromEntries(pilotsArray)
        };
    } catch {
        return null;
    }
}

/**
 * Reads a data file that concatenate L, P, INF lines
 * 
 * @param filename 
 * @returns 
 */
export async function readLapsFile(filename: string): Promise<TeamData> {
	const url = `${LAP_DIR_PATH}/${filename}`;
	const response = await fetch(url);
	if (!response.ok) throw new Error('Fichier non trouvé');
	const text = await response.text().then ( content => {
        return content
            .split('\n')
            .filter(line => line.trim().length > 0);
    });

    const teamData = new TeamData();
    text.forEach(line => {
        const typeMatch = line.match(/^D\d+\.(L|P|INF)/);
        const type = typeMatch ? typeMatch[1] : 'UNKNOWN';
        if (type === 'L') {
            const d = parseLapLine(line);
            if (d) teamData.laps.push(d);
        }
        if (type === 'P') {
            const d = parsePitLine(line);
            if (d) teamData.pits.push(d);
        };
        if (type === 'INF') {
            const d = parseInfLine(line);
            if (d) teamData.info = d;
        };
    });
    teamData.laps = teamData.laps.sort((a, b) => a.lapNum - b.lapNum);
    teamData.pits = teamData.pits.sort((a, b) => a.lapNum - b.lapNum);
    enrichLapTimes(teamData);
//    console.log(`teamData: `, teamData);

    return teamData;
}

/**
 * Associate the right driver to each recorded lap
 * 
 * @param teamData
 */
function enrichLapTimes(teamData: TeamData) {

    // Add driver informations
    teamData.pits
        .forEach( pitStop => {
            const driverId: string = pitStop.driverId || "";
            teamData.laps
                .filter(lap => lap.driverId===undefined && lap.lapNum<=pitStop.lapNum)
                .forEach (lap => {
                    lap.driverId = driverId;
                    lap.driverName = teamData.info ? teamData.info.pilots[driverId] : "";
                });
        });

    // Compute the duration of the first lap
    // There is no time record from race start to the first lap start
    // We can still use the first pit stop which contains the race duration
    const firstPitStopRaceTime = teamData.pits[0].raceTimeBefore;
    const firstPitStopLapNum = teamData.pits[0].lapNum;
    const firstPitLapCumul = teamData.laps
                                .filter(lap => lap.lapNum < firstPitStopLapNum)
                                .map(lap => lap.lapTime)
                                .reduce((a,v) => a + v, 0);

    // Compute raceTimeBefore for each lap
    let raceTime = firstPitStopRaceTime-firstPitLapCumul;
    teamData.laps[0].lapTime = raceTime;
    teamData.laps
        .forEach ( lap => {
            raceTime += lap.lapTime;
            lap.raceTime = raceTime;
        });
}

