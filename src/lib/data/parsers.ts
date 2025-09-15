import { resolve } from '$app/paths';

const LAP_DIR_PATH = './data/laps'

/**
 * Lit et parse un fichier .laps depuis le dossier static/data/laps
 * @param filename Nom du fichier (ex: D83181.laps)
 * @returns Tableau d'objets { id, value }
 */
export function parseLapLine(line: string) {
    const lMatch = line.match(/^D(\d+)\.L(\d+)#\|\|\|([bgp]?)(\d+)$/i);
    console.log(`(${line})`);
    console.log(lMatch);
    if (lMatch) {
        const teamId = lMatch[1];
        const lapNum = lMatch[2];
        const lapType = lMatch[3] || undefined;
        const lapTime = lMatch[4];
        const flags = {
            pitStop: lapType === 'b',
            bestTeamLap: lapType === 'g',
            bestGlobalLap: lapType === 'p'
        };
        return {
            type: 'L',
            teamId,
            lapNum,
            lapType,
            lapTime,
            flags
        };
    }
    return { type: 'L', raw: line };
}

/**
 * Parse une ligne .P du fichier .laps
 * @param line Ligne du fichier
 * @returns Objet structuré ou raw si non conforme
 */
export function parsePitLine(line: string) {
    const pMatch = line.match(
        /^D(\d+)\.P(\d+)#(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)$/
    );
    if (pMatch) {
        return {
            type: 'P',
            teamId: pMatch[1],
            lineNum: pMatch[2],
            pitNum: pMatch[3],
            lapNum: pMatch[4],
            raceTimeBefore: pMatch[5],
            raceTimeAfter: pMatch[6],
            pitDuration: pMatch[7],
            driverDuration: pMatch[8],
            nbLapSinceLast: pMatch[9],
            idDriver: pMatch[10],
            totalDriverDuration: pMatch[11]
        };
    }
    return { type: 'P', raw: line };
}

/**
 * Parse une ligne .INF du fichier .laps
 * @param line Ligne du fichier
 * @returns Objet structuré ou raw si non conforme
 */
export function parseInfLine(line: string) {
    const infMatch = line.match(/^D(\d+)\.INF#(.*)$/s);
    if (!infMatch) return { type: 'INF', raw: line };
    const teamId = infMatch[1];
    const xml = infMatch[2].trim();
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        const driverNode = doc.querySelector('driver');
        const teamName = driverNode?.getAttribute('name') ?? '';
        const category = driverNode?.querySelector('inf')?.getAttribute('value') ?? '';
        const pilots = Array.from(driverNode?.querySelectorAll(':scope > driver') ?? []).map(pilot => ({
            id: pilot.getAttribute('id') ?? '',
            name: pilot.getAttribute('name') ?? ''
        }));
        return {
            type: 'INF',
            teamId,
            teamName,
            category,
            pilots
        };
    } catch {
        return { type: 'INF', teamId, raw: xml };
    }
}

export async function readLapsFile(filename: string) {
	const url = `${LAP_DIR_PATH}/${filename}`;
	const response = await fetch(url);
	if (!response.ok) throw new Error('Fichier non trouvé');
	const text = await response.text();

	return text
		.split('\n')
		.filter(line => line.trim().length > 0)
		.map(line => {
			const typeMatch = line.match(/^D\d+\.(L|P|INF)/);
			const type = typeMatch ? typeMatch[1] : 'UNKNOWN';
			if (type === 'L') return parseLapLine(line);
			if (type === 'P') return parsePitLine(line);
			if (type === 'INF') return parseInfLine(line);
			return { type: 'UNKNOWN', raw: line };
		});
}
