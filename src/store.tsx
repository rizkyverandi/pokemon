import { BehaviorSubject, map } from "rxjs";

export interface Pokemon {
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

export const store$ = {
  pokemon: new BehaviorSubject<Pokemon[]>([]), // Initially empty array
  isLoading: new BehaviorSubject<boolean>(true), // Initial loading state set to true
};

const fetchPokemon = async () => {
  try {
    const response = await fetch("/api/pokemon");
    const data = await response.json();
    store$.pokemon.next(data); // Push the fetched data into the BehaviorSubject
    store$.isLoading.next(false); // Set loading state to false
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
};
// Fetch Pokémon and update store$ with the data
fetchPokemon();

// Observable for Pokémon with calculated power
export const pokemonWithPower$ = store$.pokemon.pipe(
  map((pokemon) => {
    console.log("Pokemon data in observable:", pokemon); // Debugging output
    return pokemon.map((p) => ({
      ...p,
      power:
        p.hp +
        p.attack +
        p.defense +
        p.special_attack +
        p.special_defense +
        p.speed,
    }));
  })
);
