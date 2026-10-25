// Stable IDs and explicit family unions allow any number of generations and marriages.
export const people = {
  kumarapilla: {name:'Kalkulam T. Kumarapilla', generation:1},
  valliyamma: {name:'Valliyamma Pilla Thankachi', generation:1, aliases:['Viliyamma Pilla Thankachi']},
  tanuvan: {name:'Tanuvan Thampi', generation:2, place:'Poojapura, TVM', note:'Sub Registrar'},
  lekshmi: {name:'Lekshmi Kutty', generation:2},
  parameshwaran: {name:'K. Parameshwaran Thampi', generation:2, place:'Pullu'},
  pankajakshi: {name:'Pankajakshi Amma', generation:2},
  vishwanathan: {name:'K. Vishwanathan Thampi', generation:2, place:'Arumanai'},
  ananda: {name:'Ananda Valliyamma', generation:2},
  sukumaran: {name:'K. Sukumaran Thampi', generation:2, place:'Poovangaparambu'},
  saraswathi: {name:'L. K. Saraswathi', generation:2},
  kamalamma: {name:'V. Kamalamma Thankachi', generation:2, place:'Thuckalay', aliases:['Parvathi Pilla Thankachi'], deceased:true},
  velayudhan: {name:'Velayudhan Thampi', generation:2, deceased:true},
  thankamma: {name:'V. Thankamma Thankachi', generation:2, place:'Eraniel'},
  kanakamma: {name:'Kanakamma Thankachi', generation:2, place:'Nagercoil'},
  rajamma: {name:'Rajamma Thankachi', generation:2, place:'Sasthamangalam'},
  sarada: {name:'V. Sarada Thankachi', generation:2, place:'Arappuraveedu, Thampanoor'},
  omana: {name:'Omana Thankachi', generation:2, place:'Kulasekaram'},
  sarojini: {name:'V. Sarojini Thankachi', generation:2, place:'Lekshmi Nilayam, Puthukkotta Lane, Bapuji Nagar'},
  krishnan: {name:'L. K. Krishnan Nair', generation:2, place:'Lekshmi Nilayam, Puthukottah Lane, Pongummoodu'},
};
export const branchIds = ['tanuvan','parameshwaran','vishwanathan','sukumaran','kamalamma','thankamma','kanakamma','rajamma','sarada','omana','sarojini'];
export const families = [
  {id:'founders', partners:['kumarapilla','valliyamma'], children:branchIds},
  {id:'tanuvan-family', partners:['tanuvan','lekshmi'], children:[]},
  {id:'parameshwaran-family', partners:['parameshwaran','pankajakshi'], children:[]},
  {id:'vishwanathan-family', partners:['vishwanathan','ananda'], children:[]},
  {id:'sukumaran-family', partners:['sukumaran','saraswathi'], children:[]},
  {id:'kamalamma-family', partners:['kamalamma','velayudhan'], children:[]},
  {id:'sarojini-family', partners:['sarojini','krishnan'], children:[]},
];
export function validateData(records=people, unions=families) {
  const ids=new Set();
  for (const f of unions) {
    if(ids.has(f.id)) throw Error(`Duplicate family ${f.id}`); ids.add(f.id);
    if(!f.partners.length) throw Error(`Family ${f.id} needs a parent`);
    for(const id of [...f.partners,...f.children]) if(!records[id]) throw Error(`Unknown person ${id}`);
    if(new Set(f.children).size!==f.children.length) throw Error(`Repeated child in ${f.id}`);
  }
  const edges=new Map();
  unions.forEach(f=>f.partners.forEach(id=>edges.set(id,[...(edges.get(id)||[]),...f.children])));
  const visited=new Set(), active=new Set();
  function visit(id) {if(active.has(id)) throw Error(`Ancestry cycle at ${id}`);if(visited.has(id))return;active.add(id);(edges.get(id)||[]).forEach(visit);active.delete(id);visited.add(id);}
  Object.keys(records).forEach(visit);
}
validateData();
export const unionsByPerson=new Map(), parentsByPerson=new Map();
families.forEach(f=>{ f.partners.forEach(id=>unionsByPerson.set(id,[...(unionsByPerson.get(id)||[]),f]));f.children.forEach(id=>parentsByPerson.set(id,[...(parentsByPerson.get(id)||[]),...f.partners])); });
export const unionsFor=id=>unionsByPerson.get(id)||[];
export const spousesFor=id=>[...new Set(unionsFor(id).flatMap(f=>f.partners.filter(p=>p!==id)))];
export const childrenFor=id=>[...new Set(unionsFor(id).flatMap(f=>f.children))];
export const parentsFor=id=>parentsByPerson.get(id)||[];
const searchText = new Map(Object.entries(people).map(([id,p])=>[id,[p.name,p.place,p.note,...(p.aliases||[])].filter(Boolean).join(' ').toLocaleLowerCase()]));
export function searchPeople(query){const terms=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);return Object.keys(people).filter(id=>terms.every(t=>searchText.get(id).includes(t)));}
export function searchBranches(query){const matches=new Set(searchPeople(query));return branchIds.filter(id=>matches.has(id)||spousesFor(id).some(s=>matches.has(s)));}
// Limit the visible generation; expanding a person focuses their immediate family.
export function neighborhood(id){return [...new Set([...parentsFor(id),id,...spousesFor(id),...childrenFor(id)])];}
