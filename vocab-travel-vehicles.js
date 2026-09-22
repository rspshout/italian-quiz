// vocab-travel-vehicles.js
//
// Holds ONLY the Travel & Vehicles (Viaggi e veicoli) vocabulary data: the
// 2 sub-category arrays (VOCAB_TRAVEL, VOCAB_VEHICLES), plus the
// TRAVEL_VEHICLES_LISTS registry that turns them into clickable menu
// buttons on #screen-travel-vehicles. TRAVEL_VEHICLES_LISTS maps a short
// key to { label, pairs, footer }, the same shape as HOUSEHOLD_LISTS and
// FOOD_DRINK_LISTS.
//
// "Random (Casuale)" is NOT a registry entry here — it isn't a fixed list.
// script.js builds it on the fly each time it's clicked, by pooling
// VOCAB_TRAVEL and VOCAB_VEHICLES together and shuffling a fresh 30-word
// draw, so it's different every play (same pattern as
// startRandomHousehold() / startRandomFoodDrink()).
//
// export const is used on everything here so script.js can import it.

export const VOCAB_TRAVEL = [
  ["Il bagaglio", "Baggage"],
  ["Il biglietto", "Ticket"],
  ["Il check-in", "Check-in"],
  ["Il passaporto", "Passport"],
  ["Il resort", "Resort"],
  ["Il souvenir", "Souvenir"],
  ["Il tassista", "Taxi driver"],
  ["Il taxi", "Taxi"],
  ["Il turismo", "Tourism"],
  ["Il viaggio", "Travel"],
  ["Il visto", "Visa"],
  ["L'abbonamento", "Season ticket"],
  ["L'aeroporto", "Airport"],
  ["L'aerostazione", "Terminal"],
  ["L'albergo", "Hotel"],
  ["L'ambasciata", "Embassy"],
  ["L'arrivo", "Arrival"],
  ["L'avventura", "Adventure"],
  ["L'escursione", "Excursion"],
  ["L'itinerario", "Itinerary"],
  ["L'ostello", "Hostel"],
  ["La carrozza letto", "Sleeper"],
  ["La carta d'imbarco", "Boarding pass"],
  ["La città", "City"],
  ["La crociera", "Cruise"],
  ["La destinazione", "Destination"],
  ["La dogana", "Customs"],
  ["La guida turistica", "Guidebook"],
  ["La hostess", "Hostess"],
  ["La mappa", "Map"],
  ["La partenza", "Departure"],
  ["La prenotazione", "Reservation"],
  ["La stazione", "Station"],
  ["La tariffa", "Fare"],
  ["La vacanza", "Holiday"],
  ["Le visite turistiche", "Sightseeing"],
];

export const VOCAB_VEHICLES = [
  ["Il biglietto", "Ticket"],
  ["Il camion", "Truck"],
  ["Il capitano", "Captain"],
  ["Il furgone", "Van"],
  ["Il minivan", "Minivan"],
  ["Il pilota", "Pilot"],
  ["Il taxi", "Taxi"],
  ["Il traghetto", "Ferry"],
  ["Il tram", "Tram"],
  ["Il trattore", "Tractor"],
  ["Il triciclo", "Tricycle"],
  ["L'aereo", "Plane"],
  ["L'aeroporto", "Airport"],
  ["L'ambulanza", "Ambulance"],
  ["L'astronave", "Spaceship"],
  ["L'autista di autobus", "Bus driver"],
  ["L'auto", "Car"],
  ["L'auto sportiva", "Sports car"],
  ["L'autopompa", "Fire engine"],
  ["L'elicottero", "Helicopter"],
  ["La barca", "Boat"],
  ["La bicicletta", "Bicycle"],
  ["La canoa", "Canoe"],
  ["La fermata dell'autobus", "Bus stop"],
  ["La limousine", "Limousine"],
  ["La metropolitana", "Metro"],
  ["La moto", "Motorbike"],
  ["La motocicletta", "Motorcycle"],
  ["La nave", "Ship"],
  ["La roulotte", "Caravan"],
  ["La stazione", "Station"],
  ["La stazione degli autobus", "Bus station"],
  ["La stazione ferroviaria", "Train station"],
  ["Lo scooter", "Scooter"],
  ["Lo yacht", "Yacht"],
];

export const TRAVEL_VEHICLES_LISTS = {
  travel: {
    label: "Travel (Viaggiare)",
    pairs: VOCAB_TRAVEL,
    footer: "Travel (Viaggiare) · " + VOCAB_TRAVEL.length + " pairs",
  },
  vehicles: {
    label: "Vehicles (Veicoli)",
    pairs: VOCAB_VEHICLES,
    footer: "Vehicles (Veicoli) · " + VOCAB_VEHICLES.length + " pairs",
  },
};

// HOW TO ADD A NEW TRAVEL & VEHICLES SUB-CATEGORY
// -------------------------------------------------
// 1. Add a new VOCAB_YOURNAME array above, in the same
//    ["Italian", "English"] pairs format.
// 2. Add one new entry to TRAVEL_VEHICLES_LISTS, keyed however you like,
//    with { label, pairs, footer } matching the shape above.
// 3. In index.html, add a new .menu-item inside #menu-list-travel-vehicles
//    (give it a unique id, e.g. menu-item-tv-yourname).
// 4. In script.js, wire that new id to:
//      startGame('yourKey', screenTravelVehicles, TRAVEL_VEHICLES_LISTS)
// 5. Bump this file's own "?v=N" in script.js's import line.
//
// HOW TO START A WHOLE NEW BROAD VOCABULARY CATEGORY
// -----------------------------------------------------
// Don't fold it into this file — create a new vocab-<name>.js following
// this same shape (its own VOCAB_* arrays + its own registry object),
// then import it into script.js the same way TRAVEL_VEHICLES_LISTS is
// imported here, with its own independent "?v=N".
