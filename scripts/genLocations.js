import { promises as fs } from 'fs';
import { METHOD_MAP, TRADE_CONDITION_MAP, resolveLocationArea } from './data/locationDict.js';

const MAX_PID = 386;

function parseEncounters(rawEncounters) {
  const results = [];
  for (const item of rawEncounters) {
    const frlg = item.version_details.filter((v) =>
      ['firered', 'leafgreen'].includes(v.version.name),
    );
    if (!frlg.length) continue;

    const locInfo = resolveLocationArea(item.location_area.name);

    // Group methods for this area.
    // If it's a trade, group by method + trade condition so different trade targets across versions are handled properly.
    const methodMap = new Map();
    for (const vd of frlg) {
      const vName = vd.version.name; // 'firered' | 'leafgreen'
      for (const ed of vd.encounter_details) {
        const mName = ed.method?.name || 'walk';
        const tradeCond = ed.condition_values?.find((c) => c.name.startsWith('trade-'))?.name;
        const groupKey = tradeCond ? `${mName}__${tradeCond}` : mName;

        if (!methodMap.has(groupKey)) {
          methodMap.set(groupKey, {
            method: mName,
            tradeFor: tradeCond ? TRADE_CONDITION_MAP[tradeCond] : undefined,
            versions: {},
          });
        }
        const group = methodMap.get(groupKey);
        const current = group.versions[vName] || { chance: 0, minLevel: 100, maxLevel: 0 };
        current.chance += ed.chance;
        current.minLevel = Math.min(current.minLevel, ed.min_level);
        current.maxLevel = Math.max(current.maxLevel, ed.max_level);
        group.versions[vName] = current;
      }
    }

    for (const group of methodMap.values()) {
      const mName = group.method;
      const tradeFor = group.tradeFor;
      const versions = group.versions;
      const hasFR = 'firered' in versions;
      const hasLG = 'leafgreen' in versions;

      const baseEncounter = {
        locationId: locInfo.locationId,
        locationName: locInfo.locationName,
        areaName: locInfo.areaName,
        region: locInfo.region,
        subRegion: locInfo.subRegion,
        category: locInfo.category,
        method: mName,
        methodName: METHOD_MAP[mName] || { zh: mName, en: mName },
        ...(tradeFor ? { tradeFor } : {}),
      };

      if (hasFR && hasLG) {
        const fr = versions['firered'];
        const lg = versions['leafgreen'];
        if (fr.chance === lg.chance && fr.minLevel === lg.minLevel && fr.maxLevel === lg.maxLevel) {
          results.push({
            ...baseEncounter,
            chance: fr.chance,
            minLevel: fr.minLevel,
            maxLevel: fr.maxLevel,
            version: 'both',
          });
        } else {
          results.push({
            ...baseEncounter,
            chance: fr.chance,
            minLevel: fr.minLevel,
            maxLevel: fr.maxLevel,
            version: 'firered',
          });
          results.push({
            ...baseEncounter,
            chance: lg.chance,
            minLevel: lg.minLevel,
            maxLevel: lg.maxLevel,
            version: 'leafgreen',
          });
        }
      } else if (hasFR) {
        const fr = versions['firered'];
        results.push({
          ...baseEncounter,
          chance: fr.chance,
          minLevel: fr.minLevel,
          maxLevel: fr.maxLevel,
          version: 'firered',
        });
      } else if (hasLG) {
        const lg = versions['leafgreen'];
        results.push({
          ...baseEncounter,
          chance: lg.chance,
          minLevel: lg.minLevel,
          maxLevel: lg.maxLevel,
          version: 'leafgreen',
        });
      }
    }
  }
  return results;
}

