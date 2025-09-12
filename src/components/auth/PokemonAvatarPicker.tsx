import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type PokemonAvatarPickerProps = {
  selected?: string | null;
  onSelect: (url: string) => void;
  onConfirm: () => void;
  onSkip: () => void;
};

// Official artwork sprite URLs from PokeAPI for a curated set of Pokémon
const POKEMON_IDS = [
  1, 4, 7, 25, 39, 52, 54, 63, 66, 74, 77, 81,
  92, 95, 111, 120, 133, 134, 135, 136, 143, 147,
  150, 151, 152, 155, 158, 172, 175, 196, 197, 200,
  212, 214, 215, 228, 230, 248, 249, 250, 251, 252,
  255, 258, 280, 287, 304, 309, 311, 312
];

export const POKEMON_AVATAR_URLS: string[] = POKEMON_IDS.map(
  (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
);

const PokemonAvatarPicker: React.FC<PokemonAvatarPickerProps> = ({ selected, onSelect, onConfirm, onSkip }) => {
  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-lg">Choose your Pokémon avatar</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {POKEMON_AVATAR_URLS.map((url) => {
            const isSelected = selected === url;
            return (
              <button
                key={url}
                type="button"
                onClick={() => onSelect(url)}
                className={`aspect-square rounded-xl border relative overflow-hidden transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSelected ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-200'
                }`}
              >
                <img
                  src={url}
                  alt="Pokémon avatar"
                  className="w-full h-full object-contain bg-white"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute inset-0 ring-4 ring-blue-400/30 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button onClick={onConfirm} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            Confirm Avatar
          </Button>
          <Button onClick={onSkip} variant="outline" className="flex-1">
            Skip for now (random)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PokemonAvatarPicker;
