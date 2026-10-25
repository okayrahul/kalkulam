import {cp,mkdir,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=new URL('../dist/',import.meta.url);
await mkdir(dist,{recursive:true});
for(const file of ['index.html','favicon.svg','src'])await cp(new URL('../'+file,import.meta.url),new URL(file,dist),{recursive:true});
console.log('Static site built in '+root+'dist');
