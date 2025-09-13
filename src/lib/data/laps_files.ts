/**
 * Parse le fichier laps_files.json et retourne la liste des fichiers .laps
 */
export async function getLapsFilesList(): Promise<string[]> {
  const response = await fetch('/data/laps/laps_files.json');
  if (!response.ok) throw new Error('Fichier laps_files.json non trouvé');
  return await response.json();
}
