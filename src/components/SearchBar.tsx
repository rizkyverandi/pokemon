import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pokemon, pokemonWithPower$ } from "@/store";
import Image from "next/image";
import { POKEDEX_URL } from "@/constants";
import { Subscription } from "rxjs";

interface InitialState {
  pokemons: Pokemon[];
  page: number;
  isLoading: boolean;
  errorMsg: string;
}

const SearchBar = () => {
  const [search, setSearch] = useState<string>("");
  const [initialState, setInitialState] = useState<InitialState>({
    pokemons: [],
    page: 2,
    isLoading: false,
    errorMsg: "",
  });
  const itemSize = 10; // Number of items to load per click
  const [items, setItems] = useState<Pokemon[]>([]); // State for the currently visible items
  

  useEffect(() => {
    const subscription: Subscription = pokemonWithPower$.subscribe((data) => {
      setInitialState({ ...initialState, pokemons: data }); // Update state when new data is emitted
      setItems(data.slice(0, itemSize));
    });

    // Cleanup the subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredPokemon = useMemo(() => {
    return items.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  // Function to load more items
  const loadMoreItems = useCallback(() => {
    setInitialState((prevState) => ({ ...prevState, isLoading: true }));

    // Simulate network request
    Promise.resolve()
      .then(() => {
        setTimeout(() => {
          const startIndex = (initialState.page - 1) * itemSize;
          const endIndex = startIndex + itemSize;
          const newItems = initialState.pokemons.slice(startIndex, endIndex);

          setItems((prevItems) => [...prevItems, ...newItems]); // Append new items to the current items
          setInitialState((prevInitialState) => ({
            ...initialState,
            page: prevInitialState.page + 1,
          })); // Increment the current page
        }, Math.ceil(Math.random() * 5) * 100);
      })
      .finally(() => {
        setInitialState((prevState) => ({ ...prevState, isLoading: false }));
      });
  }, [initialState.page, itemSize, initialState.pokemons, initialState.isLoading]);
  // Check if all items are loaded
  const allItemsLoaded = items.length >= initialState.pokemons.length;

  return (
    <div className="bg-gray-600 p-4">
      <input
        className="w-full border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:border-blue-500 placeholder:italic"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Type here ex. (Psyduck)"
      />

      <div>
        {filteredPokemon.map((pokemon) => (
          <div key={pokemon.id} className="flex gap-4 items-center py-2 ">
            <input type="checkbox" className="w-4 h-4" />
            <Image
              src={`${POKEDEX_URL}/${pokemon.id}.png`}
              alt={pokemon.name}
              width={50}
              height={50}
              className="rounded-full bg-white"
            />
            <p>{pokemon.name}</p>
          </div>
        ))}
        <div className="text-center">
          {!allItemsLoaded && (
            <button
              onClick={loadMoreItems}
              className="px-4 py-2 bg-white text-black rounded-md"
            >
              {" "}
              {initialState.isLoading ? "Loading..." : "Load More"}
            </button>
          )}
          {allItemsLoaded && <p>No more items to load.</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
