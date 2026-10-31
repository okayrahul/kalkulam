import {test} from 'node:test';
import assert from 'node:assert/strict';
import {people,families,childrenFor,parentsFor,spousesFor,descendantIds,ancestryPath,branchFor,searchPeople,childrenStatusFor} from '../src/family.js';
import {kulashekaramPeople,kulashekaramFamilies} from '../src/kulashekaram.js';
import {layoutTree} from '../src/tree-layout.js';

test('The new source resolves Poovangaparambu spellings while preserving old person links and searches',()=>{
 assert.equal(people.sukumaran.name,'K. Sukumaran Thampi');
 assert.equal(people.sukumaran.sourceNotes,undefined);
 assert.ok(people.sukumaran.aliases.includes('Gopi Thampi'));
 assert.ok(searchPeople('Sumaran').includes('sukumaran'));
 assert.equal(people.ratheesh.name,'Prof. Dr. R. Rathish');
 assert.ok(searchPeople('Ratheesh').includes('ratheesh'));
 assert.equal(people.ayappadas.name,'Adv. S. Ayyappadas');
 assert.ok(searchPeople('Ayappadas').includes('ayappadas'));
 assert.equal(people.syamala.place,'Manipal');
 assert.equal(people.sureshKumar.place,'Nagercoil');
 assert.match(people.kumarapilla.note,/Travancore Legislative Council/);
});

test('The explicitly identified Renju relationship and all five Poovangaparambu children are connected',()=>{
 assert.deepEqual(spousesFor('praveen'),['pRenju']);
 assert.equal(people.pRenju.name,'Dr. P. Renju');
 assert.deepEqual(parentsFor('pGayatri'),['praveen','pRenju']);
 assert.deepEqual(spousesFor('ayappadas'),['pLakshmi']);
 assert.deepEqual(parentsFor('pSaiArjun'),['ayappadas','pLakshmi']);
 assert.deepEqual(spousesFor('rajesh'),['pSunitha']);
 assert.deepEqual(parentsFor('pAnanthesh'),['rajesh','pSunitha']);
 assert.deepEqual(childrenFor('ratheesh'),['pSiddarth','pKalidas']);
 assert.deepEqual(parentsFor('pSiddarth'),['ratheesh']);
 assert.deepEqual(spousesFor('ratheesh'),[]);
 for(const id of ['pSunitha','pRenju','pLakshmi','pSiddarth','pKalidas','pAnanthesh','pGayatri','pSaiArjun'])assert.equal(branchFor(id),'sukumaran');
});

test('Kulashekaram reuses the existing Omana ancestor and includes every source descendant and spouse',()=>{
 assert.equal(Object.keys(kulashekaramPeople).length,63);
 assert.equal(kulashekaramFamilies.length,22);
 assert.deepEqual(spousesFor('omana'),['oMadhavan']);
 assert.deepEqual(childrenFor('omana'),['oVijayamma','oNarayanan','oLeela','oPadma','oVasantha','oMohan','oUsha']);
 assert.equal(descendantIds('omana').length,42);
 for(const [id,p] of Object.entries(kulashekaramPeople)){
  assert.equal(branchFor(id),'omana',id);
  assert.equal(p.source.page,1);
  assert.ok(p.source.relationship);
  for(const parent of parentsFor(id))assert.equal(p.generation,people[parent].generation+1,id);
 }
 assert.equal(Object.keys(people).length,509);
 assert.equal(families.length,182);
});

test('Kulashekaram deep paths and single-parent connectors match the figure',()=>{
 assert.deepEqual(ancestryPath('oRudra'),['kumarapilla','omana','oVasantha','oSangeetha','oAnjana','oRudra']);
 assert.deepEqual(parentsFor('oRugmini'),['oAnjana','oNandu']);
 assert.deepEqual(parentsFor('oAdhithya'),['oSangeetha','oBiju']);
 assert.deepEqual(parentsFor('oAdityaRamkumar'),['oVrindha','oRamkumar']);
 assert.deepEqual(parentsFor('oMalavika'),['oPrem','oRemya']);
 assert.deepEqual(parentsFor('oDevi'),['oLekshmi','oHari']);
 assert.deepEqual(childrenFor('oAnupama'),['oAryan','oAbhay']);
 assert.deepEqual(parentsFor('oAryan'),['oAnupama']);
 assert.deepEqual(spousesFor('oAnupama'),[]);
 assert.equal(childrenStatusFor('oBeena'),'unrecorded');
});

test('Same-name Kulashekaram people are not merged across households or branches',()=>{
 assert.equal(people.oKrishna.name,people.oKrishnaRajasree.name);
 assert.deepEqual(spousesFor('oKrishnaRajasree'),['oRajasree']);
 assert.deepEqual(spousesFor('oKrishna'),['oSaritha']);
 assert.deepEqual(parentsFor('oKrishnaRajasree'),[]);
 assert.deepEqual(parentsFor('oKrishna'),['oNarayanan','oLeelavathi']);
 assert.deepEqual(spousesFor('oMadhavan'),['omana']);
 assert.deepEqual(spousesFor('aMadhavan'),['sarada']);
 assert.deepEqual(spousesFor('oRatheesh'),['oGeetha']);
 assert.deepEqual(spousesFor('ratheesh'),[]);
});

test('Both updated branch flowcharts include every supplied person with no overlap',()=>{
 for(const [root,count] of [['sukumaran',18],['omana',64]]){
  const tree=layoutTree(root,new Set([root,...descendantIds(root)]));
  assert.equal(new Set(tree.nodes.flatMap(n=>n.partners)).size,count);
  assert.equal(tree.truncated,false);
  for(const n of tree.nodes)for(const o of tree.nodes.filter(o=>o.depth===n.depth&&o.x>n.x))assert.ok(n.x+n.ownWidth<=o.x);
 }
});
