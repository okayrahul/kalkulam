import {people,branchIds,spousesFor,childrenFor,parentsFor,searchPeople,searchBranches} from './family.js';
const $=id=>document.getElementById(id);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=id=>people[id].name.split(/\s+/).filter(w=>!w.endsWith('.')).slice(0,2).map(w=>w[0]).join('');
let query='',view='directory',treeFocus='kumarapilla',graphSize={width:3000,height:550};
function renderDirectory(){
 const ids=searchBranches(query), other=(query?searchPeople(query):[]).filter(id=>['kumarapilla','valliyamma'].includes(id));
 $('results-count').textContent=query?`${ids.length} matching branch${ids.length===1?'':'s'}${other.length?' · '+other.length+' ancestor'+(other.length===1?'':'s'):''}`:'11 family branches';
 $('clear-search').hidden=!query;
 $('directory').innerHTML=other.map(id=>`<article class="branch-card"><div class="card-top">FOUNDING GENERATION</div><h3>${escape(people[id].name)}</h3><p class="place">Oldest known ancestor</p><div class="card-bottom"><small>11 recorded children</small><button data-person="${id}">View ancestor</button></div></article>`).join('')+ids.map(id=>{
 const p=people[id],spouses=spousesFor(id),children=childrenFor(id),n=branchIds.indexOf(id)+1;
 return `<article class="branch-card"><div class="card-top"><span class="branch-number">${String(n).padStart(2,'0')}</span><span>FAMILY BRANCH</span><span class="card-motif" aria-hidden="true">${['♧','❋','✧'][n%3]}</span></div><h3>${escape(p.name)}</h3>${p.place?`<p class="place">${escape(p.place)}</p>`:''}<p class="spouse-line ${spouses.length?'':'unrecorded'}">${spouses.length?'<span aria-label="Married">↔</span> '+spouses.map(s=>escape(people[s].name)).join(', '):'Spouse not yet recorded'}</p><div class="card-bottom"><small>${children.length?children.length+' recorded children':'Next generation to be added'}</small><button data-person="${id}" aria-label="Explore ${escape(p.name)} branch">Explore branch</button></div></article>`;
 }).join('')||'<div class="empty"><h3>No connections found yet.</h3><p>Try a shorter name, an alternate name, or a place.</p><button class="solid-button" id="empty-clear">Show all branches</button></div>';
 if($('empty-clear'))$('empty-clear').onclick=clearSearch;
}
function clearSearch(){$('search').value='';query='';renderDirectory();if(view==='tree')renderTree();$('search').focus();}
$('search').addEventListener('input',e=>{query=e.target.value.trim();renderDirectory();if(view==='tree')renderTree();});
$('clear-search').onclick=clearSearch;
function setView(next){view=next;$('directory').hidden=next!=='directory';$('tree-panel').hidden=next!=='tree';for(const [id,mode] of [['directory-view','directory'],['tree-view','tree']]){$(id).classList.toggle('selected',next===mode);$(id).setAttribute('aria-pressed',String(next===mode));}if(next==='tree'){renderTree();}}
$('directory-view').onclick=()=>setView('directory');$('tree-view').onclick=()=>setView('tree');
function relatives(label,ids){return ids.length?`<p class="relationship-label">${label}</p>${ids.map(id=>`<button class="relative" data-person="${id}">${escape(people[id].name)}<span>↗</span></button>`).join('')}`:'';}
function openPerson(id,updateHash=true){
 if(!people[id])return;
 const p=people[id],children=childrenFor(id),parents=parentsFor(id),spouses=spousesFor(id);
 const path=parents.length?`<button class="subtle-button" data-person="kumarapilla">Our founding generation</button> <span aria-hidden="true"> / </span> Branch ${String(branchIds.indexOf(id)+1).padStart(2,'0')}`:(spouses.some(s=>parentsFor(s).length)?'Connected through marriage':'Our founding generation');
 $('person-content').innerHTML=`<div class="avatar profile-avatar">${initials(id)}</div><p class="eyebrow">GENERATION ${String(p.generation).padStart(2,'0')}${p.deceased?' · REMEMBERED':''}</p><h2 id="person-title">${escape(p.name)}</h2>${p.aliases?.length?`<p>Also recorded as ${p.aliases.map(escape).join(', ')}</p>`:''}${p.place?`<p class="place">${escape(p.place)}</p>`:''}${p.note?`<p>${escape(p.note)}</p>`:''}<p class="source-note">${path}</p><div class="profile-relations">${relatives('PARENTS',parents)}${relatives('MARRIED TO',spouses)}${relatives(`${children.length} RECORDED CHILDREN`,children)}</div>${children.length?'':`<div class="profile-empty"><strong>The next chapter is still to come.</strong><p>Descendants of this branch have not been added to the archive yet.</p></div>`}<div class="profile-actions"><button class="solid-button" id="focus-branch">${children.length?'Explore descendants':'View branch in tree'}</button><button class="subtle-button" id="copy-link">Copy link</button></div><p id="copy-status" class="copy-status" aria-live="polite"></p>`;
 $('focus-branch').onclick=()=>{$('person-dialog').close();query='';$('search').value='';renderDirectory();treeFocus=id;setView('tree');$('branches').scrollIntoView({behavior:'smooth'});};
 $('copy-link').onclick=async()=>{try{await navigator.clipboard.writeText(new URL(`#person=${id}`,location.href).href);$('copy-status').textContent='Family link copied.';}catch{$('copy-status').textContent='Copy this page’s address to share this person.';}};
 if(!$('person-dialog').open)$('person-dialog').showModal();$('person-dialog').querySelector('.dialog-close').focus();
 if(updateHash)history.replaceState(null,'',`#person=${id}`);
}
// Delegation keeps expanding relationships lightweight, even when the archive grows.
document.addEventListener('click',e=>{const target=e.target.closest('[data-person]');if(target)openPerson(target.dataset.person);});
for(const dialog of document.querySelectorAll('dialog')){dialog.querySelector('.dialog-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{if(dialog.id==='person-dialog'&&location.hash.startsWith('#person='))history.replaceState(null,'','#branches');});}
$('about-button').onclick=()=>$('about-dialog').showModal();
document.addEventListener('keydown',e=>{if(e.key==='/'&&!document.querySelector('dialog[open]')&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('search').focus();}});
let transform={x:0,y:0,scale:1};
const world=$('tree-world'), viewport=$('tree-viewport');
function applyTransform(){world.style.transform=`translate(${transform.x}px,${transform.y}px) scale(${transform.scale})`;$('zoom-level').value=Math.round(transform.scale*100)+'%';}
function fitTree(){const scale=Math.min(1,(viewport.clientWidth-45)/graphSize.width,(viewport.clientHeight-50)/graphSize.height);transform={scale,x:(viewport.clientWidth-graphSize.width*scale)/2,y:25};applyTransform();}
function resetTree(){transform={scale:.85,x:viewport.clientWidth/2-graphSize.width*.85/2,y:30};applyTransform();}
function zoom(factor){const old=transform.scale,next=Math.max(.12,Math.min(2,old*factor)),cx=viewport.clientWidth/2,cy=viewport.clientHeight/2;transform.x=cx-(cx-transform.x)*next/old;transform.y=cy-(cy-transform.y)*next/old;transform.scale=next;applyTransform();}
function treeNode(id,x,y,root=false){const p=people[id];return `<button class="tree-node ${root?'root':''}" data-person="${id}" style="left:${x}px;top:${y}px"><small>${root?'GENERATION '+String(p.generation).padStart(2,'0'):'FAMILY BRANCH '+String(branchIds.indexOf(id)+1).padStart(2,'0')}</small><b>${escape(p.name)}</b>${p.place?`<i>${escape(p.place)}</i>`:''}${!root&&spousesFor(id).length?`<span class="tree-spouse">↔ ${spousesFor(id).map(s=>escape(people[s].name)).join(', ')}</span>`:''}</button>`;}
function renderTree(){
 const current=people[treeFocus]?treeFocus:'kumarapilla',partners=[current,...spousesFor(current)];
 const matches=new Set(searchPeople(query));
 const children=childrenFor(current).filter(id=>!query||matches.has(id)||spousesFor(id).some(s=>matches.has(s)));
 const vertical=viewport.clientWidth<600;
 const width=vertical?560:Math.max(660,children.length*270+30),center=width/2,rootWidth=partners.length*270-30,rootX=center-rootWidth/2;
 graphSize={width,height:children.length?(vertical?children.length*200+310:535):355};
 let nodes=partners.map((id,i)=>treeNode(id,rootX+i*270,30,true)).join('');
 let lines='';
 if(partners.length>1)lines+=`<path d="M ${rootX+240} 83 H ${rootX+270}" marker-start="url(#arrow)" marker-end="url(#arrow)"/>`;
 if(children.length){if(vertical){lines+=`<path d="M ${center} ${partners.length>1?83:140} V 225 H 125 V ${355+(children.length-1)*200}"/>`;children.forEach((id,i)=>{const y=300+i*200;lines+=`<path d="M 125 ${y+55} H 160"/>`;nodes+=treeNode(id,160,y);});}else{const first=(width-children.length*270+30)/2;lines+=`<path d="M ${center} ${partners.length>1?83:140} V 235 H ${first+120} M ${center} 235 H ${first+(children.length-1)*270+120}"/>`;children.forEach((id,i)=>{const x=first+i*270;lines+=`<path d="M ${x+120} 235 V 300"/>`;nodes+=treeNode(id,x,300);});}}
 world.style.width=width+'px';world.style.height=graphSize.height+'px';
 world.innerHTML=`<svg width="${width}" height="${graphSize.height}" aria-hidden="true"><defs><marker id="arrow" orient="auto-start-reverse" markerWidth="5" markerHeight="5" refX="3" refY="2.5"><path d="M0 0L4 2.5L0 5" fill="none" stroke="#a99565"/></marker></defs><g fill="none" stroke="#9baa8e" stroke-width="1.5">${lines}</g></svg>${nodes}${!children.length?`<div style="position:absolute;top:235px;left:${center-190}px;width:380px;text-align:center;font:14px Georgia;color:#78826e">${query?'No matching children in this view. Clear search or return to all branches.':'Descendants have not been recorded yet.'}</div>`:''}`;
 // Canvas is a bounded neighborhood, never a full multi-generation DOM.
 if(!$('tree-home')){const home=document.createElement('button');home.id='tree-home';home.textContent='↶ All branches';home.className='subtle-button';home.onclick=()=>{treeFocus='kumarapilla';renderTree();};document.querySelector('.canvas-help').prepend(home);}
 $('tree-home').hidden=['kumarapilla','valliyamma'].includes(current);if(vertical){const scale=Math.min(1,(viewport.clientWidth-30)/width);transform={scale,x:(viewport.clientWidth-width*scale)/2,y:25};applyTransform();}else fitTree();
}
$('zoom-in').onclick=()=>zoom(1.25);$('zoom-out').onclick=()=>zoom(.8);$('fit-tree').onclick=fitTree;$('reset-tree').onclick=resetTree;
let drag=null,moved=false;
viewport.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;drag={x:e.clientX,y:e.clientY,tx:transform.x,ty:transform.y};moved=false;viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging');});
viewport.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved ||= Math.abs(dx)+Math.abs(dy)>5;transform.x=drag.tx+dx;transform.y=drag.ty+dy;applyTransform();});
for(const event of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(event,()=>{drag=null;viewport.classList.remove('dragging');});
viewport.addEventListener('keydown',e=>{const steps={ArrowLeft:[50,0],ArrowRight:[-50,0],ArrowUp:[0,50],ArrowDown:[0,-50]};if(steps[e.key]){e.preventDefault();transform.x+=steps[e.key][0];transform.y+=steps[e.key][1];applyTransform();}if(['+','=','-'].includes(e.key)){e.preventDefault();zoom(e.key==='-'?.8:1.25);}});
let lastWidth=0;new ResizeObserver(()=>{if(view==='tree'&&Math.abs(viewport.clientWidth-lastWidth)>1){lastWidth=viewport.clientWidth;renderTree();}}).observe(viewport);
function handleHash(){const id=new URLSearchParams(location.hash.slice(1)).get('person');if(id&&people[id])openPerson(id,false);}
window.addEventListener('hashchange',handleHash);renderDirectory();handleHash();
