import {test} from 'node:test';
import assert from 'node:assert/strict';
import {people,families,childrenFor,parentsFor,spousesFor,branchFor,descendantIds} from '../src/family.js';
import {layoutTree} from '../src/tree-layout.js';
import {nangakoikkalPeople} from '../src/nangakoikkal.js';

test('Nangakoikkal joins Thankamma and preserves the explicitly supplied elder-to-younger order',()=>{
  const order=['ngSethu','ngSubhadra','ngGanga','ngParu','ngRadha','ngIndira','ngRajalekshmi','ngNirmala','ngRajmohan','ngVinodini','ngVenu'];
  assert.equal(people.thankamma.name,'V. Thankamma Thankachi');
  assert.deepEqual(spousesFor('thankamma'),['ngSankaran']);
  assert.deepEqual(childrenFor('thankamma'),order);
  assert.deepEqual(childrenFor('ngSankaran'),order);
  order.forEach((id,index)=>assert.equal(people[id].siblingOrder,index+1));
  for(const id of Object.keys(nangakoikkalPeople)) assert.equal(branchFor(id),'thankamma',id);
});

test('The shared Yamuna and Dileep marriage has one set of children and two ancestral connections',()=>{
  assert.deepEqual(parentsFor('ngYamuna'),['ngGanga','ngVimala']);
  assert.deepEqual(parentsFor('ngDileep'),['ngParu','ngMadhavan']);
  const unions=families.filter(f=>f.partners.includes('ngYamuna')&&f.partners.includes('ngDileep'));
  assert.equal(unions.length,1);
  assert.deepEqual(childrenFor('ngYamuna'),['ngAravind','ngAparnaAnjith']);
  assert.deepEqual(childrenFor('ngDileep'),childrenFor('ngYamuna'));
  assert.deepEqual(parentsFor('ngAparnaAnjith'),['ngDileep','ngYamuna']);
  assert.ok(descendantIds('ngGanga').includes('ngJhillika'));
  assert.ok(descendantIds('ngParu').includes('ngJhillika'));
});

test('Radhika follows the diagram and provisional Pooja relationships remain explicit',()=>{
  assert.deepEqual(childrenFor('ngSethu'),['ngAsok','ngPadmakumar','ngArunKumar']);
  assert.deepEqual(parentsFor('ngRadhika'),['ngAsok','ngNalina']);
  assert.deepEqual(childrenFor('ngRadhika'),['ngSaiKrishna','ngAnugraha']);
  assert.deepEqual(childrenFor('ngPooja'),['ngMalavika','ngSwasthika']);
  assert.ok(families.find(f=>f.id==='nangakoikkal-pooja').relationshipStatus);
  assert.equal(people.ngSreelatha.phone,undefined);
  assert.equal(people.ngParu.familyContacts[0].phone,'9446288177');
});

test('Full branch expansion stays within budget and retains every person across shared paths',()=>{
  const tree=layoutTree('thankamma',new Set(['thankamma',...descendantIds('thankamma')]));
  assert.equal(tree.truncated,false);
  const ids=new Set(tree.nodes.flatMap(n=>n.partners));
  assert.equal(ids.size,Object.keys(nangakoikkalPeople).length+1);
  for(const node of tree.nodes){
    for(const other of tree.nodes.filter(n=>n.depth===node.depth&&n.x>node.x)){
      assert.ok(node.x+node.ownWidth<=other.x);
    }
  }
  assert.deepEqual(people.ngReghunath.phones,['9447033111','9446176211']);
});
