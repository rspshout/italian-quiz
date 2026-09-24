// vocab-animals.js
//
// This file holds ONLY the Animals (Gli animali) vocabulary data — the 6
// sub-category word lists and the ANIMALS_LISTS registry that turns them
// into clickable menu buttons on #screen-animals. No game logic, no HTML,
// no styling — just data, same rules as vocab-household.js and
// vocab-food-drink.js.
//
// Named "vocab-animals.js" (not "vocab-animals-nature.js") because Nature
// (plants, weather, landscape etc.) is planned as its own separate future
// category with its own vocab-nature.js file later — this file is Animals
// only.
//
// This is the third "broad category" vocab file, following the pattern set
// by vocab-household.js and vocab-food-drink.js — its own VOCAB_* arrays
// plus its own registry object, imported into script.js the same way
// HOUSEHOLD_LISTS and FOOD_DRINK_LISTS are.
//
// Each list is an array of [Italian, English] pairs.

export const VOCAB_ANIMALS = [
  ["L'alligatore", 'Alligator'],
  ["L'alpaca", 'Alpaca'],
  ['Gli animali', 'Animals'],
  ["L'armadillo", 'Armadillo'],
  ['Il babbuino', 'Baboon'],
  ['Il pipistrello', 'Bat'],
  ["L'orso", 'Bear'],
  ['Il bisonte', 'Bison'],
  ['Il cinghiale', 'Boar'],
  ['Il cammello', 'Camel'],
  ['Il gatto', 'Cat'],
  ['Il ghepardo', 'Cheetah'],
  ['Lo scimpanzé', 'Chimpanzee'],
  ['Il cincillà', 'Chinchilla'],
  ['Il puma', 'Cougar'],
  ['La mucca', 'Cow'],
  ['Il cervo', 'Deer'],
  ['Il cane', 'Dog'],
  ["L'asino", 'Donkey'],
  ["L'elefante", 'Elephant'],
  ['Il furetto', 'Ferret'],
  ['La volpe', 'Fox'],
  ['La gazzella', 'Gazelle'],
  ['Il gerbillo', 'Gerbil'],
  ['La giraffa', 'Giraffe'],
  ['La capra', 'Goat'],
  ['Il gorilla', 'Gorilla'],
  ["Il porcellino d'India", 'Guinea pig'],
  ['Il criceto', 'Hamster'],
  ['Il riccio', 'Hedgehog'],
  ["L'ippopotamo", 'Hippopotamus'],
  ['Il cavallo', 'Horse'],
  ['La iena', 'Hyena'],
  ['Il giaguaro', 'Jaguar'],
  ['Il canguro', 'Kangaroo'],
  ['Il koala', 'Koala'],
  ['Il leopardo', 'Leopard'],
  ['Il leone', 'Lion'],
  ['Il lama', 'Llama'],
  ['Il suricato', 'Meerkat'],
  ['La scimmia', 'Monkey'],
  ['Il topo', 'Mouse'],
  ['Il mulo', 'Mule'],
  ['Il panda', 'Panda'],
  ['La pantera', 'Panther'],
  ['Il maiale', 'Pig'],
  ["L'orso polare", 'Polar bear'],
  ['Il pony', 'Pony'],
  ['Il coniglio', 'Rabbit'],
  ['Il procione', 'Raccoon'],
  ['Il panda rosso', 'Red panda'],
  ['Il rinoceronte', 'Rhinoceros'],
  ['La pecora', 'Sheep'],
  ['La puzzola', 'Skunk'],
  ['Il serpente', 'Snake'],
  ['Il leopardo delle nevi', 'Snow leopard'],
  ['La tigre', 'Tiger'],
  ['La tartaruga', 'Turtle'],
  ['Il facocero', 'Warthog'],
  ['Animali selvatici', 'Wildlife'],
  ['Il lupo', 'Wolf'],
  ['La zebra', 'Zebra'],
];

export const VOCAB_BABY_ANIMALS = [
  ['Il cucciolo di orso', 'Bear cub'],
  ['Il coniglietto', 'Bunny'],
  ['Il vitello', 'Calf'],
  ['Il pulcino', 'Chick'],
  ['Il cignetto', 'Cygnet'],
  ["L'anatroccolo", 'Duckling'],
  ["L'aquilotto", 'Eaglet'],
  ['Il cerbiatto', 'Fawn'],
  ['Il nidiaceo', 'Fledgling'],
  ['Il puledro', 'Foal'],
  ['Il cucciolo di canguro', 'Kangaroo joey'],
  ['Il gattino', 'Kitten'],
  ["L'agnello", 'Lamb'],
  ['Il civettino', 'Owlet'],
  ['Il maialino', 'Piglet'],
  ['Il cucciolo di echidna', 'Puggle'],
  ['Il cucciolo di cane', 'Puppy'],
  ['Il girino', 'Tadpole'],
  ['Il cucciolo di tigre', 'Tiger cub'],
  ['Il lupacchiotto', 'Whelp'],
  ['Il puledro di zebra', 'Zebra foal'],
];

