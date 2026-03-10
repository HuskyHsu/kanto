import { promises as fs } from 'fs';

const main = async () => {
  const baseUrl =
    'https://www.serebii.net/pokearth/sprites/frlg';
  const shinyUrl = "https://www.serebii.net/Shiny/FRLG"
  const outDir = 'public/images/pmIcon';

  // 建立儲存圖片的資料夾
  await fs.mkdir(outDir, { recursive: true });
  console.log(`準備儲存至: ${outDir}`);

  for (let id = 165; id <= 165; id++) {
    try {
      // 下載一般形態 (id.png)
      const resNormal = await fetch(`${baseUrl}/${id}.png`);
      if (resNormal.ok) {
        const buffer = Buffer.from(await resNormal.arrayBuffer());
        await fs.writeFile(`${outDir}/${id}.png`, buffer);
        console.log(`已下載 ${id}.png`);
      } else {
        console.error(`[錯誤] 無法下載一般形態 ${id}.png: ${resNormal.statusText}`);
      }

      // 下載異色形態 (ids.png)
      const resShiny = await fetch(`${shinyUrl}/${id}.png`);
      if (resShiny.ok) {
        const buffer = Buffer.from(await resShiny.arrayBuffer());
        await fs.writeFile(`${outDir}/${id}s.png`, buffer);
        console.log(`已下載 ${id}s.png`);
      } else {
        console.error(`[錯誤] 無法下載異色形態 ${id}s.png: ${resShiny.statusText}`);
      }
    } catch (error) {
      console.error(`[錯誤] 下載 ID ${id} 時發生意外問題:`, error.message);
    }
  }

  console.log('所有圖片下載完成！');
};

main();