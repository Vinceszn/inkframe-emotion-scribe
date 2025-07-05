import { Character, Theme } from '@/store/inkframe-store';
import charactersData from '@/data/characters.json';
import themesData from '@/data/themes.json';

export const loadMemoryData = (): { characters: Character[], themes: Theme[] } => {
  return {
    characters: charactersData.characters,
    themes: themesData.themes
  };
};