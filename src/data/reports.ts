// Catch reports from Wowhead's WoW Forever database (the "Fished in" tab on each item page),
// collected on 2026-11-19.
//
// Each entry is [catches of this item in the zone, all fishing catches Wowhead recorded in the zone],
// so catches / total is how often a cast in that zone brings up this item.
// Left out: zones with fewer than 3 catches, fish making up under 0.05% of a zone's catches
// (stray reports), and zones the app does not show (Alterac Valley, Arathi Basin, Blasted Lands,
// Burning Steppes, Shen'dralas).

export type Report = [catches: number, zoneTotal: number]
type Reports = Record<string, Record<string, Report>>

/** fish id -> zone id -> report */
export const FISH_REPORTS: Reports = {
  smallfish: {
    elwynn: [17094, 26934], zephras: [11988, 19447], mulgore: [8243, 13433], stormwind: [7718, 46220],
    tirisfal: [7644, 16037], 'dun-morogh': [6598, 10645], orgrimmar: [5164, 29601],
    'thunder-bluff': [3991, 22829], teldrassil: [2695, 8544], durotar: [2521, 8596], ironforge: [2157, 11865],
    darkshore: [1685, 52477], undercity: [1545, 12554], barrens: [1414, 41038], darnassus: [1354, 7775],
    silverpine: [932, 12286], 'loch-modan': [830, 9085], westfall: [418, 8697], duskwood: [81, 1930],
    alterac: [8, 7357],
  },
  'mud-snapper': {
    stormwind: [26610, 46220], orgrimmar: [18404, 29601], 'thunder-bluff': [14148, 22829], elwynn: [10601, 26934],
    zephras: [7722, 19447], ironforge: [7577, 11865], redridge: [5955, 17540], darkshore: [5921, 52477],
    undercity: [5463, 12554], mulgore: [5422, 13433], tirisfal: [4933, 16037], darnassus: [4874, 7775],
    stonetalon: [4727, 20100], barrens: [4583, 41038], ashenvale: [4250, 17623], 'dun-morogh': [4125, 10645],
    silverpine: [3255, 12286], 'loch-modan': [2910, 9085], hillsbrad: [2287, 24868], teldrassil: [1696, 8544],
    durotar: [1564, 8596], westfall: [1539, 8697], duskwood: [664, 1930], wetlands: [498, 12263],
    alterac: [96, 7357], arathi: [14, 5876], azshara: [5, 1483], silithus: [4, 978],
  },
  mackerel: {
    darkshore: [7625, 52477], barrens: [6305, 41038], durotar: [4803, 8596], teldrassil: [4462, 8544],
    stormwind: [1377, 46220], westfall: [936, 8697], silverpine: [637, 12286], tirisfal: [189, 16037],
  },
  catfish: {
    redridge: [10897, 17540], stormwind: [9677, 46220], stonetalon: [8573, 20100], ashenvale: [7788, 17623],
    orgrimmar: [6850, 29601], 'thunder-bluff': [5136, 22829], hillsbrad: [4203, 24868], dustwallow: [3621, 25083],
    desolace: [3281, 12661], ironforge: [2784, 11865], stv: [2590, 54457], darkshore: [2112, 52477],
    arathi: [1960, 5876], undercity: [1943, 12554], darnassus: [1754, 7775], barrens: [1600, 41038],
    alterac: [1520, 7357], duskwood: [1190, 1930], silverpine: [1171, 12286], 'loch-modan': [1061, 9085],
    wetlands: [964, 12263], westfall: [770, 8697], riverglades: [583, 10677], 'thousand-needles': [485, 1405],
    'swamp-of-sorrows': [171, 2003], durotar: [23, 8596], tirisfal: [21, 16037], 'dun-morogh': [6, 10645],
    silithus: [3, 978],
  },
  albacore: {
    darkshore: [11031, 52477], barrens: [9633, 41038], wetlands: [5630, 12263], hillsbrad: [3313, 24868],
    ashenvale: [2827, 17623], stormwind: [2007, 46220], westfall: [1338, 8697], silverpine: [1031, 12286],
  },
  'loch-frenzy': {
    'loch-modan': [2006, 9085],
  },
  deviate: {
    barrens: [6196, 41038], silithus: [6, 978],
  },
  sagefish: {
    hillsbrad: [8806, 24868], stonetalon: [3444, 20100], ashenvale: [2336, 17623], 'loch-modan': [2034, 9085],
    silverpine: [1889, 12286],
  },
  'greater-sagefish': {
    alterac: [3192, 7357], stv: [2403, 54457], riverglades: [1671, 10677], silverpine: [7, 12286],
  },
  blackmouth: {
    barrens: [8219, 41038], stv: [7126, 54457], darkshore: [6429, 52477], wetlands: [2909, 12263],
    westfall: [2828, 8697], hillsbrad: [2602, 24868], dustwallow: [2548, 25083], ungoro: [1773, 17774],
    riverglades: [1424, 10677], silverpine: [1190, 12286], ashenvale: [1103, 17623], feralas: [971, 8092],
    tanaris: [835, 12207], desolace: [717, 12661], stormwind: [602, 46220], 'swamp-of-sorrows': [225, 2003],
    'western-plaguelands': [189, 1584], moonglade: [134, 791], 'eastern-plaguelands': [129, 28285],
    arathi: [85, 5876], hinterlands: [72, 1228], azshara: [44, 1483], felwood: [6, 29],
  },
  firefin: {
    stv: [7775, 54457], dustwallow: [2865, 25083], stonetalon: [2157, 20100], wetlands: [2048, 12263],
    tanaris: [1923, 12207], hillsbrad: [1734, 24868], riverglades: [1349, 10677], desolace: [1007, 12661],
    ashenvale: [447, 17623], barrens: [233, 41038], 'swamp-of-sorrows': [200, 2003], feralas: [188, 8092],
    azshara: [138, 1483], arathi: [102, 5876], hinterlands: [60, 1228], 'mount-hyjal': [39, 2247],
  },
  eel: {
    tanaris: [1811, 12207], stv: [1311, 54457], riverglades: [1116, 10677], feralas: [229, 8092],
    azshara: [200, 1483], hinterlands: [44, 1228],
  },
  trout: {
    dustwallow: [6549, 25083], desolace: [5900, 12661], stv: [4714, 54457], arathi: [3638, 5876],
    alterac: [2377, 7357], ungoro: [1818, 17774], riverglades: [987, 10677], 'thousand-needles': [915, 1405],
    feralas: [817, 8092], 'swamp-of-sorrows': [336, 2003], 'western-plaguelands': [173, 1584],
    'eastern-plaguelands': [139, 28285], moonglade: [114, 791], hinterlands: [73, 1228], ashenvale: [17, 17623],
    azshara: [14, 1483], duskwood: [3, 1930],
  },
  cod: {
    stv: [18306, 54457], dustwallow: [9000, 25083], riverglades: [2398, 10677], desolace: [1120, 12661],
    tanaris: [1105, 12207], 'swamp-of-sorrows': [1030, 2003], arathi: [238, 5876], azshara: [108, 1483],
    feralas: [91, 8092], hinterlands: [40, 1228],
  },
  yellowtail: {
    stv: [6517, 54457], tanaris: [4454, 12207], dustwallow: [3290, 25083], riverglades: [848, 10677],
    azshara: [475, 1483], feralas: [440, 8092], desolace: [438, 12661], 'swamp-of-sorrows': [343, 2003],
    hinterlands: [190, 1228], arathi: [80, 5876],
  },
  redgill: {
    feralas: [3899, 8092], winterspring: [2375, 47183], 'western-plaguelands': [701, 1584], moonglade: [617, 791],
    hinterlands: [325, 1228], 'mount-hyjal': [160, 2247], azshara: [107, 1483], ashenvale: [59, 17623],
    silithus: [40, 978], 'swamp-of-sorrows': [34, 25791], felwood: [17, 29], 'eastern-plaguelands': [3, 81],
  },
  nightfin: {
    winterspring: [9356, 47183], ungoro: [3846, 17774], feralas: [919, 8092], 'mount-hyjal': [261, 2247],
    moonglade: [192, 791], 'western-plaguelands': [122, 1584], silithus: [60, 978], azshara: [17, 1483],
    'deadwind-pass': [11, 43], ashenvale: [11, 17623], hinterlands: [9, 1228], felwood: [5, 29],
  },
  sunscale: {
    winterspring: [4982, 47183], feralas: [1234, 8092], ungoro: [1117, 17774], 'mount-hyjal': [527, 2247],
    'western-plaguelands': [348, 1584], hinterlands: [214, 1228], silithus: [214, 978], moonglade: [170, 791],
    'eastern-plaguelands': [30, 81], azshara: [15, 1483], ashenvale: [10, 17623], felwood: [7, 29],
  },
  whitescale: {
    winterspring: [18577, 47183], 'mount-hyjal': [1039, 2247], silithus: [365, 978],
    'eastern-plaguelands': [35, 81], 'deadwind-pass': [16, 43],
  },
  mightfish: {
    tanaris: [1108, 12207], azshara: [150, 1483], feralas: [115, 8092], hinterlands: [41, 1228],
  },
  'large-mightfish': {
    azshara: [4, 1483],
  },
  // summer-bass: Wowhead has no "Fished in" data for it.
  'winter-squid': {
    tanaris: [1137, 12207], feralas: [99, 8092], azshara: [98, 1483], hinterlands: [58, 1228],
  },
  lobster: {
    azshara: [14, 1483],
  },
  'lightning-eel': {
    winterspring: [3218, 47183], azshara: [1043, 1086748], felwood: [387, 27088], 'mount-hyjal': [348, 2247],
    feralas: [257, 8092], ungoro: [153, 17774], silithus: [130, 978], 'western-plaguelands': [96, 1584],
    hinterlands: [77, 1228], moonglade: [32, 791], 'eastern-plaguelands': [21, 81],
  },
  armorfish: {
    winterspring: [8201, 47183], 'mount-hyjal': [323, 2247], silithus: [109, 978], 'deadwind-pass': [15, 43],
    'eastern-plaguelands': [6, 81],
  },
  clam: {
    tanaris: [960, 12207], feralas: [119, 8092], azshara: [57, 1483], hinterlands: [54, 1228],
  },
  ahi: {
    feralas: [213, 8092],
  },
  mahi: {
    'swamp-of-sorrows': [206, 2003],
  },
  striker: {
    desolace: [200, 12661],
  },
  sailfin: {
    stv: [212, 54457],
  },
  tastyfish: {
    stv: [1753, 54457],
  },
}

