import path from 'path';
import { promises as fs } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

// Define your Pokemon interface
interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the absolute path of the json directory
    const jsonDirectory = path.join(process.cwd(), 'src', 'db', 'pokemon-list.json');

    // Read the JSON data file
    const fileContents = await fs.readFile(jsonDirectory, 'utf8');

    // Parse and return the JSON data
    const pokemon: Pokemon[] = JSON.parse(fileContents);
    res.status(200).json(pokemon);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).json({ error: 'Error reading JSON file' });
  }
}