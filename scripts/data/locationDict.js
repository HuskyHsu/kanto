export const METHOD_MAP = {
  walk: { zh: '草叢/走路', en: 'Walk' },
  surf: { zh: '衝浪', en: 'Surf' },
  'old-rod': { zh: '破舊釣竿', en: 'Old Rod' },
  'good-rod': { zh: '好釣竿', en: 'Good Rod' },
  'super-rod': { zh: '厲害釣竿', en: 'Super Rod' },
  'rock-smash': { zh: '碎岩', en: 'Rock Smash' },
  gift: { zh: '贈送/領取', en: 'Gift' },
  'gift-egg': { zh: '贈送蛋', en: 'Gift Egg' },
  static: { zh: '定點遭遇', en: 'Stationary' },
  'only-one': { zh: '定點遭遇', en: 'Stationary' },
  pokeflute: { zh: '寶可夢之笛', en: 'Poké Flute' },
  'npc-trade': { zh: 'NPC交換', en: 'In-game Trade' },
  trade: { zh: 'NPC交換', en: 'In-game Trade' },
  'roaming-grass': { zh: '全境遊走', en: 'Roaming' },
  'colosseum-bonus-disc-jpn': { zh: '特殊活動/連動', en: 'Special Event' },
};

export const TRADE_CONDITION_MAP = {
  'trade-abra': { pid: 63, name: { zh: '凱西', ja: 'ケーシィ', en: 'Abra' } },
  'trade-spearow': { pid: 21, name: { zh: '烈雀', ja: 'オニスズメ', en: 'Spearow' } },
  'trade-poliwhirl': { pid: 61, name: { zh: '蚊香君', ja: 'ニョロゾ', en: 'Poliwhirl' } },
  'trade-ponyta': { pid: 77, name: { zh: '小火馬', ja: 'ポニータ', en: 'Ponyta' } },
  'trade-raichu': { pid: 26, name: { zh: '雷丘', ja: 'ライチュウ', en: 'Raichu' } },
  'trade-venonat': { pid: 48, name: { zh: '毛球', ja: 'コンパン', en: 'Venonat' } },
  'trade-golduck': { pid: 55, name: { zh: '哥達鴨', ja: 'ゴルダック', en: 'Golduck' } },
  'trade-slowbro': { pid: 80, name: { zh: '呆殼獸', ja: 'ヤドラン', en: 'Slowbro' } },
  'trade-nidoran-m': { pid: 32, name: { zh: '尼多朗', ja: 'ニドラン♂', en: 'Nidoran♂' } },
  'trade-nidoran-f': { pid: 29, name: { zh: '尼多蘭', ja: 'ニドラン♀', en: 'Nidoran♀' } },
  'trade-nidorino': { pid: 33, name: { zh: '尼多力諾', ja: 'ニドリーノ', en: 'Nidorino' } },
  'trade-nidorina': { pid: 30, name: { zh: '尼多娜', ja: 'ニドリーナ', en: 'Nidorina' } },
};

/**
 * Returns structured location info for any FRLG PokeAPI location area slug
 */
