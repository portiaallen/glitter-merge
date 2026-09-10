import { INITIAL_AREAS } from "../data/areas";
import { INITIAL_CURRENCIES } from "../data/currencies";
import { INITIAL_FAMILIES, INITIAL_ITEMS } from "../data/families";
import { INITIAL_GENERATORS } from "../data/generators";
import { createCatalog } from "./createCatalog";

export const defaultCatalog = createCatalog({
  items: INITIAL_ITEMS,
  families: INITIAL_FAMILIES,
  generators: INITIAL_GENERATORS,
  currencies: INITIAL_CURRENCIES,
  areas: INITIAL_AREAS,
});
