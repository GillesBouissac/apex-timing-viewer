// import { readLapsFile } from './parsers';

const LAP_DIR_PATH = './data/laps'
const LAPS_FILE_PATH = `${LAP_DIR_PATH}/laps_files.json`

/**
 * Parse le fichier laps_files.json et retourne la liste des fichiers .laps
 */
export async function getLapsFilesList(): Promise<string[]> {
  const response = await fetch(LAPS_FILE_PATH);
  if (!response.ok) throw new Error('Fichier laps_files.json non trouvé');
  return await response.json();
}