export function resolveLocationArea(slug) {
  // 1. Kanto Routes 1-25
  const routeMatch = slug.match(/^kanto-route-(\d+)(.*)$/);
  if (routeMatch) {
    const num = parseInt(routeMatch[1], 10);
    const suffix = routeMatch[2];
    let areaZh = '全域';
    let areaEn = 'Area';
    if (suffix.includes('north')) {
      areaZh = '北側草叢';
      areaEn = 'North';
    } else if (suffix.includes('south')) {
      areaZh = '南側草叢';
      areaEn = 'South';
    } else if (suffix.includes('pokemon-center')) {
      areaZh = '寶可夢中心';
      areaEn = 'Pokémon Center';
    }

    return {
      locationId: `route-${num}`,
      locationName: { zh: `${num}號道路`, en: `Route ${num}`, ja: `${num}ばんどうろ` },
      areaName: { zh: areaZh, en: areaEn },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'route',
    };
  }

  // 2. Kanto Sea Routes 19-21
  const seaRouteMatch = slug.match(/^kanto-sea-route-(\d+)/);
  if (seaRouteMatch) {
    const num = parseInt(seaRouteMatch[1], 10);
    return {
      locationId: `route-${num}`,
      locationName: { zh: `${num}號水路`, en: `Route ${num}`, ja: `${num}ばんすいどう` },
      areaName: { zh: '水域', en: 'Water' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'route',
    };
  }

  // 3. Custom / Specific areas
  const specificMap = {
    // Pallet Town
    'pallet-town-area': {
      locationId: 'pallet-town',
      locationName: { zh: '真新鎮', en: 'Pallet Town', ja: 'マサラタウン' },
      areaName: { zh: '研究所/水域', en: 'Town / Lab' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    // Viridian City
    'viridian-city-area': {
      locationId: 'viridian-city',
      locationName: { zh: '常青市', en: 'Viridian City', ja: 'トキワシティ' },
      areaName: { zh: '水域', en: 'Water' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    // Viridian Forest
    'viridian-forest-area': {
      locationId: 'viridian-forest',
      locationName: { zh: '常青森林', en: 'Viridian Forest', ja: 'トキワのもり' },
      areaName: { zh: '全域', en: 'Forest' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Mt. Moon
    'mt-moon-1f': {
      locationId: 'mt-moon',
      locationName: { zh: '月見山', en: 'Mt. Moon', ja: 'オツキミやま' },
      areaName: { zh: '1F', en: '1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'mt-moon-b1f': {
      locationId: 'mt-moon',
      locationName: { zh: '月見山', en: 'Mt. Moon', ja: 'オツキミやま' },
      areaName: { zh: 'B1F', en: 'B1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'mt-moon-b2f': {
      locationId: 'mt-moon',
      locationName: { zh: '月見山', en: 'Mt. Moon', ja: 'オツキミやま' },
      areaName: { zh: 'B2F', en: 'B2F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Cerulean City
    'cerulean-city-area': {
      locationId: 'cerulean-city',
      locationName: { zh: '華藍市', en: 'Cerulean City', ja: 'ハナダシティ' },
      areaName: { zh: '水域', en: 'Water' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    // Cerulean Cave
    'cerulean-cave-1f': {
      locationId: 'cerulean-cave',
      locationName: { zh: '華藍洞窟', en: 'Cerulean Cave', ja: 'ハナダのどうくつ' },
      areaName: { zh: '1F', en: '1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'cerulean-cave-2f': {
      locationId: 'cerulean-cave',
      locationName: { zh: '華藍洞窟', en: 'Cerulean Cave', ja: 'ハナダのどうくつ' },
      areaName: { zh: '2F', en: '2F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'cerulean-cave-b1f': {
      locationId: 'cerulean-cave',
      locationName: { zh: '華藍洞窟', en: 'Cerulean Cave', ja: 'ハナダのどうくつ' },
      areaName: { zh: 'B1F (超夢)', en: 'B1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Diglett's Cave
    'digletts-cave-area': {
      locationId: 'digletts-cave',
      locationName: { zh: '地鼠洞穴', en: "Diglett's Cave", ja: 'ディグダのあな' },
      areaName: { zh: '全域', en: 'Cave' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Vermilion City
    'vermilion-city-area': {
      locationId: 'vermilion-city',
      locationName: { zh: '枯葉市', en: 'Vermilion City', ja: 'クチバシティ' },
      areaName: { zh: '港口水域', en: 'Harbor' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    // SS Anne
    'ss-anne-area': {
      locationId: 'ss-anne',
      locationName: { zh: '聖特安努號', en: 'S.S. Anne', ja: 'サント・アンヌごう' },
      areaName: { zh: '船艙', en: 'Ship' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'special',
    },
    // Rock Tunnel
    'rock-tunnel-1f': {
      locationId: 'rock-tunnel',
      locationName: { zh: '岩山隧道', en: 'Rock Tunnel', ja: 'イワヤマトンネル' },
      areaName: { zh: '1F', en: '1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'rock-tunnel-b1f': {
      locationId: 'rock-tunnel',
      locationName: { zh: '岩山隧道', en: 'Rock Tunnel', ja: 'イワヤマトンネル' },
      areaName: { zh: 'B1F', en: 'B1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Power Plant
    'kanto-power-plant-area': {
      locationId: 'power-plant',
      locationName: { zh: '無人發電廠', en: 'Power Plant', ja: 'むじんはつでんしょ' },
      areaName: { zh: '發電廠內部 (閃電鳥)', en: 'Inside' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Pokémon Tower
    'pokemon-tower-3f': {
      locationId: 'pokemon-tower',
      locationName: { zh: '寶可夢塔', en: 'Pokémon Tower', ja: 'ポケモンタワー' },
      areaName: { zh: '3F', en: '3F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'pokemon-tower-4f': {
      locationId: 'pokemon-tower',
      locationName: { zh: '寶可夢塔', en: 'Pokémon Tower', ja: 'ポケモンタワー' },
      areaName: { zh: '4F', en: '4F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'pokemon-tower-5f': {
      locationId: 'pokemon-tower',
      locationName: { zh: '寶可夢塔', en: 'Pokémon Tower', ja: 'ポケモンタワー' },
      areaName: { zh: '5F', en: '5F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'pokemon-tower-6f': {
      locationId: 'pokemon-tower',
      locationName: { zh: '寶可夢塔', en: 'Pokémon Tower', ja: 'ポケモンタワー' },
      areaName: { zh: '6F', en: '6F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'pokemon-tower-7f': {
      locationId: 'pokemon-tower',
      locationName: { zh: '寶可夢塔', en: 'Pokémon Tower', ja: 'ポケモンタワー' },
      areaName: { zh: '7F', en: '7F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Celadon City
    'celadon-city-area': {
      locationId: 'celadon-city',
      locationName: { zh: '玉虹市', en: 'Celadon City', ja: 'タマムシシティ' },
      areaName: { zh: '水池水域', en: 'Pond' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    'celadon-city-celadon-mansion': {
      locationId: 'celadon-city',
      locationName: { zh: '玉虹市', en: 'Celadon City', ja: 'タマムシシティ' },
      areaName: { zh: '玉虹大廈 (伊布)', en: 'Celadon Mansion' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    'celadon-city-prize-corner': {
      locationId: 'celadon-city',
      locationName: { zh: '玉虹市', en: 'Celadon City', ja: 'タマムシシティ' },
      areaName: { zh: '遊戲城兌換處', en: 'Prize Corner' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    // Saffron City
    'saffron-city-fighting-dojo': {
      locationId: 'saffron-city',
      locationName: { zh: '金黃市', en: 'Saffron City', ja: 'ヤマブキシティ' },
      areaName: { zh: '格鬥道館', en: 'Fighting Dojo' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    'saffron-city-silph-co-7f': {
      locationId: 'saffron-city',
      locationName: { zh: '金黃市', en: 'Saffron City', ja: 'ヤマブキシティ' },
      areaName: { zh: '西爾佛公司 7F (拉普拉斯)', en: 'Silph Co. 7F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    // Fuchsia City
    'fuchsia-city-area': {
      locationId: 'fuchsia-city',
      locationName: { zh: '淺紅市', en: 'Fuchsia City', ja: 'セキチクシティ' },
      areaName: { zh: '釣魚/水池', en: 'Water' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    // Safari Zone
    'kanto-safari-zone-middle': {
      locationId: 'safari-zone',
      locationName: { zh: '原野區', en: 'Safari Zone', ja: 'サファリゾーン' },
      areaName: { zh: '中央區域', en: 'Center Area' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'kanto-safari-zone-area-1-east': {
      locationId: 'safari-zone',
      locationName: { zh: '原野區', en: 'Safari Zone', ja: 'サファリゾーン' },
      areaName: { zh: '區域 1 (東側)', en: 'Area 1 (East)' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'kanto-safari-zone-area-2-north': {
      locationId: 'safari-zone',
      locationName: { zh: '原野區', en: 'Safari Zone', ja: 'サファリゾーン' },
      areaName: { zh: '區域 2 (北側)', en: 'Area 2 (North)' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'kanto-safari-zone-area-3-west': {
      locationId: 'safari-zone',
      locationName: { zh: '原野區', en: 'Safari Zone', ja: 'サファリゾーン' },
      areaName: { zh: '區域 3 (西側)', en: 'Area 3 (West)' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Seafoam Islands
    'seafoam-islands-1f': {
      locationId: 'seafoam-islands',
      locationName: { zh: '雙子島', en: 'Seafoam Islands', ja: 'ふたごじま' },
      areaName: { zh: '1F', en: '1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'seafoam-islands-b1f': {
      locationId: 'seafoam-islands',
      locationName: { zh: '雙子島', en: 'Seafoam Islands', ja: 'ふたごじま' },
      areaName: { zh: 'B1F', en: 'B1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'seafoam-islands-b2f': {
      locationId: 'seafoam-islands',
      locationName: { zh: '雙子島', en: 'Seafoam Islands', ja: 'ふたごじま' },
      areaName: { zh: 'B2F', en: 'B2F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'seafoam-islands-b3f': {
      locationId: 'seafoam-islands',
      locationName: { zh: '雙子島', en: 'Seafoam Islands', ja: 'ふたごじま' },
      areaName: { zh: 'B3F', en: 'B3F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'seafoam-islands-b4f': {
      locationId: 'seafoam-islands',
      locationName: { zh: '雙子島', en: 'Seafoam Islands', ja: 'ふたごじま' },
      areaName: { zh: 'B4F (急凍鳥)', en: 'B4F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Cinnabar Island
    'cinnabar-island-area': {
      locationId: 'cinnabar-island',
      locationName: { zh: '紅蓮鎮', en: 'Cinnabar Island', ja: 'グレンじま' },
      areaName: { zh: '周邊水域', en: 'Water' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    'cinnabar-island-cinnabar-lab': {
      locationId: 'cinnabar-island',
      locationName: { zh: '紅蓮鎮', en: 'Cinnabar Island', ja: 'グレンじま' },
      areaName: { zh: '紅蓮研究所 (化石復活)', en: 'Cinnabar Lab' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'city',
    },
    // Pokémon Mansion
    'pokemon-mansion-1f': {
      locationId: 'pokemon-mansion',
      locationName: { zh: '寶可夢屋', en: 'Pokémon Mansion', ja: 'ポケモンやしき' },
      areaName: { zh: '1F', en: '1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'pokemon-mansion-2f': {
      locationId: 'pokemon-mansion',
      locationName: { zh: '寶可夢屋', en: 'Pokémon Mansion', ja: 'ポケモンやしき' },
      areaName: { zh: '2F', en: '2F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'pokemon-mansion-3f': {
      locationId: 'pokemon-mansion',
      locationName: { zh: '寶可夢屋', en: 'Pokémon Mansion', ja: 'ポケモンやしき' },
      areaName: { zh: '3F', en: '3F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'pokemon-mansion-b1f': {
      locationId: 'pokemon-mansion',
      locationName: { zh: '寶可夢屋', en: 'Pokémon Mansion', ja: 'ポケモンやしき' },
      areaName: { zh: 'B1F', en: 'B1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Victory Road
    'kanto-victory-road-2-1f': {
      locationId: 'victory-road',
      locationName: { zh: '冠軍之路', en: 'Victory Road', ja: 'チャンピオンロード' },
      areaName: { zh: '1F', en: '1F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'kanto-victory-road-2-2f': {
      locationId: 'victory-road',
      locationName: { zh: '冠軍之路', en: 'Victory Road', ja: 'チャンピオンロード' },
      areaName: { zh: '2F (火焰鳥)', en: '2F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    'kanto-victory-road-2-3f': {
      locationId: 'victory-road',
      locationName: { zh: '冠軍之路', en: 'Victory Road', ja: 'チャンピオンロード' },
      areaName: { zh: '3F', en: '3F' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'dungeon',
    },
    // Underground Path & Centers
    'kanto-underground-path-area': {
      locationId: 'underground-path',
      locationName: { zh: '地下通道', en: 'Underground Path', ja: 'ちかつうろ' },
      areaName: { zh: '通道', en: 'Path' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'special',
    },
    'kanto-pokecenter-area': {
      locationId: 'pokecenter',
      locationName: { zh: '寶可夢中心', en: 'Pokémon Center', ja: 'ポケモンセンター' },
      areaName: { zh: '大廳', en: 'Lobby' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'special',
    },
    'roaming-kanto-area': {
      locationId: 'roaming-kanto',
      locationName: { zh: '關都全境遊走', en: 'Roaming Kanto', ja: 'カントーはいかい' },
      areaName: { zh: '遊走草叢 (三聖獸)', en: 'Roaming Grass' },
      region: 'kanto',
      subRegion: 'kanto',
      category: 'special',
    },

    // --- Sevii Islands (七之島) ---
    // One Island
    'one-island-area': {
      locationId: 'one-island-town',
      locationName: { zh: '一之島 (鎮上)', en: 'One Island (Town)', ja: '1のしま' },
      areaName: { zh: '碼頭水域', en: 'Town / Water' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'city',
    },
    'treasure-beach-area': {
      locationId: 'treasure-beach',
      locationName: { zh: '寶可夢之鄉 (珍寶海灘)', en: 'Treasure Beach', ja: 'たからのはま' },
      areaName: { zh: '海灘/草叢/水域', en: 'Beach' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'route',
    },
    'kindle-road-area': {
      locationId: 'kindle-road',
      locationName: { zh: '火紅步道 (燈火山道路)', en: 'Kindle Road', ja: 'ともしびおおかみ' },
      areaName: { zh: '草叢/碎岩/水域', en: 'Road' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'route',
    },
    'mt-ember-area': {
      locationId: 'mt-ember',
      locationName: { zh: '燈火山', en: 'Mt. Ember', ja: 'ともしびやま' },
      areaName: { zh: '外圍山路', en: 'Exterior' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'dungeon',
    },
    'mt-ember-1f-cave-behind-team-rocket': {
      locationId: 'mt-ember',
      locationName: { zh: '燈火山', en: 'Mt. Ember', ja: 'ともしびやま' },
      areaName: { zh: '火箭隊後方洞窟 1F', en: 'Rocket Cave 1F' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'dungeon',
    },
    'mt-ember-b1f': {
      locationId: 'mt-ember',
      locationName: { zh: '燈火山', en: 'Mt. Ember', ja: 'ともしびやま' },
      areaName: { zh: 'B1F', en: 'B1F' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'dungeon',
    },
    'mt-ember-b2f': {
      locationId: 'mt-ember',
      locationName: { zh: '燈火山', en: 'Mt. Ember', ja: 'ともしびやま' },
      areaName: { zh: 'B2F', en: 'B2F' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'dungeon',
    },
    'mt-ember-b3f': {
      locationId: 'mt-ember',
      locationName: { zh: '燈火山', en: 'Mt. Ember', ja: 'ともしびやま' },
      areaName: { zh: 'B3F', en: 'B3F' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'dungeon',
    },
    'mt-ember-cave': {
      locationId: 'mt-ember',
      locationName: { zh: '燈火山', en: 'Mt. Ember', ja: 'ともしびやま' },
      areaName: { zh: '山洞', en: 'Cave' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'dungeon',
    },
    'mt-ember-inside': {
      locationId: 'mt-ember',
      locationName: { zh: '燈火山', en: 'Mt. Ember', ja: 'ともしびやま' },
      areaName: { zh: '內部熔岩', en: 'Inside' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'dungeon',
    },
    'mt-ember-summit': {
      locationId: 'mt-ember',
      locationName: { zh: '燈火山', en: 'Mt. Ember', ja: 'ともしびやま' },
      areaName: { zh: '山頂 (火焰鳥)', en: 'Summit' },
      region: 'sevii',
      subRegion: 'one-island',
      category: 'dungeon',
    },

    // Two Island
    'cape-brink-area': {
      locationId: 'cape-brink',
      locationName: { zh: '盡頭角', en: 'Cape Brink', ja: 'きわのみさき' },
      areaName: { zh: '草叢/池塘水域', en: 'Cape' },
      region: 'sevii',
      subRegion: 'two-island',
      category: 'route',
    },

    // Three Island
    'bond-bridge-area': {
      locationId: 'bond-bridge',
      locationName: { zh: '牽絆之橋', en: 'Bond Bridge', ja: 'きずなばし' },
      areaName: { zh: '草叢/水域', en: 'Bridge' },
      region: 'sevii',
      subRegion: 'three-island',
      category: 'route',
    },
    'berry-forest-area': {
      locationId: 'berry-forest',
      locationName: { zh: '樹果森林', en: 'Berry Forest', ja: 'きのみのもり' },
      areaName: { zh: '森林草叢/水域', en: 'Forest' },
      region: 'sevii',
      subRegion: 'three-island',
      category: 'dungeon',
    },
    'three-isle-port-area': {
      locationId: 'three-isle-port',
      locationName: { zh: '三之島港口', en: 'Three Isle Port', ja: '3のしまみなと' },
      areaName: { zh: '港口草叢', en: 'Port' },
      region: 'sevii',
      subRegion: 'three-island',
      category: 'city',
    },

    // Four Island
    'four-island-area': {
      locationId: 'four-island-town',
      locationName: { zh: '四之島 (鎮上)', en: 'Four Island (Town)', ja: '4のしま' },
      areaName: { zh: '城鎮水池', en: 'Town Pond' },
      region: 'sevii',
      subRegion: 'four-island',
      category: 'city',
    },
    'icefall-cave-entrance': {
      locationId: 'icefall-cave',
      locationName: { zh: '凍瀑洞窟', en: 'Icefall Cave', ja: 'いてだきのどうくつ' },
      areaName: { zh: '洞窟入口', en: 'Entrance' },
      region: 'sevii',
      subRegion: 'four-island',
      category: 'dungeon',
    },
    'icefall-cave-1f': {
      locationId: 'icefall-cave',
      locationName: { zh: '凍瀑洞窟', en: 'Icefall Cave', ja: 'いてだきのどうくつ' },
      areaName: { zh: '1F', en: '1F' },
      region: 'sevii',
      subRegion: 'four-island',
      category: 'dungeon',
    },
    'icefall-cave-b1f': {
      locationId: 'icefall-cave',
      locationName: { zh: '凍瀑洞窟', en: 'Icefall Cave', ja: 'いてだきのどうくつ' },
      areaName: { zh: 'B1F (冰層)', en: 'B1F' },
      region: 'sevii',
      subRegion: 'four-island',
      category: 'dungeon',
    },
    'icefall-cave-waterfall': {
      locationId: 'icefall-cave',
      locationName: { zh: '凍瀑洞窟', en: 'Icefall Cave', ja: 'いてだきのどうくつ' },
      areaName: { zh: '最深處瀑布 (拉普拉斯)', en: 'Waterfall Cave' },
      region: 'sevii',
      subRegion: 'four-island',
      category: 'dungeon',
    },

    // Five Island
    'five-island-area': {
      locationId: 'five-island-town',
      locationName: { zh: '五之島 (鎮上)', en: 'Five Island (Town)', ja: '5のしま' },
      areaName: { zh: '水域', en: 'Town Water' },
      region: 'sevii',
      subRegion: 'five-island',
      category: 'city',
    },
    'five-isle-meadow-area': {
      locationId: 'five-isle-meadow',
      locationName: { zh: '五之島草地', en: 'Five Isle Meadow', ja: '5のしまあきち' },
      areaName: { zh: '草叢/沿岸水域', en: 'Meadow' },
      region: 'sevii',
      subRegion: 'five-island',
      category: 'route',
    },
    'memorial-pillar-area': {
      locationId: 'memorial-pillar',
      locationName: { zh: '追憶之塔', en: 'Memorial Pillar', ja: 'おもいでのとう' },
      areaName: { zh: '草叢/水域', en: 'Pillar' },
      region: 'sevii',
      subRegion: 'five-island',
      category: 'route',
    },
    'water-labyrinth-area': {
      locationId: 'water-labyrinth',
      locationName: { zh: '水之迷宮', en: 'Water Labyrinth', ja: 'みずのラビリンス' },
      areaName: { zh: '海域', en: 'Labyrinth' },
      region: 'sevii',
      subRegion: 'five-island',
      category: 'route',
    },
    'resort-gorgeous-area': {
      locationId: 'resort-gorgeous',
      locationName: { zh: '豪華度假企劃 (高級度假村)', en: 'Resort Gorgeous', ja: 'ゴージャスリゾート' },
      areaName: { zh: '海域/小島', en: 'Resort' },
      region: 'sevii',
      subRegion: 'five-island',
      category: 'route',
    },
    // Lost Cave
    'lost-cave-room-1': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 1', en: 'Room 1' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-room-2': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 2', en: 'Room 2' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-room-3': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 3', en: 'Room 3' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-room-4': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 4', en: 'Room 4' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-room-5': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 5', en: 'Room 5' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-room-6': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 6', en: 'Room 6' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-room-7': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 7', en: 'Room 7' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-room-8': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 8', en: 'Room 8' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-room-9': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 9', en: 'Room 9' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-room-10': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '房間 10 (小姐房間)', en: 'Room 10' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },
    'lost-cave-item-rooms': { locationId: 'lost-cave', locationName: { zh: '不歸之洞', en: 'Lost Cave', ja: 'かえらずのあな' }, areaName: { zh: '道具房間', en: 'Item Rooms' }, region: 'sevii', subRegion: 'five-island', category: 'dungeon' },

    // Six Island
    'water-path-area': {
      locationId: 'water-path',
      locationName: { zh: '水之步道', en: 'Water Path', ja: 'みずのさんぽみち' },
      areaName: { zh: '草叢/水域', en: 'Path' },
      region: 'sevii',
      subRegion: 'six-island',
      category: 'route',
    },
    'ruin-valley-area': {
      locationId: 'ruin-valley',
      locationName: { zh: '遺蹟谷', en: 'Ruin Valley', ja: 'いせきのたに' },
      areaName: { zh: '草叢/水域', en: 'Valley' },
      region: 'sevii',
      subRegion: 'six-island',
      category: 'route',
    },
    'green-path-area': {
      locationId: 'green-path',
      locationName: { zh: '綠色步道', en: 'Green Path', ja: 'みどりのさんぽみち' },
      areaName: { zh: '草叢/水域', en: 'Path' },
      region: 'sevii',
      subRegion: 'six-island',
      category: 'route',
    },
    'pattern-bush-area': {
      locationId: 'pattern-bush',
      locationName: { zh: '記號森林', en: 'Pattern Bush', ja: 'しるしづくりのもり' },
      areaName: { zh: '蟲類草叢', en: 'Bush' },
      region: 'sevii',
      subRegion: 'six-island',
      category: 'dungeon',
    },
    'outcast-island-area': {
      locationId: 'outcast-island',
      locationName: { zh: '外海孤島', en: 'Outcast Island', ja: 'はなれじま' },
      areaName: { zh: '孤島海域', en: 'Island' },
      region: 'sevii',
      subRegion: 'six-island',
      category: 'route',
    },
    // Altering Cave
    'kanto-altering-cave-a': { locationId: 'altering-cave', locationName: { zh: '變化洞窟', en: 'Altering Cave', ja: 'へんげのどうくつ' }, areaName: { zh: '洞窟 A', en: 'Cave A' }, region: 'sevii', subRegion: 'six-island', category: 'dungeon' },
    'kanto-altering-cave-b': { locationId: 'altering-cave', locationName: { zh: '變化洞窟', en: 'Altering Cave', ja: 'へんげのどうくつ' }, areaName: { zh: '洞窟 B', en: 'Cave B' }, region: 'sevii', subRegion: 'six-island', category: 'dungeon' },
    'kanto-altering-cave-c': { locationId: 'altering-cave', locationName: { zh: '變化洞窟', en: 'Altering Cave', ja: 'へんげのどうくつ' }, areaName: { zh: '洞窟 C', en: 'Cave C' }, region: 'sevii', subRegion: 'six-island', category: 'dungeon' },
    'kanto-altering-cave-d': { locationId: 'altering-cave', locationName: { zh: '變化洞窟', en: 'Altering Cave', ja: 'へんげのどうくつ' }, areaName: { zh: '洞窟 D', en: 'Cave D' }, region: 'sevii', subRegion: 'six-island', category: 'dungeon' },
    'kanto-altering-cave-e': { locationId: 'altering-cave', locationName: { zh: '變化洞窟', en: 'Altering Cave', ja: 'へんげのどうくつ' }, areaName: { zh: '洞窟 E', en: 'Cave E' }, region: 'sevii', subRegion: 'six-island', category: 'dungeon' },
    'kanto-altering-cave-f': { locationId: 'altering-cave', locationName: { zh: '變化洞窟', en: 'Altering Cave', ja: 'へんげのどうくつ' }, areaName: { zh: '洞窟 F', en: 'Cave F' }, region: 'sevii', subRegion: 'six-island', category: 'dungeon' },
    'kanto-altering-cave-g': { locationId: 'altering-cave', locationName: { zh: '變化洞窟', en: 'Altering Cave', ja: 'へんげのどうくつ' }, areaName: { zh: '洞窟 G', en: 'Cave G' }, region: 'sevii', subRegion: 'six-island', category: 'dungeon' },
    'kanto-altering-cave-h': { locationId: 'altering-cave', locationName: { zh: '變化洞窟', en: 'Altering Cave', ja: 'へんげのどうくつ' }, areaName: { zh: '洞窟 H', en: 'Cave H' }, region: 'sevii', subRegion: 'six-island', category: 'dungeon' },
    'kanto-altering-cave-i': { locationId: 'altering-cave', locationName: { zh: '變化洞窟', en: 'Altering Cave', ja: 'へんげのどうくつ' }, areaName: { zh: '洞窟 I', en: 'Cave I' }, region: 'sevii', subRegion: 'six-island', category: 'dungeon' },

    // Seven Island
    'canyon-entrance-area': {
      locationId: 'canyon-entrance',
      locationName: { zh: '峽谷入口', en: 'Canyon Entrance', ja: 'けいこくのいりぐち' },
      areaName: { zh: '草叢', en: 'Entrance' },
      region: 'sevii',
      subRegion: 'seven-island',
      category: 'route',
    },
    'sevault-canyon-area': {
      locationId: 'sevault-canyon',
      locationName: { zh: '七寶峽谷', en: 'Sevault Canyon', ja: 'ナナシのけいこく' },
      areaName: { zh: '草叢/碎岩', en: 'Canyon' },
      region: 'sevii',
      subRegion: 'seven-island',
      category: 'route',
    },
    'trainer-tower-area': {
      locationId: 'trainer-tower',
      locationName: { zh: '訓練家之塔', en: 'Trainer Tower', ja: 'トレーナータワー' },
      areaName: { zh: '周圍海域', en: 'Surrounding Water' },
      region: 'sevii',
      subRegion: 'seven-island',
      category: 'special',
    },
    // Tanoby Ruins (七寶溪谷 / 阿露福遺蹟)
    'tanoby-ruins-area': {
      locationId: 'tanoby-ruins',
      locationName: { zh: '阿露福遺蹟 (阿斯卡納遺蹟)', en: 'Tanoby Ruins', ja: 'アスカナいせき' },
      areaName: { zh: '遺蹟海域', en: 'Water' },
      region: 'sevii',
      subRegion: 'seven-island',
      category: 'dungeon',
    },
    'monean-chamber-area': { locationId: 'tanoby-ruins', locationName: { zh: '阿露福遺蹟', en: 'Tanoby Ruins', ja: 'アスカナいせき' }, areaName: { zh: '第一石室 (A)', en: 'Monean Chamber' }, region: 'sevii', subRegion: 'seven-island', category: 'dungeon' },
    'liptoo-chamber-area': { locationId: 'tanoby-ruins', locationName: { zh: '阿露福遺蹟', en: 'Tanoby Ruins', ja: 'アスカナいせき' }, areaName: { zh: '第二石室 (C,D,H,U,O)', en: 'Liptoo Chamber' }, region: 'sevii', subRegion: 'seven-island', category: 'dungeon' },
    'weepth-chamber-area': { locationId: 'tanoby-ruins', locationName: { zh: '阿露福遺蹟', en: 'Tanoby Ruins', ja: 'アスカナいせき' }, areaName: { zh: '第三石室 (N,F,G,I,J)', en: 'Weepth Chamber' }, region: 'sevii', subRegion: 'seven-island', category: 'dungeon' },
    'dilford-chamber-area': { locationId: 'tanoby-ruins', locationName: { zh: '阿露福遺蹟', en: 'Tanoby Ruins', ja: 'アスカナいせき' }, areaName: { zh: '第四石室 (P,L,K,Q,E)', en: 'Dilford Chamber' }, region: 'sevii', subRegion: 'seven-island', category: 'dungeon' },
    'scufib-chamber-area': { locationId: 'tanoby-ruins', locationName: { zh: '阿露福遺蹟', en: 'Tanoby Ruins', ja: 'アスカナいせき' }, areaName: { zh: '第五石室 (Y,T,G,R,M)', en: 'Scufib Chamber' }, region: 'sevii', subRegion: 'seven-island', category: 'dungeon' },
    'rixy-chamber-area': { locationId: 'tanoby-ruins', locationName: { zh: '阿露福遺蹟', en: 'Tanoby Ruins', ja: 'アスカナいせき' }, areaName: { zh: '第六石室 (V,W,X,B,Z)', en: 'Rixy Chamber' }, region: 'sevii', subRegion: 'seven-island', category: 'dungeon' },
    'viapos-chamber-area': { locationId: 'tanoby-ruins', locationName: { zh: '阿露福遺蹟', en: 'Tanoby Ruins', ja: 'アスカナいせき' }, areaName: { zh: '第七石室 (!, ?)', en: 'Viapos Chamber' }, region: 'sevii', subRegion: 'seven-island', category: 'dungeon' },

    // Special Event Islands
    'navel-rock-area': {
      locationId: 'navel-rock',
      locationName: { zh: '肚臍岩', en: 'Navel Rock', ja: 'へそのいわ' },
      areaName: { zh: '頂端/最底層 (鳳王/洛奇亞)', en: 'Rock' },
      region: 'sevii',
      subRegion: 'special',
      category: 'special',
    },
    'birth-island-area': {
      locationId: 'birth-island',
      locationName: { zh: '誕生之島', en: 'Birth Island', ja: 'たんじょうのしま' },
      areaName: { zh: '三角石陣 (代歐奇希斯)', en: 'Island' },
      region: 'sevii',
      subRegion: 'special',
      category: 'special',
    },
  };

  if (specificMap[slug]) {
    return specificMap[slug];
  }

  // Fallback for unmapped
  const cleanName = slug
    .replace(/-area$/, '')
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return {
    locationId: slug,
    locationName: { zh: cleanName, en: cleanName },
    areaName: { zh: '全域', en: 'Area' },
    region: 'kanto',
    subRegion: 'kanto',
    category: 'special',
  };
}
