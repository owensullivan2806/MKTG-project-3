import {readFile,mkdir,copyFile,cp,writeFile} from 'node:fs/promises';
import {validateData} from '../analytics.mjs';
const root=new URL('../',import.meta.url);const data=validateData(JSON.parse(await readFile(new URL('data/competitor_data.json',root),'utf8')));
for(const target of ['dist','docs']){
 await mkdir(new URL(target+'/data/',root),{recursive:true});
 for(const f of ['index.html','app.js','styles.css','analytics.mjs','favicon.svg'])await copyFile(new URL(f,root),new URL(target+'/'+f,root));
 await cp(new URL('data',root),new URL(target+'/data',root),{recursive:true});
 await writeFile(new URL(target+'/.nojekyll',root),'');
}
console.log(`Production build passed: ${data.competitors.length} competitors, ${data.pricing_offers.length} offers. Output: dist/ and docs/.`);
