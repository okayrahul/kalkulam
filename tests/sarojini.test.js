import {test} from 'node:test';
import assert from 'node:assert/strict';
import {people,childrenFor,parentsFor,spousesFor,descendantIds,ancestryPath,branchFor,childrenStatusFor,searchPeople} from '../src/family.js';
import {layoutTree} from '../src/tree-layout.js';

test('Sarojini and Krishnan have the four children reached by the source arrows',()=>{
 assert.deepEqual(childrenFor('sarojini'),['sRema','sHema','sPrema','sSudha']);
 assert.deepEqual(childrenFor('krishnan'),childrenFor('sarojini'));
 for(const id of ['sRakNair','sVijayakumaran','sRamachandran','sAnilkumar'])assert.deepEqual(parentsFor(id),[]);
 assert.equal(descendantIds('sarojini').length,18);
});

test('Sarojini grandchildren and their spouses follow the descending connectors',()=>{
 assert.deepEqual(childrenFor('sRema'),['sHarikumar','sArchana']);
 assert.deepEqual(childrenFor('sHema'),['sGirish','sVignesh']);
 assert.deepEqual(childrenFor('sSudha'),['sAthira','sChithira']);
 assert.deepEqual(parentsFor('sSanjana'),['sHarikumar','sParvathi']);
 assert.deepEqual(spousesFor('sSanjana'),['sSrinath']);
 assert.deepEqual(parentsFor('sKaran'),['sArchana','sShankar']);
 assert.deepEqual(spousesFor('sKaran'),['sPeyasha']);
 assert.deepEqual(parentsFor('sNirbhay'),['sArchana','sShankar']);
 assert.deepEqual(childrenFor('sGirish'),['sGaurav','sNavami']);
 assert.deepEqual(parentsFor('sHeera'),['sVignesh','sSurya']);
 assert.deepEqual(parentsFor('sMeghna'),['sAthira','sKrishnaMoorthy']);
 assert.deepEqual(parentsFor('sAmarys'),['sChithira','sPraveen']);
 assert.equal(childrenStatusFor('sPrema'),'unrecorded');
});

test('Source spellings and similarly named people stay distinct across branches',()=>{
 assert.equal(people.sPeyasha.name,'Peyasha');
 assert.equal(people.sAmarys.name,'Amarys Praveen');
 assert.equal(people.sGirish.name,'Girish Thampy');
 assert.deepEqual(spousesFor('sRamachandran'),['sPrema']);
 assert.deepEqual(spousesFor('tRamachandran'),['tVasantha']);
 assert.deepEqual(spousesFor('sHarikumar'),['sParvathi']);
 assert.deepEqual(spousesFor('k44'),['k43']);
 assert.deepEqual(ancestryPath('sAmarys'),['kumarapilla','sarojini','sSudha','sChithira','sAmarys']);
 assert.ok(searchPeople('Peyasha').includes('sPeyasha'));
 assert.equal(branchFor('sSrinath'),'sarojini');
});

test('All 32 people in the Sarojini branch fit its flowchart without overlapping couples',()=>{
 const tree=layoutTree('sarojini',new Set(['sarojini',...descendantIds('sarojini')]));
 assert.equal(new Set(tree.nodes.flatMap(n=>n.partners)).size,32);
 assert.equal(tree.truncated,false);
 for(const n of tree.nodes)for(const o of tree.nodes.filter(o=>o.depth===n.depth&&o.x>n.x))assert.ok(n.x+n.ownWidth<=o.x);
});
