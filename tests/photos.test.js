import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {people,parentsFor,spousesFor} from '../src/family.js';
import {photoGroups,groupPhotosForPerson} from '../src/photos.js';

test('The new individual portraits attach to existing people without renaming them',()=>{
 for(const [id,name,file] of [['chandrika','Chandrika','chandrika'],['padmanabhan','K. Padmanabhan Nair','padmanabhan'],['sundar','S. S. Sundar','sundar'],['beenaSundar','Beena Sundar','beena-sundar']]){
  assert.equal(people[id].name,name);
  assert.equal(people[id].photo,'./assets/photos/'+file+'.webp');
  assert.ok(existsSync(new URL('../'+people[id].photo,import.meta.url)));
 }
 assert.equal(Object.keys(people).length,509);
});

test('Both ancestor couple photos appear on each spouse profile in the pictured order',()=>{
 assert.deepEqual(groupPhotosForPerson('vishwanathan')[0].rows[0].people,['vishwanathan','ananda']);
 assert.equal(groupPhotosForPerson('vishwanathan')[0],groupPhotosForPerson('ananda')[0]);
 assert.deepEqual(spousesFor('vishwanathan'),['ananda']);
 assert.deepEqual(groupPhotosForPerson('sarojini')[0].rows[0].people,['krishnan','sarojini']);
 assert.equal(groupPhotosForPerson('sarojini')[0],groupPhotosForPerson('krishnan')[0]);
});

test('Arun, Sahana and Avira share one full family photo, never individual crops',()=>{
 const group=groupPhotosForPerson('arun')[0];
 assert.deepEqual(group.rows[0].people,['arun','avira','sahana']);
 for(const id of ['arun','sahana','avira']){
  assert.equal(groupPhotosForPerson(id)[0],group);
  assert.equal(people[id].photo,undefined);
 }
 assert.deepEqual(parentsFor('avira'),['arun','sahana']);
 assert.equal(group.width/group.height,3/4);
});

test('Gauthami’s family caption keeps Akshara, Aditi and Aarav in the user-specified positions',()=>{
 const group=groupPhotosForPerson('gauthami')[0];
 assert.deepEqual(group.rows[0].people,['gauthami','akshara','aditi','sundaram']);
 assert.deepEqual(group.rows[1],{label:'Below Dr. Sundaram Rajaram',people:['aarav']});
 for(const id of ['gauthami','sundaram','akshara','aditi','aarav'])assert.equal(groupPhotosForPerson(id)[0],group);
});

test('Shared photos have valid members and real assets, with no unintended branch assignments',()=>{
 assert.equal(photoGroups.length,4);
 for(const group of photoGroups){
  assert.ok(existsSync(new URL('../'+group.src,import.meta.url)));
  const ids=group.rows.flatMap(row=>row.people);
  assert.equal(new Set(ids).size,ids.length);
  for(const id of ids)assert.ok(people[id],id);
 }
 assert.deepEqual(groupPhotosForPerson('tBeena'),[]);
 assert.deepEqual(groupPhotosForPerson('rahul'),[]);
});
