
/**
 * Lit et parse un fichier .laps depuis le dossier static/data/laps
 * @param filename Nom du fichier (ex: D83181.laps)
 * @returns Tableau d'objets { id, value }
 */
export function parseLapLine(line: string) {
	const lMatch = line.match(/^D(\d+)\.L(\d+)#\|\|\|(.*)$/);
	return lMatch
		? { type: 'L', teamId: lMatch[1], id: lMatch[2], value: lMatch[3] }
		: { type: 'L', raw: line };
}

export function parsePitLine(line: string) {
	// Dxxxx.P<pitNum>#<lineNum>|lapNum|raceTimeBefore|raceTimeAfter|pitDuration|driverDuration|nbLapSinceLast|idDriver|totalDriverDuration
	const pMatch = line.match(/^D(\d+)\.P(\d+)#(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)$/);
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
	} else {
		return { type: 'P', raw: line };
	}
}

export function parseInfLine(line: string) {
	const infMatch = line.match(/^D(\d+)\.INF#(.*)$/);
	if (!infMatch) return { type: 'INF', raw: line };
	const teamId = infMatch[1];
	const xml = infMatch[2];
	let teamName: string | undefined;
	let category: string | undefined;
	let pilots: { id: string; name: string }[] = [];
	const parser = new DOMParser();
	const doc = parser.parseFromString(xml, 'application/xml');
	const teamNode = doc.querySelector('driver[id]');
	if (teamNode) {
		teamName = teamNode.getAttribute('name') || undefined;
	}
	const catNode = doc.querySelector('inf[type="class"]');
	if (catNode) {
		category = catNode.getAttribute('value') || undefined;
	}
	pilots = Array.from(doc.querySelectorAll('driver[id]')).map(node => ({
		id: node.getAttribute('id') || '',
		name: node.getAttribute('name') || ''
	}));
	return {
		type: 'INF',
		xml,
		teamId,
		teamName,
		category,
		pilots
	};
}

export async function readLapsFile(filename: string) {
	const response = await fetch(`/data/laps/${filename}`);
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
