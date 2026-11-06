import {test} from 'node:test';
import assert from 'node:assert/strict';
import {people,families,childrenFor,parentsFor,spousesFor,ancestryPath,descendantIds,searchPeople,branchFor,validateData} from '../src/family.js';
import {rajammaPeople,rajammaFamilies} from '../src/rajamma.js';
import {layoutTree} from '../src/tree-layout.js';

test('The v5 blueprint extends the existing Rajamma branch with traceable records',()=>{
 assert.equal(Object.keys(rajammaPeople).length,32);
 assert.equal(rajammaFamilies.length,12);
 assert.deepEqual(parentsFor('rajamma'),['kumarapilla','valliyamma']);
 assert.deepEqual(spousesFor('rajamma'),['rThanu']);
 assert.deepEqual(childrenFor('rajamma'),['rRatnamma']);
 assert.ok(searchPeople('V. Rajamma Thankachy').includes('rajamma'));
 for(const [id,p] of Object.entries(rajammaPeople)){
  assert.equal(p.source.document,'Kalkulam_Family_Tree_v5.pdf');
  assert.equal(p.source.page,1);
  assert.ok(p.source.relationship);
  assert.equal(branchFor(id),'rajamma');
 }
 assert.doesNotThrow(()=>validateData(people,families));
});

test('The three unambiguous fourth-generation lines reach their listed children and grandchildren',()=>{
 assert.deepEqual(childrenFor('rPadmaja'),['rLakshmiPriya']);
 assert.deepEqual(childrenFor('rMohan'),['rSmitha','rSyam']);
 assert.deepEqual(childrenFor('rGirija'),['rVivek']);
 assert.deepEqual(spousesFor('rGirija'),[]);
 assert.deepEqual(parentsFor('rVivek'),['rGirija']);
 assert.deepEqual(childrenFor('rLakshmiPriya'),['rRishikesh','rKeshav']);
 assert.deepEqual(childrenFor('rSmitha'),['rNikhil','rNiveditha']);
 assert.deepEqual(childrenFor('rSyam'),['rKrishay','rTanay']);
 assert.deepEqual(childrenFor('rVivek'),['rDevansh']);
 assert.deepEqual(ancestryPath('rDevansh'),['kumarapilla','rajamma','rRatnamma','rGirija','rVivek','rDevansh']);
 assert.equal(people.rDevansh.generation,6);
 assert.notEqual(parentsFor('rKeshav')[0],parentsFor('keshav')[0]);
});

test('Vijayakumar S. stays separate from the earlier Sarojini family following the user clarification',()=>{
 assert.deepEqual(childrenFor('rRatnamma'),['rPadmaja','rVijayakumar','rMohan','rGirija']);
 assert.deepEqual(parentsFor('rVijayakumar'),['rRatnamma','rKks']);
 assert.deepEqual(spousesFor('rVijayakumar'),['rHema']);
 assert.deepEqual(childrenFor('rVijayakumar'),['rGirish','rVignesh']);
 assert.deepEqual(parentsFor('rGaurav'),['rGirish','rLakshmi']);
 assert.deepEqual(parentsFor('rNavami'),['rGirish','rLakshmi']);
 assert.deepEqual(parentsFor('rHeera'),['rVignesh','rSurya']);
 assert.deepEqual(parentsFor('sVijayakumaran'),[]);
 assert.deepEqual(parentsFor('sHema'),['sarojini','krishnan']);
 assert.deepEqual(parentsFor('sGaurav'),['sGirish','sLekshmi']);
 assert.equal(people.rGirish.generation,5);
 assert.equal(people.sGirish.generation,4);
 assert.ok(people.rVijayakumar.sourceNotes.length);
 assert.equal(people.rVijayakumar.name,'Vijayakumar S.');
 assert.equal(people.sVijayakumaran.name,'Vijayakumaran Thampy S');
});

test('Rajamma occupation details survive and the expanded branch has no overlapping households',()=>{
 assert.match(people.rThanu.note,/Tahsildar, Thuckalay/);
 assert.match(people.rKks.note,/Executive Engineer, P.W.D./);
 assert.match(people.rVasantha.note,/Keltron/);
 assert.match(people.rVivek.note,/Social Secretary/);
 const tree=layoutTree('rajamma',new Set(['rajamma',...descendantIds('rajamma')]));
 assert.equal(tree.truncated,false);
 for(const n of tree.nodes)for(const o of tree.nodes.filter(o=>o.depth===n.depth&&o.x>n.x))assert.ok(n.x+n.ownWidth<=o.x);
});
