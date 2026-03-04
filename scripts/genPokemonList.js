import { promises as fs } from 'fs';
import { categoryMap, MAX_PID, TMMap, VERSION_GROUP } from './settings.js';

/**
 * Generic fetch with file-based caching
 */
const fetchWithCache = async (url, cachePath) => {
  try {
    const cachedData = await fs.readFile(cachePath, 'utf-8');
    return JSON.parse(cachedData);
  } catch (e) {
    // Cache miss or read error
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const data = await response.json();

  const dir = cachePath.substring(0, cachePath.lastIndexOf('/'));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(cachePath, JSON.stringify(data, null, 2));

  return data;
};

const getPokemonData = (pid) => {
  return fetchWithCache(
    `https://pokeapi.co/api/v2/pokemon/${pid}`,
    `scripts/cache/pokemon/${pid}.json`,
  );
};

const getPokemonSpeciesData = (pid) => {
  return fetchWithCache(
    `https://pokeapi.co/api/v2/pokemon-species/${pid}`,
    `scripts/cache/species/${pid}.json`,
  );
};

const moveCache = new Map();

/**
 * Fetch and format move data
 */
const getMoveData = async (mid) => {
  if (moveCache.has(mid)) {
    return moveCache.get(mid);
  }

  const rawData = await fetchWithCache(
    `https://pokeapi.co/api/v2/move/${mid}`,
    `scripts/cache/move/${mid}.json`,
  );

  const formattedMove = {
    id: rawData.id,
    type: rawData.type.name.charAt(0).toUpperCase() + rawData.type.name.slice(1),
    category: rawData.damage_class.name === 'status' ? 'Status' : categoryMap[rawData.type.name],
    power: rawData.power,
    accuracy: rawData.accuracy,
    pp: rawData.pp,
    name: {
      ja: rawData.names.find((n) => n.language.name === 'ja').name,
      en: rawData.names.find((n) => n.language.name === 'en').name,
      zh: rawData.names.find((n) => n.language.name === 'zh-hant').name,
    },
  };

  moveCache.set(mid, formattedMove);
  return formattedMove;
};

const abilityCache = new Map();

/**
 * Fetch and format ability data
 */
const getAbilityData = async (aid) => {
  if (abilityCache.has(aid)) {
    return abilityCache.get(aid);
  }

  const rawData = await fetchWithCache(
    `https://pokeapi.co/api/v2/ability/${aid}`,
    `scripts/cache/ability/${aid}.json`,
  );

  const formattedAbility = {
    id: rawData.id,
    name: {
      ja: rawData.names.find((n) => n.language.name === 'ja').name,
      en: rawData.names.find((n) => n.language.name === 'en').name,
      zh: rawData.names.find((n) => n.language.name === 'zh-hant').name,
    },
  };

  abilityCache.set(aid, formattedAbility);
  return formattedAbility;
};

const processMoves = async (rawMoves) => {
  const versionMoves = rawMoves
    .filter((move) =>
      move.version_group_details.some((detail) => detail.version_group.name === VERSION_GROUP),
    )
    .map((move) => {
      const details = move.version_group_details.find(
        (d) => d.version_group.name === VERSION_GROUP,
      );
      return {
        moveId: parseInt(move.move.url.split('/').at(-2)),
        method: details.move_learn_method.name,
        level: details.level_learned_at,
      };
    })
    .sort((a, b) => a.level - b.level);

  const movePromises = versionMoves.map(async (move) => {
    const moveData = await getMoveData(move.moveId);
    return {
      ...moveData,
      level: move.level,
      method: move.method,
    };
  });

  const parsedMoves = await Promise.all(movePromises);

  const moveMap = {
    levelUpMoves: [],
    TMMoves: [],
    HTMMoves: [],
    eggMoves: [],
    tutorMoves: [],
  };
  parsedMoves.forEach((move) => {
    const { level, method, ...rest } = move;
    const tmMark = TMMap[rest.name.zh];

    if (method === 'level-up') {
      moveMap.levelUpMoves.push({ ...rest, level });
    } else if (method === 'machine') {
      const isHM = tmMark?.startsWith('秘傳');
      const target = isHM ? moveMap.HTMMoves : moveMap.TMMoves;
      target.push({ tm: tmMark, ...rest });
    } else if (method === 'egg') {
      moveMap.eggMoves.push(rest);
    } else if (method === 'tutor') {
      moveMap.tutorMoves.push(rest);
    }
  });

  // Sorting
  moveMap.TMMoves.sort((a, b) => {
    const aNum = parseInt(a.tm) || 0;
    const bNum = parseInt(b.tm) || 0;
    return aNum - bNum;
  });
  moveMap.HTMMoves.sort((a, b) => {
    const aNum = parseInt(a.tm?.replace('秘傳', '') || '0');
    const bNum = parseInt(b.tm?.replace('秘傳', '') || '0');
    return aNum - bNum;
  });

  return moveMap;
};

const processAbilities = async (rawAbilities) => {
  const abilityPromises = rawAbilities
    .filter((a) => !a.is_hidden)
    .map((a) => {
      const aid = parseInt(a.ability.url.split('/').at(-2));
      return getAbilityData(aid);
    });

  const abilities = await Promise.all(abilityPromises);
  return abilities.map((a) => a.name);
};

const processStats = (rawStats) => {
  return rawStats.reduce(
    (acc, stat) => {
      acc.ev.push(stat.effort);
      acc.base.push(stat.base_stat);
      return acc;
    },
    { ev: [], base: [] },
  );
};

const processTypes = (rawTypes) => {
  return rawTypes.map((t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));
};

const processSpecies = (speciesData) => {
  const eggGroups = speciesData.egg_groups.map(
    (g) => g.name.charAt(0).toUpperCase() + g.name.slice(1),
  );

  const pokemonNames = {
    zh: speciesData.names.find((n) => n.language.name === 'zh-hant')?.name || '',
    ja: speciesData.names.find((n) => n.language.name === 'ja')?.name || '',
    en: speciesData.names.find((n) => n.language.name === 'en')?.name || '',
  };

  const genderRate = speciesData.gender_rate;

  return { eggGroups, name: pokemonNames, genderRate };
};

const getEvolutionChainData = (url) => {
  const chainId = url.split('/').at(-2);
  return fetchWithCache(url, `scripts/cache/evolution-chain/${chainId}.json`);
};

const buildEvolutionTree = async (node) => {
  const pid = parseInt(node.species.url.split('/').at(-2));

  const speciesData = await getPokemonSpeciesData(pid);
  const pokemonData = await getPokemonData(pid);

  const speciesProcessed = processSpecies(speciesData);
  const types = processTypes(pokemonData.types);

  const result = {
    pid: pid,
    type: types,
    name: speciesProcessed.name,
  };

  if (node.evolves_to && node.evolves_to.length > 0) {
    const validEvolutions = node.evolves_to.filter((evo) => {
      const evoPid = parseInt(evo.species.url.split('/').at(-2));
      return evoPid <= MAX_PID;
    });

    if (validEvolutions.length > 0) {
      result.to = await Promise.all(
        validEvolutions.map(async (evo) => {
          const childNode = await buildEvolutionTree(evo);

          const details = evo.evolution_details[0];
          if (details) {
            if (details.min_level) {
              childNode.level = details.min_level;
            }
            if (details.trigger) {
              const rawMethod = details.trigger.name;
              const map = {
                'level-up': 'LevelUp',
                'use-item': 'UseItem',
                trade: 'Trade',
                shed: 'Shed',
              };
              childNode.method = map[rawMethod] || rawMethod;
            }
            const conditions = [];

            if (details.item) {
              conditions.push(`item ${details.item.name}`);
            }
            if (details.time_of_day) {
              conditions.push(`time ${details.time_of_day}`);
            }
            if (details.min_happiness) {
              conditions.push(`happiness ${details.min_happiness}`);
            }
            if (details.known_move) {
              conditions.push(`move ${details.known_move.name}`);
            }
            if (details.location) {
              conditions.push(`location ${details.location.name}`);
            }

            if (conditions.length > 0) {
              childNode.condition = conditions;
            }
          }
          return childNode;
        }),
      );
    }
  }

  return result;
};

const processPokemon = async (pid) => {
  console.log(`Processing Pokemon ID: ${pid}...`);
  const data = await getPokemonData(pid);
  const speciesData = await getPokemonSpeciesData(pid);

  const moveMap = await processMoves(data.moves);
  const abilities = await processAbilities(data.abilities);
  const stats = processStats(data.stats);
  const types = processTypes(data.types);
  const species = processSpecies(speciesData);

  const findValidEvolutionRoot = (node) => {
    const pid = parseInt(node.species.url.split('/').at(-2));
    if (pid <= MAX_PID) {
      return node;
    }
    // If root > 386 (like Mime Jr. 439), search children
    if (node.evolves_to && node.evolves_to.length > 0) {
      for (const evo of node.evolves_to) {
        const validNode = findValidEvolutionRoot(evo);
        if (validNode) return validNode;
      }
    }
    return null;
  };

  let evolutionInfo = null;
  let isLatest = true;

  const checkIsLatest = (node, targetPid) => {
    if (node.pid === targetPid) {
      return !(node.to && node.to.length > 0);
    }
    if (node.to && node.to.length > 0) {
      for (const child of node.to) {
        const result = checkIsLatest(child, targetPid);
        if (result !== null) return result;
      }
    }
    return null;
  };

  if (speciesData.evolution_chain?.url) {
    const chainData = await getEvolutionChainData(speciesData.evolution_chain.url);
    const validRoot = findValidEvolutionRoot(chainData.chain);
    if (validRoot) {
      const tree = await buildEvolutionTree(validRoot);
      if (tree.to && tree.to.length > 0) {
        evolutionInfo = tree;
      }

      const latestResult = checkIsLatest(tree, pid);
      if (latestResult !== null) {
        isLatest = latestResult;
      }
    }
  }

  const pm = {
    pid,
    name: species.name,
    types,
    eggGroups: species.eggGroups,
    abilities,
    base: stats.base,
    ev: stats.ev,
    latest: isLatest,
    genderRate: species.genderRate,
    evolution: evolutionInfo,
    ...moveMap,
  };

  const outDir = 'public/data/pm';
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(`${outDir}/${pid}.json`, JSON.stringify(pm, null, 2));
  console.log(`Saved ${outDir}/${pid}.json`);

  return {
    pid,
    name: pm.name,
    types: pm.types,
    eggGroups: pm.eggGroups,
    abilities: pm.abilities,
    ev: pm.ev,
    latest: pm.latest,
  };
};

const main = async () => {
  const pids = Array.from({ length: 151 }, (_, i) => i + 1);
  const basicInfoList = [];

  for (const pid of pids) {
    try {
      const basicInfo = await processPokemon(pid);
      if (basicInfo) {
        basicInfoList.push(basicInfo);
      }
    } catch (error) {
      console.error(`Error processing Pokemon ${pid}:`, error.message);
    }
  }

  const outDir = 'public/data';
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(`${outDir}/pokemonList.json`, JSON.stringify(basicInfoList, null, 2));
  console.log(`Saved ${outDir}/pokemonList.json`);
};

main();
