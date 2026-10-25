import {people,spousesFor,childrenFor} from './family.js';
export const PERSON_WIDTH=208, PERSON_HEIGHT=126, SPOUSE_GAP=34, LEVEL_GAP=280;
/** A tidy family tree. Only expanded descendants enter the layout. */
export function layoutTree(rootId, expanded=new Set(), {maxNodes=1200}={}) {
  if(!people[rootId])throw Error('Unknown tree root '+rootId);
  let count=0,truncated=false;
  function measure(id,path=new Set()) {
    if(path.has(id))throw Error('Tree cycle '+id);
    if(count>=maxNodes){truncated=true;return null;}
    count++;
    const partners=[id,...spousesFor(id)], ownWidth=partners.length*PERSON_WIDTH+(partners.length-1)*SPOUSE_GAP;
    const nextPath=new Set([...path,id]);
    const children=(expanded.has(id)?childrenFor(id):[]).map(child=>measure(child,nextPath)).filter(Boolean);
    const childrenWidth=children.reduce((sum,n)=>sum+n.width,0)+Math.max(0,children.length-1)*48;
    return {id,partners,ownWidth,width:Math.max(ownWidth,childrenWidth),children};
  }
  const tree=measure(rootId),nodes=[],edges=[];
  function position(node,left,depth){
    const x=left+(node.width-node.ownWidth)/2,y=48+depth*LEVEL_GAP;
    const placed={...node,x,y,depth,height:176};nodes.push(placed);
    const cw=node.children.reduce((sum,c)=>sum+c.width,0)+Math.max(0,node.children.length-1)*48;
    let childLeft=left+(node.width-cw)/2;
    for(const child of node.children){const childX=childLeft+(child.width-child.ownWidth)/2;edges.push({parent:node.id,child:child.id,from:{x:x+node.ownWidth/2,y:y+PERSON_HEIGHT/2},to:{x:childX+PERSON_WIDTH/2,y:y+LEVEL_GAP},single:node.partners.length===1});position(child,childLeft,depth+1);childLeft+=child.width+48;}
  }
  position(tree,48,0);
  return {nodes,edges,width:tree.width+96,height:Math.max(...nodes.map(n=>n.y+n.height))+60,truncated};
}
export function edgePath(edge){const startY=edge.single?edge.from.y+PERSON_HEIGHT/2:edge.from.y;const railY=edge.to.y-65;return `M ${edge.from.x} ${startY} V ${railY} H ${edge.to.x} V ${edge.to.y}`;}
export function nodeForPerson(layout,id){return layout.nodes.find(n=>n.partners.includes(id));}
