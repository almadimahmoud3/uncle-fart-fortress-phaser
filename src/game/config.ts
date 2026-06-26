/** Game dimensions */
export const GAME_W = 640;
export const GAME_H = 480;

/** GBC Full-Color Palette (Pokemon FireRed inspired) */
export const C = {
  // UI
  uiRed: '#c62828', uiRedLight: '#ef5350', uiRedDark: '#8e0000',
  uiWhite: '#fff8e7', uiBorder: '#5d4037', uiBorderLight: '#8d6e63',
  uiBg: '#f5f0e0', uiText: '#3e2723', uiTextLight: '#5d4037',
  // World
  wallTop: '#8d6e63', wallBot: '#6d4c41', wallAccent: '#a1887f',
  floor: '#d7ccc8', floorLine: '#bcaaa4', floorDark: '#bcaaa4',
  floorTile: '#c8b9a8',
  // Couch
  couchBody: '#8d6e63', couchCushion: '#a1887f', couchDark: '#5d4037',
  couchLight: '#bcaaa4',
  // Characters
  skin: '#ffcc80', skinDark: '#ffb74d', skinShadow: '#e6a23c',
  hairBrown: '#5d4037', hairGray: '#9e9e9e',
  uncleShirt: '#1565c0', uncleShirtLight: '#42a5f5',
  // Grass / nature
  grass1: '#66bb6a', grass2: '#43a047', grass3: '#2e7d32',
  tree1: '#4caf50', tree2: '#388e3c', trunk: '#795548',
  // Enemies
  pink: '#f48fb1', blue: '#64b5f6', yellow: '#fff176',
  orange: '#ffb74d', purple: '#ce93d8', teal: '#4db6ac',
  red: '#ef5350',
  // Effects
  fartGreen: '#81c784', fartGreenDark: '#4caf50', fartPoison: '#ab47bc',
  // Sky
  sky: '#90caf9', skyLight: '#bbdefb',
  // Pokeball
  pokeRed: '#c62828', pokeWhite: '#fff', pokeCenter: '#212121',
  // Window
  windowGlass: '#90caf9', windowFrame: '#5d4037',
  // Curtains
  curtain: '#c62828', curtainLight: '#ef5350',
  // Misc
  black: '#000000', gray: '#9e9e9e', lightGray: '#bdbdbd',
  pants: '#37474f', mouth: '#c62828'
} as const;

/** Relative (enemy) type definitions */
export interface RelativeTypeDef {
  name: string;
  emoji: string;
  spd: number;
  hp: number;
  col: string;
  pts: number;
}

export const REL_TYPES: RelativeTypeDef[] = [
  { name: 'aunt',     emoji: '👩', spd: 1.2, hp: 2, col: C.pink,    pts: 10 },
  { name: 'kid',      emoji: '🧒', spd: 2.0, hp: 1, col: C.blue,    pts: 10 },
  { name: 'dog',      emoji: '🐕', spd: 2.5, hp: 1, col: C.orange,  pts: 15 },
  { name: 'grandma',  emoji: '👵', spd: 0.8, hp: 3, col: C.purple,  pts: 20 },
  { name: 'neighbor', emoji: '🧑', spd: 1.6, hp: 2, col: C.teal,    pts: 15 },
  { name: 'mailman',  emoji: '📬', spd: 1.4, hp: 2, col: C.blue,    pts: 25 },
  { name: 'cat',      emoji: '🐱', spd: 3.0, hp: 1, col: C.orange,  pts: 20 },
];

/** Spawn points */
export const SPAWNS = [
  { x: -20,  y: 250 },
  { x: 660,  y: 250 },
  { x: 320,  y: -20 },
  { x: -20,  y: 380 },
  { x: 660,  y: 380 },
];

/** Fart type definitions */
export const FART_TYPES = {
  quick:  { radius: 55,  lifetime: 800,  maxCd: 500  },
  mega:   { radius: 100, lifetime: 1200, maxCd: 2000 },
  silent: { radius: 70,  lifetime: 800,  maxCd: 1200 },
} as const;

/** Uncle and couch positions */
export const UNCLE = { x: 320, y: 250 };
export const COUCH = { x: 250, y: 280, w: 140, h: 45 };

/** Screen keys */
export const SCREENS = {
  TITLE: 'title',
  NAME: 'name',
  CINEMA: 'cinema',
  GAME: 'game',
  PAUSE: 'pause',
  OVER: 'over',
} as const;

/** Character grid for name entry */
export const CHAR_GRID = [
  ' ABCDEFGHI',
  ' JKLMNOPQR',
  ' STUVWXYZ ',
  ' 012345678',
  ' .,!?:/-  ',
];
