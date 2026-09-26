// vocab-family.js
//
// Vocabulary data ONLY for the Family (Famiglia) category. Holds the single
// VOCAB_FAMILY array plus the FAMILY_LISTS registry, following the exact
// same shape as vocab-household.js's VOCAB_* / *_LISTS pattern — each pair
// is [Italian, English].
//
// Family (Famiglia) has under 30 entries and only one tab in the source
// spreadsheet, so — unlike every other vocabulary category — it does NOT
// get its own sub-category screen or a "Random (Casuale)" tile. The
// "Family (Famiglia)" tile on #screen-vocab starts this list directly via
// startGame('family', screenVocab, FAMILY_LISTS), the same way a single
// verb list starts straight from the verbs menu.

export const VOCAB_FAMILY = [
  ['La zia', 'Aunt'],
  ['Il neonato', 'Baby'],
  ['Il ragazzo', 'Boy'],
  ['Il fratello', 'Brother'],
  ['Il padre', 'Father'],
  ['La ragazza', 'Girl'],
  ['Il nonno', 'Grandfather'],
  ['La nonna', 'Grandmother'],
  ['La madre', 'Mother'],
  ['I genitori', 'Parents'],
  ['La sorella', 'Sister'],
  ['I gemelli', 'Twins'],
  ['Lo zio', 'Uncle'],
  ['Il single', 'Single'],
  ['La coppia', 'Couple'],
  ['Il marito', 'Husband'],
  ['La mogle', 'Wife'],
  ['Il matrimonio', 'Wedding'],
  ['Sposare', 'To marry'],
  ['Divorziare', 'To divorce'],
  ['Il papà', 'Dad'],
  ['La mamma', 'Mom'],
  ['La figlia', 'Daughter'],
  ['Il figlio', 'Son'],
  ['I bambini', 'Children'],
  ['Il bambino', 'Child'],
  ['L\'adulto', 'Adult'],
  ['Il cugino', 'Cousin'],
];

export const FAMILY_LISTS = {
  family: { label: 'Family (Famiglia)', pairs: VOCAB_FAMILY, footer: 'Family (Famiglia) · 28 pairs' },
};