export const VOCAB_BIRDS = [
  ["L'albatro", 'Albatross'],
  ['Il pipistrello', 'Bat'],
  ['Gli uccelli', 'Birds'],
  ['Il merlo', 'Blackbird'],
  ['La ghiandaia azzurra', 'Bluejay'],
  ['Il canarino', 'Canary'],
  ['Il cardinale', 'Cardinal'],
  ['Il pollo', 'Chicken'],
  ['La colomba', 'Dove'],
  ["L'anatra", 'Duck'],
  ["L'aquila", 'Eagle'],
  ['Il fenicottero', 'Flamingo'],
  ["L'oca", 'Goose'],
  ['Il falco', 'Hawk'],
  ['Il colibrì', 'Hummingbird'],
  ['Il gufo', 'Owl'],
  ['Il pappagallo', 'Parrot'],
  ['Il pellicano', 'Pelican'],
  ['Il piccione', 'Pigeon'],
  ['La pulcinella di mare', 'Puffin'],
  ['La quaglia', 'Quail'],
  ['Il corvo', 'Raven'],
  ['Il pettirosso', 'Robin'],
  ['Il gabbiano', 'Seagull'],
  ['Il passero', 'Sparrow'],
  ['La cicogna', 'Stork'],
  ['La rondine', 'Swallow'],
  ['Il tacchino', 'Turkey'],
];

export const VOCAB_BUGS = [
  ['La formica', 'Ant'],
  ["L'afide", 'Aphid'],
  ["L'ape", 'Bee'],
  ['Lo scarabeo', 'Beetle'],
  ['La farfalla', 'Butterfly'],
  ['Il bruco', 'Caterpillar'],
  ['Il centopiedi', 'Centipede'],
  ['La cicala', 'Cicada'],
  ['Lo scarafaggio', 'Cockroach'],
  ['Il grillo', 'Cricket'],
  ['La libellula', 'Dragonfly'],
  ['La forbicina', 'Earwig'],
  ['La pulce', 'Flea'],
  ['La mosca', 'Fly'],
  ['Il moscerino', 'Gnat'],
  ['La cavalletta', 'Grasshopper'],
  ['Il calabrone', 'Hornet'],
  ['Gli insetti', 'Insects'],
  ['La coccinella', 'Ladybug'],
  ['Il pidocchio', 'Louse'],
  ['La falena', 'Moth'],
  ['La mantide religiosa', 'Praying mantis'],
  ['Lo scorpione', 'Scorpion'],
  ["Il pesciolino d'argento", 'Silverfish'],
  ['La chiocciola', 'Snail'],
  ['Il ragno', 'Spider'],
  ['La termite', 'Termite'],
  ['La zecca', 'Tick'],
  ['La vespa', 'Wasp'],
  ['Il punteruolo', 'Weevil'],
];

export const VOCAB_FISH_SEALIFE = [
  ['Il calamaro gigante', 'Giant squid'],
  ['Il cavalluccio marino', 'Sea horse'],
  ['Il corallo', 'Coral'],
  ['Il delfino', 'Dolphin'],
  ['Il gambero', 'Shrimp'],
  ['Il granchio', 'Crab'],
  ['Il grande squalo bianco', 'Great white shark'],
  ['Il leone marino', 'Sea lion'],
  ['Il merluzzo', 'Cod'],
  ['Il pesce', 'Fish'],
  ['Il pesce pagliaccio', 'Clownfish'],
  ['Il polpo', 'Octopus'],
  ["L'anguilla", 'Eel'],
  ["L'aragosta", 'Lobster'],
  ["L'eglefino", 'Haddock'],
  ["L'orca", 'Killer whale'],
  ["L'ostrica", 'Oyster'],
  ['La balena', 'Whale'],
  ['La balenottera azzurra', 'Blue whale'],
  ['La cozza', 'Mussel'],
  ['La fanerogama marina', 'Seagrass'],
  ['La foca', 'Seal'],
  ['La lontra marina', 'Sea otter'],
  ['La manta', 'Manta ray'],
  ['La medusa', 'Jellyfish'],
  ['La megattera', 'Humpback whale'],
  ['La sardina', 'Sardine'],
  ['La seppia', 'Cuttlefish'],
  ['La sirena', 'Mermaid'],
  ['La spugna', 'Sponge'],
  ['La stella marina', 'Starfish'],
  ['La tartaruga marina', 'Sea turtle'],
  ['La trota', 'Trout'],
  ['Lo squalo', 'Shark'],
];

