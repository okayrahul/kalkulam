import {people,branchIds,spousesFor,childrenFor,childrenStatusFor,parentsFor,searchPeople,ancestryPath,branchFor,bloodRelative,descendantIds} from './family.js';
import {layoutTree,edgePath,nodeForPerson,PERSON_WIDTH,PERSON_HEIGHT,SPOUSE_GAP} from './tree-layout.js';
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const short=id=>people[id].name.replace(/^K\. /,'').replace(/ Thankachi$/,'');
const initials=id=>people[id].placeholder?'?':people[id].name.replace(/^(Dr\.|Capt\.)\s*/,'').split(/\s+/).filter(w=>w.length>1&&!w.endsWith('.')).slice(0,2).map(w=>w[0]).join('');
const viewport=$('tree-viewport'),world=$('tree-world');
let root='kumarapilla',expanded=new Set([root]),highlight=null,layout,version=0,visibleKey='',queued=false,transform={x:0,y:0,scale:.8};
let query='',returnHash='',lastWidth=0;
const total=Object.keys(people).length;
$('archive-count').textContent=String(total);
const generationCount=Math.max(...Object.values(people).map(p=>p.generation));
$('archive-generations').textContent='One family. '+(['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'][generationCount]||generationCount)+' generations.';
$('branch-select').innerHTML+='<optgroup label="The eleven founding branches">'+branchIds.map((id,i)=>`<option value="${id}">${String(i+1).padStart(2,'0')} · ${esc(people[id].name)}</option>`).join('')+'</optgroup>';
$('branch-shortcuts').innerHTML=branchIds.map((id,i)=>`<button data-focus="${id}" class="${childrenFor(id).length?'has-records':''}"><span>${String(i+1).padStart(2,'0')}</span>${esc(short(id))}${childrenFor(id).length?'<i>↗</i>':''}</button>`).join('');
function setStatus(text){$('tree-status').textContent=text;}
function treeHash(){return `#tree=${root}${highlight?'&focus='+highlight:''}`;}
function saveTreeHash(){history.replaceState(null,'',treeHash());}
function updateBreadcrumbs(){
 const path=ancestryPath(root),display=path.length>4?[path[0],...path.slice(-3)]:path;
 $('tree-breadcrumbs').innerHTML=display.map((id,i)=>`${i===1&&path.length>4?'<span class="crumb-divider" aria-label="Earlier generations omitted">/ … /</span>':i?'<span class="crumb-divider">/</span>':''}<button data-focus="${id}" ${id===root?'aria-current="location"':''}>${i===0&&id==='kumarapilla'?'Our family roots':esc(short(id))}</button>`).join('');
 for(const option of $('branch-select').querySelectorAll('[data-dynamic]'))option.remove();
 $('branch-select').value=branchIds.includes(root)||root==='kumarapilla'?root:'';
 if(!$('branch-select').value){const selected=document.createElement('option');selected.value=root;selected.textContent=people[root].name;selected.dataset.dynamic='true';$('branch-select').append(selected);$('branch-select').value=root;}
 for(const button of document.querySelectorAll('.branch-shortcuts button'))button.classList.toggle('chosen',button.dataset.focus===(branchFor(root)||root));
}
function renderTree({camera='readable',anchor=null}={}){
 const previous=anchor&&layout?nodeForPerson(layout,anchor):null;
 const screen=previous?{x:(previous.x+previous.ownWidth/2)*transform.scale+transform.x,y:previous.y*transform.scale+transform.y}:null;
 layout=layoutTree(root,expanded);version++;visibleKey='';
 world.style.width=layout.width+'px';world.style.height=layout.height+'px';
 const svg=$('tree-links');svg.setAttribute('width',layout.width);svg.setAttribute('height',layout.height);
 svg.innerHTML=`<defs><marker id="child-arrow" orient="auto" markerWidth="7" markerHeight="7" refX="5" refY="3"><path d="M1 1 L5 3 L1 5" fill="none" stroke="#9baf93" stroke-width="1.3"/></marker></defs>${layout.edges.map(e=>`<path class="descent-line" d="${edgePath(e)}" marker-end="url(#child-arrow)"/>`).join('')}`;
 updateBreadcrumbs();
 const count=new Set(layout.nodes.flatMap(n=>n.partners)).size;
 $('tree-summary').textContent=`${count} people in view · ${total} in the archive`;
 if(layout.truncated)setStatus('This view has reached its display limit. Focus on a smaller branch to continue exploring.');
 if(screen){const node=nodeForPerson(layout,anchor);transform.x=screen.x-(node.x+node.ownWidth/2)*transform.scale;transform.y=screen.y-node.y*transform.scale;applyTransform();}
 else if(camera==='fit')fitTree();else readableView();
}
function personCard(id,index,node){
 const p=people[id],selected=highlight===id,isMain=index===0;
 return `<button class="person-card ${isMain?'descendant-card':'spouse-card'} ${node.depth===0?'founding-card':''} ${selected?'person-highlight':''}" data-person="${id}" style="left:${index*(PERSON_WIDTH+SPOUSE_GAP)}px" aria-label="View ${esc(p.name)} details"><span class="person-meta"><span>${isMain?'GENERATION '+String(p.generation).padStart(2,'0'):'MARRIED TO'}</span>${p.photo?`<img class="person-photo" src="${esc(p.photo)}" alt="" loading="lazy" width="28" height="36">`:`<span class="person-initials" aria-hidden="true">${initials(id)}</span>`}</span><strong>${esc(p.name)}</strong>${p.placeholder?'<span class="person-place">Name not recorded</span>':p.sourceNotes?`<span class="person-place source-flag">${esc(p.sourceNoteTitle||'Source spelling to confirm')}</span>`:p.place?`<span class="person-place">⌖ ${esc(p.place)}</span>`:p.deceased?'<span class="person-place">In remembrance</span>':''}</button>`;
}
function groupMarkup(node){
 const children=childrenFor(node.id),open=expanded.has(node.id),special=node.id==='vishwanathan';
 const links=node.partners.slice(1).map((id,i)=>`<span class="marriage-link" style="left:${PERSON_WIDTH+i*(PERSON_WIDTH+SPOUSE_GAP)}px" aria-label="Married">↔</span>`).join('');
 return `<div class="family-unit ${special?'arumanai-unit':''}" style="left:${node.x}px;top:${node.y}px;width:${node.ownWidth}px" data-unit="${node.id}">${node.partners.map((id,i)=>personCard(id,i,node)).join('')}${links}<div class="unit-actions">${children.length?`<button class="expand-family ${open?'is-open':''}" data-expand="${node.id}" aria-expanded="${open}" aria-label="${open?'Collapse':'Expand'} ${esc(people[node.id].name)} descendants"><b>${open?'−':'+'}</b> ${children.length} ${children.length===1?'child':'children'} <span>${open?'hide':'explore'}</span></button>`:`<span class="unrecorded-leaf">${childrenStatusFor(node.id)==='confirmed-none'?'No children · confirmed in source':'Next chapter not yet recorded'}</span>`}${node.depth>0?`<button class="focus-family" data-focus="${node.id}" aria-label="Focus on ${esc(people[node.id].name)} family" title="Focus on this family">⌗</button>`:''}</div></div>`;
}
function renderVisible(){
 if(!layout)return;
 const margin=500,box={left:(-transform.x-margin)/transform.scale,right:(viewport.clientWidth-transform.x+margin)/transform.scale,top:(-transform.y-margin)/transform.scale,bottom:(viewport.clientHeight-transform.y+margin)/transform.scale};
 const active=document.activeElement?.closest('[data-unit]')?.dataset.unit;
 const visible=layout.nodes.filter(n=>n.id===active||(n.x+n.ownWidth>=box.left&&n.x<=box.right&&n.y+n.height>=box.top&&n.y<=box.bottom));
 const key=version+'|'+highlight+'|'+visible.map(n=>n.id).join(',');
 if(visibleKey!==key){const activeButton=document.activeElement?.closest('.family-unit button'),attribute=activeButton?['data-person','data-expand','data-focus'].find(a=>activeButton.hasAttribute(a)):null,activeValue=attribute&&activeButton.getAttribute(attribute);$('tree-nodes').innerHTML=visible.map(groupMarkup).join('');visibleKey=key;if(attribute)$('tree-nodes').querySelector('['+attribute+'="'+activeValue+'"]')?.focus({preventScroll:true});}
 renderMinimap();
}
function applyTransform(){world.style.transform=`translate(${transform.x}px,${transform.y}px) scale(${transform.scale})`;$('zoom-level').value=Math.round(transform.scale*100)+'%';viewport.style.backgroundPosition=`${transform.x}px ${transform.y}px`;viewport.style.backgroundSize=`${24*transform.scale}px ${24*transform.scale}px`;if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;renderVisible();});}}
function readableView(){const node=layout.nodes[0],scale=viewport.clientWidth<600?.65:.82;transform={scale,x:viewport.clientWidth/2-(node.x+node.ownWidth/2)*scale,y:48-node.y*scale};applyTransform();}
function fitTree(){const scale=Math.max(.025,Math.min(1,(viewport.clientWidth-65)/layout.width,(viewport.clientHeight-85)/layout.height));transform={scale,x:(viewport.clientWidth-layout.width*scale)/2,y:(viewport.clientHeight-layout.height*scale)/2-10};applyTransform();}
function centerOn(id,{scale=transform.scale}={}){const node=nodeForPerson(layout,id);if(!node)return;const i=node.partners.indexOf(id);transform={scale,x:viewport.clientWidth/2-(node.x+i*(PERSON_WIDTH+SPOUSE_GAP)+PERSON_WIDTH/2)*scale,y:viewport.clientHeight*.38-(node.y+PERSON_HEIGHT/2)*scale};applyTransform();}
function zoom(factor,cx=viewport.clientWidth/2,cy=viewport.clientHeight/2){const old=transform.scale,next=Math.max(.025,Math.min(2,old*factor));transform.x=cx-(cx-transform.x)*next/old;transform.y=cy-(cy-transform.y)*next/old;transform.scale=next;applyTransform();}
function showFamily(id,{scroll=true,hash=true}={}){
 if(!people[id])return;
 root=bloodRelative(id);highlight=id;expanded=new Set([root]);
 $('search-results').hidden=true;$('search').setAttribute('aria-expanded','false');
 renderTree();setStatus(childrenFor(root).length?`Exploring ${people[root].name}’s family. Expand a child’s branch to continue through the generations.`:`${people[root].name}’s descendants have not been recorded yet.`);
 if(hash)saveTreeHash();if(scroll){$('branches').scrollIntoView({behavior:'smooth',block:'start'});viewport.focus({preventScroll:true});}
}
function toggleBranch(id){
 if(expanded.has(id))expanded.delete(id);else expanded.add(id);
 highlight=id;renderTree({anchor:id});renderVisible();$('tree-nodes').querySelector('[data-expand="'+id+'"]')?.focus({preventScroll:true});setStatus(`${expanded.has(id)?'Opened':'Closed'} ${people[id].name}’s descendants.`);saveTreeHash();
}
function revealPerson(id,{scroll=true,hash=true}={}){
 if(!people[id])return;
 const relative=bloodRelative(id),path=ancestryPath(relative);
 if(!path.includes(root)){root=branchFor(relative)||path[0]||relative;expanded=new Set();}
 const begin=path.indexOf(root);for(const ancestor of path.slice(Math.max(0,begin)))expanded.add(ancestor);
 highlight=id;renderTree({camera:'none'});centerOn(id,{scale:viewport.clientWidth<600?.85:1});
 setStatus(`Located ${people[id].name} · generation ${people[id].generation}.`);
 if(hash)saveTreeHash();if(scroll)$('branches').scrollIntoView({behavior:'smooth',block:'start'});
}
function renderMinimap(){
 const padding=10,mapW=154,mapH=98,scale=Math.min((mapW-padding*2)/layout.width,(mapH-padding*2)/layout.height),ox=(mapW-layout.width*scale)/2,oy=(mapH-layout.height*scale)/2;
 $('minimap-svg').setAttribute('viewBox',`0 0 ${mapW} ${mapH}`);
 $('minimap-svg').innerHTML=`${layout.edges.map(e=>`<path d="M${ox+e.from.x*scale} ${oy+e.from.y*scale} L${ox+e.to.x*scale} ${oy+e.to.y*scale}" stroke="#bac6ac" fill="none" stroke-width=".6"/>`).join('')}${layout.nodes.map(n=>`<rect x="${ox+n.x*scale}" y="${oy+n.y*scale}" width="${Math.max(2,n.ownWidth*scale)}" height="${Math.max(2,PERSON_HEIGHT*scale)}" rx="1" fill="${n.partners.includes(highlight)?'#b08d4f':'#698169'}"/>`).join('')}<rect x="${ox-transform.x/transform.scale*scale}" y="${oy-transform.y/transform.scale*scale}" width="${viewport.clientWidth/transform.scale*scale}" height="${viewport.clientHeight/transform.scale*scale}" fill="#193e3510" stroke="#193e35" stroke-width="1"/>`;
 $('minimap')._map={scale,ox,oy};
}
$('minimap').onclick=e=>{if(e.detail===0){fitTree();return;}const r=$('minimap').getBoundingClientRect(),m=$('minimap')._map,x=(e.clientX-r.left)/r.width*154,y=(e.clientY-r.top)/r.height*98;transform.x=viewport.clientWidth/2-(x-m.ox)/m.scale*transform.scale;transform.y=viewport.clientHeight/2-(y-m.oy)/m.scale*transform.scale;applyTransform();};
$('zoom-in').onclick=()=>zoom(1.25);$('zoom-out').onclick=()=>zoom(.8);$('fit-tree').onclick=fitTree;$('reset-tree').onclick=readableView;
$('collapse-all').onclick=()=>{expanded=new Set([root]);highlight=root;renderTree();setStatus('Deeper generations collapsed. Open any branch to explore.');};
$('expand-all').onclick=()=>{expanded=new Set([root,...descendantIds(root)]);renderTree({camera:'fit'});if(!layout.truncated)setStatus('All recorded generations in this branch are open. Zoom in or focus on a family for a closer look.');};
$('branch-select').onchange=e=>showFamily(e.target.value);
$('dismiss-hint').onclick=()=>$('canvas-intro').hidden=true;
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('tree-shell').requestFullscreen();}catch{setStatus('Full screen is unavailable in this browser. You can still pan and zoom the tree.');}};
document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit full screen':'Expand family tree to full screen');});
function searchContext(id){const parents=parentsFor(id),spouses=spousesFor(id);return parents.length?'Child of '+parents.map(p=>people[p].name).join(' & '):spouses.length?'Partner of '+spouses.map(p=>people[p].name).join(', '):'Founding generation';}
function renderSearch(){
 const ids=query?searchPeople(query):[];
 $('search-results').hidden=!query;$('search').setAttribute('aria-expanded',String(!!query));
 if(!query)return;
 $('search-results').innerHTML=`<p class="search-count">${ids.length} ${ids.length===1?'connection':'connections'} found</p>`+(ids.length?ids.slice(0,20).map(id=>`<button data-locate="${id}"><span class="search-avatar">${initials(id)}</span><span><strong>${esc(people[id].name)}</strong><small>Generation ${people[id].generation}${branchFor(id)?' · '+esc(short(branchFor(id)))+' branch':''}</small><small>${esc(searchContext(id))}</small></span><i>↗</i></button>`).join('')+(ids.length>20?'<p class="search-count">Keep typing to narrow the results.</p>':''):'<p class="search-no-results">Try a shorter name, an alternate name, or a place.</p>');
}
$('search').addEventListener('input',e=>{query=e.target.value.trim();renderSearch();});
$('search').addEventListener('focus',()=>{if(query)renderSearch();});
$('search').addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();$('search-results').querySelector('button')?.focus();}if(e.key==='Escape'){$('search-results').hidden=true;$('search').setAttribute('aria-expanded','false');}if(e.key==='Enter'){const id=searchPeople(query)[0];if(id){e.preventDefault();revealPerson(id);$('search-results').hidden=true;$('search').setAttribute('aria-expanded','false');$('search').blur();}}});
function relatives(label,ids){return ids.length?`<p class="relationship-label">${label}</p>${ids.map(id=>`<button class="relative" data-person="${id}">${esc(people[id].name)}<span>↗</span></button>`).join('')}`:'';}
function openPerson(id,{hash=true}={}){
 if(!people[id])return;
 if(!$('person-dialog').open)returnHash=treeHash();
 const p=people[id],children=childrenFor(id),parents=parentsFor(id),spouses=spousesFor(id),branch=branchFor(id);
 $('person-content').innerHTML=`${p.photo?`<img class="profile-photo" src="${esc(p.photo)}" alt="Portrait of ${esc(p.name)}" width="70" height="90">`:`<div class="avatar profile-avatar">${initials(id)}</div>`}<p class="eyebrow">GENERATION ${String(p.generation).padStart(2,'0')}${p.deceased?' · REMEMBERED':''}${p.placeholder?' · NAME NOT RECORDED':''}</p><h2 id="person-title">${esc(p.name)}</h2>${p.aliases?.length?`<p>Also recorded as ${p.aliases.map(esc).join(', ')}</p>`:''}${p.place?`<p class="place">${esc(p.place)}</p>`:''}${p.note?`<p>${esc(p.note)}</p>`:''}${p.sourceNotes?`<div class="record-note"><strong>${esc(p.sourceNoteTitle||'Source spelling to confirm')}</strong>${p.sourceNotes.map(n=>`<p>${esc(n)}</p>`).join('')}</div>`:''}<p class="source-note">${branch?`<button class="subtle-button" data-profile-focus="${branch}">${esc(short(branch))} branch</button>`:'Our founding generation'}${!parents.length&&p.generation>1?' · Connected through marriage':''}</p><div class="profile-relations">${relatives('PARENTS',parents)}${relatives('MARRIED TO',spouses)}${relatives(`${children.length} RECORDED ${children.length===1?'CHILD':'CHILDREN'}`,children)}</div>${children.length?'':childrenStatusFor(id)==='confirmed-none'?'<div class="profile-empty"><strong>No children</strong><p>The supplied PDF explicitly states that this couple had no children.</p></div>':`<div class="profile-empty"><strong>There is more to this story.</strong><p>Descendants have not been added to this part of the archive yet.</p></div>`}<div class="profile-actions"><button class="solid-button" id="profile-explore">Explore this family</button><button class="subtle-button" id="profile-locate">Locate in tree</button><button class="subtle-button" id="copy-link">Copy link</button></div><p id="copy-status" class="copy-status" aria-live="polite"></p>`;
 $('profile-explore').onclick=()=>{$('person-dialog').close();showFamily(id);};
 $('profile-locate').onclick=()=>{$('person-dialog').close();revealPerson(id);};
 $('copy-link').onclick=async()=>{try{await navigator.clipboard.writeText(new URL(`#person=${id}`,location.href).href);$('copy-status').textContent='Family link copied.';}catch{$('copy-status').textContent='Copy this page’s address to share this person.';}};
 if(!$('person-dialog').open)$('person-dialog').showModal();$('person-dialog').querySelector('.dialog-close').focus();
 if(hash)history.replaceState(null,'',`#person=${id}`);
}
document.addEventListener('click',e=>{
 const locate=e.target.closest('[data-locate]'),expand=e.target.closest('[data-expand]'),focus=e.target.closest('[data-focus]'),person=e.target.closest('[data-person]'),profileFocus=e.target.closest('[data-profile-focus]');
 if(locate){$('search-results').hidden=true;$('search').setAttribute('aria-expanded','false');revealPerson(locate.dataset.locate);}
 else if(expand)toggleBranch(expand.dataset.expand);
 else if(focus)showFamily(focus.dataset.focus);
 else if(person)openPerson(person.dataset.person);
 else if(profileFocus){$('person-dialog').close();showFamily(profileFocus.dataset.profileFocus);}
 if(!e.target.closest('.search-area')){$('search-results').hidden=true;$('search').setAttribute('aria-expanded','false');}
});
for(const dialog of document.querySelectorAll('dialog')){dialog.querySelector('.dialog-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{if(dialog.id==='person-dialog'&&location.hash.startsWith('#person='))history.replaceState(null,'',returnHash||treeHash());});}
$('about-button').onclick=()=>$('about-dialog').showModal();
document.addEventListener('keydown',e=>{if(e.key==='/'&&!document.querySelector('dialog[open]')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();$('search').focus();}});
viewport.addEventListener('focusin',e=>{const unit=e.target.closest('[data-unit]');if(!unit)return;const r=e.target.getBoundingClientRect(),v=viewport.getBoundingClientRect();if(r.left<v.left+10||r.right>v.right-10||r.top<v.top+10||r.bottom>v.bottom-10)centerOn(e.target.dataset.person||unit.dataset.unit);});
viewport.addEventListener('scroll',()=>{if(viewport.scrollLeft||viewport.scrollTop){viewport.scrollLeft=0;viewport.scrollTop=0;}});
// Pointer gestures support mouse drag and two-finger pinch without hijacking buttons.
const pointers=new Map();let gesture=null,suppressClickUntil=0;
function point(e){const r=viewport.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
viewport.addEventListener('pointerdown',e=>{if(e.target.closest('.tree-controls,.minimap,.canvas-intro'))return;const p=point(e);pointers.set(e.pointerId,p);if(pointers.size===1){gesture={type:'pan',start:p,tx:transform.x,ty:transform.y,moved:false};if(!e.target.closest('button'))viewport.setPointerCapture(e.pointerId);}else if(pointers.size===2){const [a,b]=[...pointers.values()],center={x:(a.x+b.x)/2,y:(a.y+b.y)/2};gesture={type:'pinch',distance:Math.hypot(a.x-b.x,a.y-b.y),scale:transform.scale,worldX:(center.x-transform.x)/transform.scale,worldY:(center.y-transform.y)/transform.scale,moved:true};suppressClickUntil=performance.now()+500;}});
viewport.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId)||!gesture)return;pointers.set(e.pointerId,point(e));if(gesture.type==='pinch'&&pointers.size===2){const [a,b]=[...pointers.values()],scale=Math.max(.025,Math.min(2,gesture.scale*Math.hypot(a.x-b.x,a.y-b.y)/gesture.distance));transform={scale,x:(a.x+b.x)/2-gesture.worldX*scale,y:(a.y+b.y)/2-gesture.worldY*scale};suppressClickUntil=performance.now()+500;applyTransform();}else if(gesture.type==='pan'){const p=point(e),dx=p.x-gesture.start.x,dy=p.y-gesture.start.y;if(Math.abs(dx)+Math.abs(dy)>5)gesture.moved=true;if(gesture.moved){viewport.setPointerCapture(e.pointerId);transform.x=gesture.tx+dx;transform.y=gesture.ty+dy;viewport.classList.add('dragging');suppressClickUntil=performance.now()+500;applyTransform();}}});
function endPointer(e){pointers.delete(e.pointerId);if(pointers.size===1){const p=[...pointers.values()][0];gesture={type:'pan',start:p,tx:transform.x,ty:transform.y,moved:false};}else if(!pointers.size){gesture=null;viewport.classList.remove('dragging');}}
viewport.addEventListener('pointerup',endPointer);viewport.addEventListener('pointercancel',endPointer);
viewport.addEventListener('click',e=>{if(performance.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
viewport.addEventListener('wheel',e=>{if(e.target.closest('.tree-controls,.minimap'))return;e.preventDefault();if(e.ctrlKey||e.metaKey){const p=point(e);zoom(Math.exp(-e.deltaY*.008),p.x,p.y);}else{transform.x-=e.deltaX;transform.y-=e.deltaY;applyTransform();}},{passive:false});
viewport.addEventListener('keydown',e=>{if(e.target!==viewport)return;const steps={ArrowLeft:[70,0],ArrowRight:[-70,0],ArrowUp:[0,70],ArrowDown:[0,-70]};if(steps[e.key]){e.preventDefault();transform.x+=steps[e.key][0];transform.y+=steps[e.key][1];applyTransform();}if(['+','=','-'].includes(e.key)){e.preventDefault();zoom(e.key==='-'?.8:1.25);}if(e.key==='Home'){e.preventDefault();readableView();}});
new ResizeObserver(()=>{if(layout&&Math.abs(viewport.clientWidth-lastWidth)>1){lastWidth=viewport.clientWidth;readableView();}}).observe(viewport);
function handleHash(){const p=new URLSearchParams(location.hash.slice(1)),id=p.get('person'),tree=p.get('tree'),focus=p.get('focus');if(tree&&people[tree])showFamily(tree,{hash:false,scroll:false});if(focus&&people[focus])revealPerson(focus,{hash:false,scroll:false});if(id&&people[id]){revealPerson(id,{hash:false,scroll:false});openPerson(id,{hash:false});}}
window.addEventListener('hashchange',handleHash);renderTree();setStatus('Eleven branches begin with one family. Open a branch to see the next generation.');handleHash();
