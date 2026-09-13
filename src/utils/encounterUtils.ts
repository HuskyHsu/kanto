export const METHOD_ICONS: Record<string, string> = {
  walk: '🌿',
  surf: '🌊',
  'old-rod': '🎣',
  'good-rod': '🎣',
  'super-rod': '🎣',
  'rock-smash': '🪨',
  gift: '🎁',
  'gift-egg': '🥚',
  static: '❗',
  'only-one': '❗',
  pokeflute: '🎶',
  'npc-trade': '🔄',
  trade: '🔄',
  'roaming-grass': '🏃',
  'colosseum-bonus-disc-jpn': '🎉',
};

// 需配合道具之遭遇方式（附加指定語系名稱）
export const ITEM_METHOD_INFO: Record<
  string,
  { zh: string; en: string; ja: string }
> = {
  'old-rod': { zh: '破舊釣竿', en: 'Old Rod', ja: 'ボロのつりざお' },
  'good-rod': { zh: '好釣竿', en: 'Good Rod', ja: 'いいつりざお' },
  'super-rod': { zh: '厲害釣竿', en: 'Super Rod', ja: 'すごいつりざお' },
  pokeflute: { zh: '寶可夢之笛', en: 'Poké Flute', ja: 'ポケモンのふえ' },
};

// 基本遭遇方式（統一使用中文，不隨語系切換變為純英文）
export const BASE_METHOD_NAMES: Record<string, string> = {
  walk: '草叢/走路',
  surf: '衝浪',
  'old-rod': '破舊釣竿',
  'good-rod': '好釣竿',
  'super-rod': '厲害釣竿',
  'rock-smash': '碎岩',
  gift: '贈送/領取',
  'gift-egg': '贈送蛋',
  static: '定點遭遇',
  'only-one': '定點遭遇',
  pokeflute: '寶可夢之笛',
  'npc-trade': 'NPC交換',
  trade: 'NPC交換',
  'roaming-grass': '全境遊走',
  'colosseum-bonus-disc-jpn': '特殊活動/連動',
};

// 遭遇方式標準排序權重（草叢 > 衝浪 > 各種釣竿 > 碎岩 > 定點 > 贈送 > 交換）
export const METHOD_ORDER: Record<string, number> = {
  walk: 1,
  surf: 2,
  'old-rod': 3,
  'good-rod': 4,
  'super-rod': 5,
  'rock-smash': 6,
  pokeflute: 7,
  static: 8,
  'only-one': 8,
  'roaming-grass': 9,
  gift: 10,
  'gift-egg': 10,
  'npc-trade': 11,
  trade: 11,
  'colosseum-bonus-disc-jpn': 12,
};

/**
 * 取得遭遇方式名稱：
 * 1. 統一以中文為主體，不隨語系切換變為純英文。
 * 2. 針對需要配合特定道具的取得方式（如釣竿類、寶可夢之笛），加上指定語系名稱：如「破舊釣竿 (Old Rod)」或「破舊釣竿 (ボロのつりざお)」。
 */
export function getEncounterMethodDisplayName(
  method: string,
  displayLanguage: 'ja' | 'en',
  encMethodName?: { zh?: string; en?: string; ja?: string },
): string {
  const itemInfo = ITEM_METHOD_INFO[method];
  if (itemInfo) {
    const subLangName = displayLanguage === 'en' ? itemInfo.en : itemInfo.ja;
    return `${itemInfo.zh} (${subLangName})`;
  }

  return encMethodName?.zh || BASE_METHOD_NAMES[method] || method;
}

export interface EncounterMethodGroup<T> {
  method: string;
  displayName: string;
  icon: string;
  encounters: T[];
}

/**
 * 將指定區域內的寶可夢遭遇依據取得方式（草叢、衝浪、釣竿等）分組並按照標準順序排列
 */
export function groupEncountersByMethod<
  T extends { method: string; methodName?: { zh?: string; en?: string; ja?: string } },
>(
  encounters: T[],
  displayLanguage: 'ja' | 'en',
): EncounterMethodGroup<T>[] {
  const groupsMap = new Map<string, T[]>();

  for (const enc of encounters) {
    const list = groupsMap.get(enc.method);
    if (list) {
      list.push(enc);
    } else {
      groupsMap.set(enc.method, [enc]);
    }
  }

  const groups: EncounterMethodGroup<T>[] = [];
  for (const [method, encs] of groupsMap.entries()) {
    const firstEnc = encs[0];
    groups.push({
      method,
      displayName: getEncounterMethodDisplayName(
        method,
        displayLanguage,
        firstEnc?.methodName,
      ),
      icon: METHOD_ICONS[method] || '📍',
      encounters: encs,
    });
  }

  // 依據 METHOD_ORDER 標準順序排序
  groups.sort((a, b) => {
    const orderA = METHOD_ORDER[a.method] ?? 99;
    const orderB = METHOD_ORDER[b.method] ?? 99;
    return orderA - orderB;
  });

  return groups;
}
