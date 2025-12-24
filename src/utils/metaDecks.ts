// Meta deck data from EDHTop16 - Last updated: 2025-12-22

export type MtgColor = 'W' | 'U' | 'B' | 'R' | 'G' | 'C';
export type Archetype = "turbo" | "mid-range" | "stax" | "control";

export type MetaDeck = {
  commanders: string[];
  commanderIds?: string[]; // Scryfall IDs for each commander (optional for now)
  metaShare: number; // Percentage (0-100) representing how likely this deck is to be selected
  colors: MtgColor[]; // Color identity: W, U, B, R, G, or C for colorless
  archetypes: Archetype[]; // Deck archetypes: turbo, mid-range, stax, control
};

export const metaDecks: MetaDeck[] = [
  {
    commanders: ["Kraum, Ludevic's Opus", "Tymna the Weaver"],
    metaShare: 11.54,
    colors: ["B", "R", "U", "W"],
    archetypes: ["mid-range"],
  },
  {
    commanders: ["Kinnan, Bonder Prodigy"],
    metaShare: 8.57,
    colors: ["G", "U"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Rograkh, Son of Rohgahh", "Thrasios, Triton Hero"],
    metaShare: 4.75,
    colors: ["G", "R", "U"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Rograkh, Son of Rohgahh", "Silas Renn, Seeker Adept"],
    metaShare: 4.16,
    colors: ["B", "R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Sisay, Weatherlight Captain"],
    metaShare: 4.05,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["mid-range", "turbo"],
  },
  {
    commanders: ["Etali, Primal Conqueror // Etali, Primal Sickness"],
    metaShare: 3.96,
    colors: ["G", "R"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Thrasios, Triton Hero", "Tymna the Weaver"],
    metaShare: 3.66,
    colors: ["B", "G", "U", "W"],
    archetypes: ["mid-range", "control", "stax"],
  },
  {
    commanders: ["Noctis, Prince of Lucis"],
    metaShare: 0.1,
    colors: ["B", "U", "W"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Kediss, Emberclaw Familiar", "Malcolm, Keen-Eyed Navigator"],
    metaShare: 0.1,
    colors: ["R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Chatterfang, Squirrel General"],
    metaShare: 0.1,
    colors: ["B", "G"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Kefka, Court Mage // Kefka, Ruler of Ruin"],
    metaShare: 2.75,
    colors: ["B", "R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Magda, Brazen Outlaw"],
    metaShare: 2.62,
    colors: ["R"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Krark, the Thumbless", "Thrasios, Triton Hero"],
    metaShare: 0.1,
    colors: ["G", "R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Celes, Rune Knight"],
    metaShare: 0.1,
    colors: ["B", "R", "W"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Ral, Monsoon Mage // Ral, Leyline Prodigy"],
    metaShare: 2.28,
    colors: ["R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Vivi Ornitier"],
    metaShare: 2.18,
    colors: ["R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Dargo, the Shipwrecker", "Tymna the Weaver"],
    metaShare: 2.05,
    colors: ["B", "R", "W"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Ellivere of the Wild Court"],
    metaShare: 0.1,
    colors: ["G", "W"],
    archetypes: ["stax"],
  },
  {
    commanders: ["Thrasios, Triton Hero", "Yoshimaru, Ever Faithful"],
    metaShare: 1.82,
    colors: ["G", "U", "W"],
    archetypes: ["mid-range", "stax"],
  },
  {
    commanders: ["Tivit, Seller of Secrets"],
    metaShare: 1.78,
    colors: ["B", "U", "W"],
    archetypes: ["mid-range", "control"],
  },
  {
    commanders: ["Terra, Magical Adept // Esper Terra"],
    metaShare: 1.57,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Lumra, Bellow of the Woods"],
    metaShare: 1.29,
    colors: ["G"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Malcolm, Keen-Eyed Navigator", "Vial Smasher the Fierce"],
    metaShare: 1.27,
    colors: ["B", "R", "U"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Norman Osborn // Green Goblin"],
    metaShare: 1.27,
    colors: ["B", "R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Yuriko, the Tiger's Shadow"],
    metaShare: 1.21,
    colors: ["B", "U"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Tayam, Luminous Enigma"],
    metaShare: 1.2,
    colors: ["B", "G", "W"],
    archetypes: ["stax", "mid-range"],
  },
  {
    commanders: ["Marneus Calgar"],
    metaShare: 1.11,
    colors: ["B", "U", "W"],
    archetypes: ["mid-range", "stax"],
  },
  {
    commanders: ["Glarb, Calamity's Augur"],
    metaShare: 1.08,
    colors: ["B", "G", "U"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Esika, God of the Tree // The Prismatic Bridge"],
    metaShare: 0.1,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Inalla, Archmage Ritualist"],
    metaShare: 0.92,
    colors: ["B", "R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["K'rrik, Son of Yawgmoth"],
    metaShare: 0.88,
    colors: ["B"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Ob Nixilis, Captive Kingpin"],
    metaShare: 0.85,
    colors: ["B", "R"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Derevi, Empyrial Tactician"],
    metaShare: 0.84,
    colors: ["G", "U", "W"],
    archetypes: ["stax", "mid-range"],
  },
  {
    commanders: ["Rocco, Cabaretti Caterer"],
    metaShare: 0.84,
    colors: ["G", "R", "W"],
    archetypes: ["mid-range"],
  },
  {
    commanders: ["The Wandering Minstrel"],
    metaShare: 0.77,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["mid-range", "control"],
  },
  {
    commanders: ["Winota, Joiner of Forces"],
    metaShare: 0.75,
    colors: ["R", "W"],
    archetypes: ["turbo", "stax"],
  },
  {
    commanders: ["Kenrith, the Returned King"],
    metaShare: 0.72,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["turbo", "mid-range", "control"],
  },
  {
    commanders: ["Y'shtola, Night's Blessed"],
    metaShare: 0.71,
    colors: ["B", "U", "W"],
    archetypes: ["turbo", "control", "mid-range"],
  },
  {
    commanders: ["Atraxa, Grand Unifier"],
    metaShare: 0.71,
    colors: ["B", "G", "U", "W"],
    archetypes: ["mid-range", "stax"],
  },
  {
    commanders: ["Dihada, Binder of Wills"],
    metaShare: 0.68,
    colors: ["B", "R", "W"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Urza, Lord High Artificer"],
    metaShare: 0.68,
    colors: ["U"],
    archetypes: ["turbo", "mid-range", "stax"],
  },
  {
    commanders: ["Stella Lee, Wild Card"],
    metaShare: 0.63,
    colors: ["R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Malcolm, Keen-Eyed Navigator", "Tymna the Weaver"],
    metaShare: 0.63,
    colors: ["B", "U", "W"],
    archetypes: ["mid-range", "control"],
  },
  {
    commanders: ["Tevesh Szat, Doom of Fools", "Thrasios, Triton Hero"],
    metaShare: 0.61,
    colors: ["B", "G", "U"],
    archetypes: ["mid-range", "control"],
  },
  {
    commanders: ["Talion, the Kindly Lord"],
    metaShare: 0.59,
    colors: ["B", "U"],
    archetypes: ["mid-range", "stax", "control"],
  },
  {
    commanders: ["Najeela, the Blade-Blossom"],
    metaShare: 0.54,
    colors: ["B", "G", "R", "U", "W"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Zhulodok, Void Gorger"],
    metaShare: 0.54,
    colors: ["C"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Zirda, the Dawnwaker"],
    metaShare: 0.54,
    colors: ["R", "W"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["The Gitrog Monster"],
    metaShare: 0.52,
    colors: ["B", "G"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Korvold, Fae-Cursed King"],
    metaShare: 0.49,
    colors: ["B", "G", "R"],
    archetypes: ["mid-range", "turbo"],
  },
  {
    commanders: ["Heliod, the Radiant Dawn // Heliod, the Warped Eclipse"],
    metaShare: 0.49,
    colors: ["U", "W"],
    archetypes: ["control", "stax"],
  },
  {
    commanders: ["Krark, the Thumbless", "Sakashima of a Thousand Faces"],
    metaShare: 0.49,
    colors: ["R", "U"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Gwenom, Remorseless"],
    metaShare: 0.49,
    colors: ["B"],
    archetypes: ["turbo"],
  },
  {
    commanders: ["Rowan, Scion of War"],
    metaShare: 0.46,
    colors: ["B", "R"],
    archetypes: ["turbo", "mid-range"],
  },
  {
    commanders: ["Elsha of the Infinite"],
    metaShare: 0.42,
    colors: ["R", "U", "W"],
    archetypes: ["turbo", "control"],
  },
  {
    commanders: ["Arcum Dagsson"],
    metaShare: 0.38,
    colors: ["U"],
    archetypes: ["turbo", "stax"],
  } // NEW
];