async function main() {
  console.log('Generating Pokemon Encounters and Location Map data...');

  // 1. Read Pokemon basic list
  const pokemonListRaw = await fs.readFile('public/data/pokemonList.json', 'utf8');
  const pokemonList = JSON.parse(pokemonListRaw);
  const pokemonMap = new Map(pokemonList.map((p) => [p.pid, p]));

  // 2. Process all Pokemon encounters and build inverted location map
  const locationCatalog = new Map(); // locationId -> { id, name, region, subRegion, category, areas: Map(areaKey -> { areaName, encounters: [] }) }

  let countWithEncounters = 0;

  for (let pid = 1; pid <= MAX_PID; pid++) {
    const cachePath = `scripts/cache/encounters/${pid}.json`;
    let rawEncounters = [];
    try {
      const content = await fs.readFile(cachePath, 'utf8');
      rawEncounters = JSON.parse(content);
    } catch (e) {
      // no cache
    }

    const encounters = parseEncounters(rawEncounters);

    // Update individual Pokemon JSON file
    const pmPath = `public/data/pm/${pid}.json`;
    try {
      const pmContent = await fs.readFile(pmPath, 'utf8');
      const pmData = JSON.parse(pmContent);
      pmData.encounters = encounters;
      await fs.writeFile(pmPath, JSON.stringify(pmData));
    } catch (e) {
      // file might not exist if outside current scope
    }

    if (encounters.length > 0) {
      countWithEncounters++;
    }

    // Populate inverted location map
    const pmInfo = pokemonMap.get(pid);
    if (!pmInfo) continue;

    for (const enc of encounters) {
      if (!locationCatalog.has(enc.locationId)) {
        locationCatalog.set(enc.locationId, {
          id: enc.locationId,
          name: enc.locationName,
          region: enc.region,
          subRegion: enc.subRegion,
          category: enc.category,
          areaMap: new Map(),
        });
      }

      const locEntry = locationCatalog.get(enc.locationId);
      const areaKey = enc.areaName?.zh || '全域';
      if (!locEntry.areaMap.has(areaKey)) {
        locEntry.areaMap.set(areaKey, {
          name: enc.areaName || { zh: '全域', en: 'Area' },
          encounters: [],
        });
      }

      locEntry.areaMap.get(areaKey).encounters.push({
        pid: pmInfo.pid,
        name: pmInfo.name,
        types: pmInfo.types,
        method: enc.method,
        methodName: enc.methodName,
        ...(enc.tradeFor ? { tradeFor: enc.tradeFor } : {}),
        chance: enc.chance,
        minLevel: enc.minLevel,
        maxLevel: enc.maxLevel,
        version: enc.version,
      });
    }
  }

  console.log(`Updated ${countWithEncounters} Pokemon with FRLG encounters.`);

  // 3. Format locations array with ordering
  const locations = Array.from(locationCatalog.values()).map((loc) => ({
    id: loc.id,
    name: loc.name,
    region: loc.region,
    subRegion: loc.subRegion,
    category: loc.category,
    areas: Array.from(loc.areaMap.values()).map((a) => ({
      name: a.name,
      encounters: a.encounters.sort((a, b) => {
        // Sort by chance desc, then pid asc
        if (b.chance !== a.chance) return b.chance - a.chance;
        return a.pid - b.pid;
      }),
    })),
  }));

  // Define sort weights
  const subRegionOrder = {
    kanto: 1,
    'one-island': 2,
    'two-island': 3,
    'three-island': 4,
    'four-island': 5,
    'five-island': 6,
    'six-island': 7,
    'seven-island': 8,
    special: 9,
  };

  const categoryOrder = {
    route: 1,
    dungeon: 2,
    city: 3,
    special: 4,
  };

  locations.sort((a, b) => {
    // 1. subRegion order
    const sA = subRegionOrder[a.subRegion] || 99;
    const sB = subRegionOrder[b.subRegion] || 99;
    if (sA !== sB) return sA - sB;

    // 2. category order
    const cA = categoryOrder[a.category] || 99;
    const cB = categoryOrder[b.category] || 99;
    if (cA !== cB) return cA - cB;

    // 3. if both are routes, sort by route number
    const matchA = a.id.match(/^route-(\d+)$/);
    const matchB = b.id.match(/^route-(\d+)$/);
    if (matchA && matchB) {
      return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
    }

    return a.id.localeCompare(b.id);
  });

  await fs.writeFile('public/data/locations.json', JSON.stringify(locations, null, 2));
  console.log(`Saved ${locations.length} locations to public/data/locations.json successfully!`);
}

main().catch(console.error);
