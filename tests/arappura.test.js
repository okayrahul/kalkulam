import {test} from 'node:test';
import assert from 'node:assert/strict';
import {people,families,childrenFor,parentsFor,spousesFor,descendantIds,branchFor,ancestryPath,searchPeople} from '../src/family.js';
import {arappuraPeople,arappuraFamilies} from '../src/arappura.js';
import {layoutTree} from '../src/tree-layout.js';

test('The corrected founders retain stable links and thirteen source families',()=>{
 assert.equal(people.ananda.name,'Anandavalli Amma');
 assert.deepEqual(spousesFor('ananda'),['vishwanathan']);
 assert.equal(people.sarada.name,'V. Sharada Thankachy');
 assert.deepEqual(spousesFor('sarada'),['aMadhavan']);
 assert.deepEqual(childrenFor('sarada'),['aLeelavathi','aSanthakumari','aThulasibai','aNalini','aRugmini','aGomathy','aVimala','aJayalakshmi','aVasantha','aVenugopalan','aRajalakshmi','aKrishnanThampi','aRamadas']);
 assert.ok(searchPeople('Sarada').includes('sarada'));
 assert.equal(people.aSaradaP.name,'Sarada P Nair');
});

test('All address-book people connect to Sharada with complete source pages and generation assignments',()=>{
 assert.equal(Object.keys(arappuraPeople).length,161);
 assert.equal(arappuraFamilies.length,57);
 assert.equal(descendantIds('sarada').length,104);
 for(const [id,p] of Object.entries(arappuraPeople)){
  assert.equal(branchFor(id),'sarada',id);
  assert.ok(p.source.page>=1&&p.source.page<=12);
  assert.ok(p.source.relationship);
  for(const parent of parentsFor(id))assert.equal(p.generation,people[parent].generation+1,id);
 }
 assert.deepEqual([...new Set(Object.values(arappuraPeople).map(p=>p.source.page))].sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i+1));
});

test('Page continuations keep partners and children in the correct household',()=>{
 assert.deepEqual(parentsFor('aBharath'),['aArchana','aViplab']);
 assert.deepEqual(parentsFor('aRadha'),['aRugmini','aKarunakaran']);
 assert.equal(people.aRadha.phone,'9061501315');
 assert.deepEqual(spousesFor('aGopika'),['aSajilal']);
 assert.deepEqual(parentsFor('aNandhitha'),['aGopika','aSajilal']);
 assert.deepEqual(parentsFor('aSaathvik'),['aAadityakumar','aGowri']);
 assert.deepEqual(childrenFor('aRamadas'),['aNandagopan','aSankaran']);
 assert.deepEqual(ancestryPath('aSouparnika'),['kumarapilla','sarada','aLeelavathi','aRaghunathan','aRoshna','aSouparnika']);
});

test('All 104 printed phone entries retain source formatting, shared values, and distinct near-matches',()=>{
 assert.equal(Object.values(arappuraPeople).filter(p=>p.phone).length,104);
 assert.equal(people.aGauri.phone,'0064225362223');
 assert.equal(people.aPraveen.phone,'80920 84773');
 assert.equal(people.aVeena.phone,'+1 404 7470700');
 assert.equal(people.aAkshay.phone,'00447931416366');
 assert.equal(people.aAkshay.phone,people.aSanjana.phone);
 assert.equal(people.aSabarinath.phone,people.aArathi.phone);
 for(const id of ['aBhargavi','aJagdish','aAditi','aDiti','aKruti'])assert.equal(people[id].phone,'+971509453727');
 assert.equal(people.aJayalakshmi.phone,'9946356709');
 assert.equal(people.aMadhavanNair.phone,'9846356709');
 assert.equal(people.aSouparnika.phone,undefined);
});

test('Names shared with earlier branches remain separate and source-only late labels are preserved',()=>{
 assert.deepEqual(spousesFor('aSreekumar'),['aAmbika']);
 assert.deepEqual(spousesFor('tSreekumar'),['tBeena']);
 assert.deepEqual(spousesFor('aKrishnan'),['aLeelavathi']);
 assert.deepEqual(spousesFor('krishnan'),['sarojini']);
 assert.equal(people.aUsha.deceased,true);
 assert.equal(people.aUshaL.deceased,true);
 assert.equal(people.aRajalakshmi.deceased,undefined);
 assert.equal(people.aRadhakrishnan.deceased,undefined);
});

test('The expanded Arappura flowchart contains every person without overlapping couples',()=>{
 const tree=layoutTree('sarada',new Set(['sarada',...descendantIds('sarada')]));
 assert.equal(new Set(tree.nodes.flatMap(n=>n.partners)).size,162);
 assert.equal(tree.truncated,false);
 for(const n of tree.nodes)for(const o of tree.nodes.filter(o=>o.depth===n.depth&&o.x>n.x))assert.ok(n.x+n.ownWidth<=o.x);
 assert.equal(families.length,182);
});