export const VOCAB_PETS = [
  ['Gli animali domestici', 'Pets'],
  ['Il Barboncino', 'Poodle'],
  ['Il Bassotto', 'Dachshund'],
  ['Il Beagle', 'Beagle'],
  ['Il Border Collie', 'Border Collie'],
  ['Il Boxer', 'Boxer'],
  ['Il Bulldog', 'Bulldog'],
  ['Il cane', 'Dog'],
  ['Il Carlino', 'Pug'],
  ['Il Chihuahua', 'Chihuahua'],
  ['Il cincillà', 'Chinchilla'],
  ['Il coniglio', 'Rabbit'],
  ['Il criceto', 'Hamster'],
  ['Il furetto', 'Ferret'],
  ['Il gatto', 'Cat'],
  ['Il gerbillo', 'Gerbil'],
  ['Il Golden Retriever', 'Golden Retriever'],
  ['Il Labrador Retriever', 'Labrador Retriever'],
  ['Il Pastore Tedesco', 'German Shepherd'],
  ['Il pesce combattente', 'Betta fish'],
  ['Il pesciolino rosso', 'Goldfish'],
  ["Il porcellino d'India", 'Guinea pig'],
  ['Il ratto', 'Rat'],
  ['Il riccio', 'Hedgehog'],
  ['Il Rottweiler', 'Rottweiler'],
  ['Il Siberian Husky', 'Siberian Husky'],
  ['Il topo', 'Mouse'],
  ["L'Alano", 'Great Dane'],
  ['La tartaruga', 'Tortoise'],
  ['Lo Shih Tzu', 'Shih Tzu'],
  ['Lo Yorkshire Terrier', 'Yorkshire Terrier'],
];
// ---------------------------------------------------------------------------
// ANIMALS_LISTS — the 6 sub-categories shown when "Animals (Gli animali)" is
// opened from the Vocabulary screen. Kept as its own registry (rather than
// folded into another vocab file) because Animals is itself a broader
// vocabulary category sitting alongside Household, Food & Drink, and Travel
// & Vehicles, each with its own screen, its own vocab-<n>.js file, and its
// own registry of sub-categories the same way.
// ---------------------------------------------------------------------------
export const ANIMALS_LISTS = {
  animals: { label: 'Animals (Gli animali)', pairs: VOCAB_ANIMALS, footer: 'Animals (Gli animali) · ' + VOCAB_ANIMALS.length + ' pairs' },
  babyAnimals: { label: 'Baby Animals (Cuccioli di Animali)', pairs: VOCAB_BABY_ANIMALS, footer: 'Baby Animals (Cuccioli di Animali) · ' + VOCAB_BABY_ANIMALS.length + ' pairs' },
  birds: { label: 'Birds (Gli uccelli)', pairs: VOCAB_BIRDS, footer: 'Birds (Gli uccelli) · ' + VOCAB_BIRDS.length + ' pairs' },
  bugs: { label: 'Bugs (Gli insetti e le piccole creature)', pairs: VOCAB_BUGS, footer: 'Bugs (Gli insetti e le piccole creature) · ' + VOCAB_BUGS.length + ' pairs' },
  fishSealife: { label: 'Fish and Sealife (Pesci e vita marina)', pairs: VOCAB_FISH_SEALIFE, footer: 'Fish and Sealife (Pesci e vita marina) · ' + VOCAB_FISH_SEALIFE.length + ' pairs' },
  pets: { label: 'Pets (Animali domestici)', pairs: VOCAB_PETS, footer: 'Pets (Animali domestici) · ' + VOCAB_PETS.length + ' pairs' },
};
// NOTE: "Random (Casuale)" is NOT listed here — it isn't a fixed word list.
// It's built at click-time in script.js by shuffling together all the pairs
// from every list above and taking 30, so it draws fresh words each play.
// Its multiple-choice distractors are drawn from the full pool above (every
// Animals word), not just the 30 words in that round's draw.

// ---------------------------------------------------------------------------
// HOW TO ADD A NEW ANIMALS SUB-CATEGORY
// ---------------------------------------------------------------------------
// 1. Add a new "export const VOCAB_YOURNAME = [...]" array above, following
//    the exact same [ "Italian", "English" ] pair format as the others.
// 2. Add one new line inside ANIMALS_LISTS above, giving it a short key
//    (used internally) and a label (shown on screen), e.g.:
//
//    yourKey: { label: 'Your List Name', pairs: VOCAB_YOURNAME,
//               footer: 'Your List Name · ' + VOCAB_YOURNAME.length + ' pairs' },
//
// 3. That's it for the data side. To make it clickable on screen, you'll add
//    one menu button in index.html (inside #screen-animals) and one line in
//    script.js — covered separately, since that's layout/logic, not vocab.
//
// To add a whole NEW broad category (not an Animals sub-category) — e.g. the
// planned Nature category — create a new vocab-<n>.js file following this
// file's shape instead, with its own registry, and import it into script.js
// with its own "?v=N" cache-busting number.