/** container id -> zone id -> report */
export const CONTAINER_REPORTS: Reports = {
  'message-in-a-bottle': {
    darkshore: [105, 52477], barrens: [95, 41038], wetlands: [50, 12263], ashenvale: [26, 17623],
    stormwind: [25, 46220], hillsbrad: [24, 24868], westfall: [13, 8697], silverpine: [12, 12286],
  },
  'dented-crate': {
    darkshore: [133, 52477], barrens: [94, 41038], westfall: [15, 8697], stormwind: [14, 46220],
    silverpine: [8, 12286],
  },
  'waterlogged-crate': {
    wetlands: [49, 12263], ashenvale: [18, 17623], hillsbrad: [17, 24868],
  },
  'sealed-crate': {
    stv: [179, 54457], dustwallow: [86, 25083], riverglades: [22, 10677], tanaris: [16, 377316],
    desolace: [11, 12661], 'swamp-of-sorrows': [10, 2003],
  },
  'heavy-crate': {
    hinterlands: [183, 169085], tanaris: [29, 12207],
  },
  'small-chest': {
    darkshore: [127, 52477], barrens: [109, 41038], stormwind: [27, 46220], westfall: [11, 8697],
    silverpine: [10, 12286],
  },
  'small-locked-chest': {
    wetlands: [39, 12263], ashenvale: [27, 17623], hillsbrad: [23, 24868],
  },
  'sturdy-locked-chest': {
    stv: [184, 54457], dustwallow: [69, 25083], riverglades: [20, 10677], tanaris: [13, 377316],
    'swamp-of-sorrows': [11, 2003], desolace: [10, 12661],
  },
  'battered-chest': {
    durotar: [91, 8596], teldrassil: [74, 8544], tirisfal: [9, 16037],
  },
  'ironbound-locked-chest': {
    hinterlands: [264, 169085], tanaris: [44, 12207], azshara: [4, 1483], feralas: [3, 8092],
  },
  // reinforced-locked-chest: Wowhead has no "Fished in" data for it; containers.ts keeps the Classic zone.
  'watertight-trunk': {
    hillsbrad: [1595, 24868], stonetalon: [1033, 20100], wetlands: [385, 12263], ashenvale: [185, 17623],
  },
  'iron-bound-trunk': {
    stv: [1824, 54457], alterac: [536, 7357], dustwallow: [438, 25083], desolace: [290, 12661],
    barrens: [198, 41038], riverglades: [163, 10677], arathi: [28, 5876],
  },
  'mithril-bound-trunk': {
    stv: [1626, 54457], tanaris: [737, 12207], riverglades: [572, 10677], feralas: [183, 8092],
    azshara: [78, 1483], 'mount-hyjal': [5, 2247],
  },
  'tightly-sealed-trunk': {
    barrens: [1832, 41038], darkshore: [954, 52477], westfall: [643, 8697], silverpine: [598, 12286],
    'loch-modan': [338, 9085], redridge: [72, 17540],
  },
  'bloated-smallfish': {
    elwynn: [25, 26934], zephras: [23, 19447], tirisfal: [16, 16037], 'dun-morogh': [13, 10645],
    mulgore: [13, 13433], durotar: [5, 8596], teldrassil: [3, 8544],
  },
  'bloated-mud-snapper': {
    stormwind: [21, 46220], orgrimmar: [14, 29601], 'thunder-bluff': [10, 22829], undercity: [9, 12554],
    ironforge: [9, 11865], barrens: [7, 41038], darkshore: [6, 52477], darnassus: [3, 7775],
  },
  'bloated-catfish': {
    stonetalon: [8, 20100], redridge: [7, 17540], hillsbrad: [7, 24868], ashenvale: [6, 17623],
  },
  'bloated-trout': {
    stv: [13, 54457], arathi: [6, 5876], desolace: [4, 12661], dustwallow: [3, 25083],
  },
  'bloated-redgill': {
    hinterlands: [26, 169085], moonglade: [23, 791], hillsbrad: [20, 24868], feralas: [19, 8092],
    stonetalon: [18, 20100], felwood: [6, 27088], 'western-plaguelands': [5, 1584], ashenvale: [4, 17623],
    ungoro: [3, 17774],
  },
  'bloated-salmon': {
    'mount-hyjal': [15, 2247], winterspring: [12, 47183], 'eastern-plaguelands': [6, 28285], feralas: [6, 534356],
    'deadwind-pass': [5, 22586],
  },
}
