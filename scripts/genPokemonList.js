import { promises as fs } from 'fs';

const categoryMap = {
  water: 'Special',
  grass: 'Special',
  fire: 'Special',
  ice: 'Special',
  electric: 'Special',
  psychic: 'Special',
  dragon: 'Special',
  dark: 'Special',

  fighting: 'Physical',
  poison: 'Physical',
  ground: 'Physical',
  flying: 'Physical',
  bug: 'Physical',
  rock: 'Physical',
  ghost: 'Physical',
  steel: 'Physical',
  fairy: 'Physical',
  normal: 'Physical',
};

const TMMap = {
  真氣拳: '01',
  龍爪: '02',
  水之波動: '03',
  冥想: '04',
  吼叫: '05',
  劇毒: '06',
  冰雹: '07',
  健美: '08',
  種子機關槍: '09',
  覺醒力量: '10',
  大晴天: '11',
  挑釁: '12',
  冰凍光束: '13',
  暴風雪: '14',
  破壞光線: '15',
  光牆: '16',
  守住: '17',
  求雨: '18',
  終極吸取: '19',
  神秘守護: '20',
  遷怒: '21',
  日光束: '22',
  鐵尾: '23',
  十萬伏特: '24',
  打雷: '25',
  地震: '26',
  報恩: '27',
  挖洞: '28',
  精神強念: '29',
  暗影球: '30',
  劈瓦: '31',
  影子分身: '32',
  反射壁: '33',
  電擊波: '34',
  噴射火焰: '35',
  污泥炸彈: '36',
  沙暴: '37',
  大字爆炎: '38',
  岩石封鎖: '39',
  燕返: '40',
  無理取鬧: '41',
  硬撐: '42',
  秘密之力: '43',
  睡覺: '44',
  迷人: '45',
  小偷: '46',
  鋼翼: '47',
  特性互換: '48',
  搶奪: '49',
  過熱: '50',

  居合斬: '秘傳01',
  飛翔: '秘傳02',
  衝浪: '秘傳03',
  怪力: '秘傳04',
  閃光: '秘傳05',
  碎岩: '秘傳06',
  攀瀑: '秘傳07',
};

const getData = async (pid) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pid}`);
  const data = await response.json();
  return data;
};

const getMoveData_ = async (mid) => {
  const response = await fetch(`https://pokeapi.co/api/v2/move/${mid}`);
  const data = await response.json();
  //   console.log(data);
  return {
    id: data.id,
    type: data.type.name.charAt(0).toUpperCase() + data.type.name.slice(1),
    category: data.damage_class.name === 'status' ? 'Status' : categoryMap[data.type.name],
    power: data.power,
    accuracy: data.accuracy,
    pp: data.pp,
    name: {
      jp: data.names.find((name) => name.language.name === 'ja').name,
      en: data.names.find((name) => name.language.name === 'en').name,
      zh: data.names.find((name) => name.language.name === 'zh-hant').name,
    },
  };
};

const moveCache = new Map();

const getMoveData = async (mid) => {
  if (moveCache.has(mid)) {
    return moveCache.get(mid);
  }
  const data = await getMoveData_(mid);
  moveCache.set(mid, data);
  return data;
};

const main = async () => {
  const data = await getData(4);

  const pm = {
    levelUpMoves: [],
    TMMoves: [],
    HTMMoves: [],
    eggMoves: [],
    tutorMoves: [],
  };

  const movePromises = data.moves
    .filter((move) => {
      return move.version_group_details.some(
        (detail) => detail.version_group.name === 'firered-leafgreen',
      );
    })
    .map((move) => {
      const details = move.version_group_details.find(
        (d) => d.version_group.name === 'firered-leafgreen',
      );
      return {
        moveId: parseInt(move.move.url.split('/').at(-2)),
        method: details.move_learn_method.name,
        level: details.level_learned_at,
      };
    })
    .sort((a, b) => a.level - b.level)
    .map(async (move) => {
      const data = await getMoveData(move.moveId);
      return {
        ...data,
        level: move.level,
        method: move.method,
      };
    });

  const parsedMoves = await Promise.all(movePromises);

  parsedMoves.forEach((move) => {
    const { level, method, ...rest } = move;
    if (method === 'level-up') {
      pm.levelUpMoves.push({ ...rest, level });
    } else if (method === 'machine' && (TMMap[rest.name.zh] ?? '').startsWith('秘傳')) {
      pm.HTMMoves.push({ tm: TMMap[rest.name.zh], ...rest });
    } else if (method === 'machine') {
      pm.TMMoves.push({ tm: TMMap[rest.name.zh], ...rest });
    } else if (method === 'egg') {
      pm.eggMoves.push(rest);
    } else if (method === 'tutor') {
      pm.tutorMoves.push(rest);
    }
  });

  pm.TMMoves = pm.TMMoves.sort((a, b) => {
    return parseInt(a.tm) - parseInt(b.tm);
  });

  pm.HTMMoves = pm.HTMMoves.sort((a, b) => {
    return parseInt(a.tm.charAt(2)) - parseInt(b.tm.charAt(2));
  });

  await fs.writeFile(`public/data/pm/${data.id}.json`, JSON.stringify(pm));
};

main();

export {};
