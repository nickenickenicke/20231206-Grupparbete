import "./../scss/style.scss";
import axios from "axios";
import { IPokemonMain } from "./models/IPokemonMain";
import { IPokemonResults } from "./models/IPokemonResults";
// import { IPokemonSprites } from "./models/IPokemonSprites";
import { IPokemon } from "./models/IPokemon";

async function getPokemon(): Promise<IPokemonResults[]> {
  const response = await axios.get<IPokemonMain>(
    "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"
  );
  return response.data.results;
}
async function getSearch(input: string): Promise<IPokemon> {
  const response = await axios.get<IPokemon>(
    "https://pokeapi.co/api/v2/pokemon/" + input
  );
  console.log(response.data);

  return response.data;
}

async function getPokemonPicture(url: string): Promise<string> {
  const response = await axios.get<IPokemon>(url);
  return response.data.sprites.front_default;
}

const pokemonResult: IPokemonResults[] = await getPokemon();

const mainContainer = document.getElementById(
  "mainContentContainer"
) as HTMLDivElement;

async function createHtml(pokemonResult: IPokemonResults[]) {
  mainContainer.innerHTML = "";
  pokemonResult.forEach(async (pokemon) => {
    const pokemonContainer = document.createElement("article");
    const pokemonName = document.createElement("span");
    const pokemonImage = document.createElement("img");

    pokemonContainer.className = "pokemoncontainer";
    pokemonName.className = "pokemonname";
    pokemonImage.className = "pokemonimage";
    pokemonName.innerHTML = pokemon.name;
    pokemonImage.src = await getPokemonPicture(pokemon.url);
    pokemonImage.alt = pokemon.name;

    mainContainer.appendChild(pokemonContainer);
    pokemonContainer.appendChild(pokemonName);
    pokemonContainer.appendChild(pokemonImage);
  });
}

async function createHtmlSearch(pokemonResult: IPokemon) {
  mainContainer.innerHTML = "";

  const pokemonContainer = document.createElement("article");
  const pokemonName = document.createElement("span");
  const pokemonImage = document.createElement("img");

  pokemonContainer.className = "pokemoncontainer";
  pokemonName.className = "pokemonname";
  pokemonImage.className = "pokemonimage";
  pokemonName.innerHTML = pokemonResult.name;
  pokemonImage.src = pokemonResult.sprites.front_default;
  pokemonImage.alt = pokemonResult.name;

  mainContainer.appendChild(pokemonContainer);
  pokemonContainer.appendChild(pokemonName);
  pokemonContainer.appendChild(pokemonImage);
}
await createHtml(pokemonResult);

const form = document.getElementById("form") as HTMLFormElement;

const randomButton = document.getElementById(
  "randomButton"
) as HTMLButtonElement;

const input = document.getElementById("input") as HTMLInputElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputValue = input.value;
  const searchResult = await getSearch(inputValue);
  await createHtmlSearch(searchResult);
});

randomButton.addEventListener("click", async () => {
  const random = Math.floor(Math.random() * 1017);
  console.log(random);
  const searchResult = await getSearch(random.toString());
  await createHtmlSearch(searchResult);
});
