// vocab-clothes.js
//
// Vocabulary data ONLY for the Clothes (Vestiti) category. Holds the single
// VOCAB_CLOTHES array plus the CLOTHES_LISTS registry that turns it into a
// clickable menu button on #screen-clothes (Vocabulary > Clothes). Follows
// the exact same shape as vocab-household.js's VOCAB_* / *_LISTS pattern —
// each pair is [Italian, English].
//
// This category has only one tab in the source spreadsheet, so
// CLOTHES_LISTS has a single entry — #screen-clothes therefore shows just
// that one tile plus "Random (Casuale)" (built on the fly by
// startRandomClothes() in script.js), the same as every other vocabulary
// category.

export const VOCAB_CLOTHES = [
  ['L\'accappatoio', 'Bathrobe'],
  ['Il berretto', 'Beanie'],
  ['La cintura', 'Belt'],
  ['Il bikini', 'Bikini'],
  ['Il blazer', 'Blazer'],
  ['La camicetta', 'Blouse'],
  ['Gli stivali', 'Boots'],
  ['Il farfallino', 'Bow tie'],
  ['Il cappellino', 'Cap'],
  ['Il cardigan', 'Cardigan'],
  ['I vestiti', 'Clothes'],
  ['Il cappotto', 'Coat'],
  ['Il vestito', 'Dress'],
  ['Le infradito', 'Flip-flops'],
  ['I guanti', 'Gloves'],
  ['Il cappello', 'Hat'],
  ['I tacchi', 'Heels'],
  ['La felpa con cappuccio', 'Hoodie'],
  ['La giacca', 'Jacket'],
  ['I jeans', 'Jeans'],
  ['I pantaloni della tuta', 'Joggers'],
  ['I leggings', 'Leggings'],
  ['I mocassini', 'Loafers'],
  ['La salopette', 'Overalls'],
  ['Il soprabito', 'Overcoat'],
  ['La tasca', 'Pocket'],
  ['La polo', 'Polo shirt'],
  ['Il pigiama', 'Pyjamas'],
  ['La giacca a vento', 'Raincoat'],
  ['I sandali', 'Sandals'],
  ['La sciarpa', 'Scarf'],
  ['La camicia', 'Shirt'],
  ['Le scarpe', 'Shoes'],
  ['I pantaloni corti', 'Shorts'],
  ['La gonna', 'Skirt'],
  ['La sottoveste', 'Slip'],
  ['Le pantofole', 'Slippers'],
  ['Le scarpe da ginnastica', 'Sneakers'],
  ['I calzini', 'Socks'],
  ['L\'abbigliamento sportivo', 'Sportswear'],
  ['Le calze', 'Stockings'],
  ['L\'abito', 'Suit'],
  ['Il maglione', 'Sweater'],
  ['Il costume da bagno', 'Swimsuit'],
  ['La maglietta', 'T-shirt'],
  ['La canottiera', 'Tank top'],
  ['La biancheria termica', 'Thermal underwear'],
  ['La cravatta', 'Tie'],
  ['I collant', 'Tights'],
  ['La tuta', 'Tracksuit'],
  ['I pantaloni', 'Trousers'],
  ['I pantaloncini da bagno', 'Trunks'],
  ['La biancheria intima', 'Underwear'],
  ['L\'uniforme', 'Uniform'],
  ['Il panciotto', 'Vest'],
];

export const CLOTHES_LISTS = {
  clothes: { label: 'Clothes (Vestiti)', pairs: VOCAB_CLOTHES, footer: 'Clothes (Vestiti) · 55 pairs' },
};
