// Stable IDs and explicit family unions allow any number of generations and marriages.
export const people = {
  kumarapilla: {name:'Kalkulam T. Kumarapilla', generation:1},
  valliyamma: {name:'Valliyamma Pilla Thankachi', generation:1, aliases:['Viliyamma Pilla Thankachi']},
  tanuvan: {name:'Tanuvan Thampi', generation:2, place:'Poojapura, TVM', note:'Sub Registrar'},
  lekshmi: {name:'Lekshmi Kutty', generation:2},
  parameshwaran: {name:'K. Parameshwaran Thampi', generation:2, place:'Pullu'},
  pankajakshi: {name:'Pankajakshi Amma', generation:2},
  vishwanathan: {name:'K. Vishwanathan Thampi', generation:2, place:'Arumanai'},
  ananda: {name:'Ananda Valliyamma', generation:2, aliases:['Anandavalli Amma']},
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
  chandrika: {"name":"Chandrika","generation":3},
  padmanabhan: {"name":"K. Padmanabhan Nair","generation":3},
  sreekumari: {"name":"Sreekumari","generation":3},
  gopinathan: {"name":"Gopinathan Nair","generation":3},
  harikumaran: {"name":"Harikumaran Thampi","generation":3},
  jayaprabha: {"name":"Jayaprabha","generation":3},
  geethaKumari: {"name":"Geetha Kumari","generation":3},
  vijayakumar: {"name":"Vijayakumar","generation":3},
  gopakumaran: {"name":"Gopakumaran Thampi","generation":3},
  geetha: {"name":"Geetha","generation":3},
  satheesh: {"name":"V. Satheesh Kumar","generation":3},
  leena: {"name":"Leena","generation":3},
  ajith: {"name":"Ajith Kumar Padmanabhan Nair","generation":4},
  sreekumariAjith: {"name":"Dr. Sreekumari Ajith Kumar","generation":4},
  beenaSundar: {"name":"Beena Sundar","generation":4},
  sundar: {"name":"S. S. Sundar","generation":4},
  bindu: {"name":"Bindu Sunil","generation":4},
  sunil: {"name":"K. Sunil","generation":4},
  vinod: {"name":"Vinod","generation":4},
  beena: {"name":"Beena","generation":4},
  sindhu: {"name":"Sindhu","generation":4},
  sivakumar: {"name":"Sivakumar","generation":4},
  saju: {"name":"Saju","generation":4},
  remya: {"name":"Remya","generation":4},
  saritha: {"name":"Saritha","generation":4},
  raghesh: {"name":"Raghesh Vijayakumar","generation":4},
  nandini: {"name":"Nandini Ramachandran","generation":4},
  vijetha: {"name":"Vijetha G","generation":4},
  santhosh: {"name":"Santhosh Sreenivasan","generation":4},
  anupama: {"name":"Dr. Anupama","generation":4},
  prajith: {"name":"Capt. Prajith","generation":4},
  anand: {"name":"Anand","generation":4},
  megha: {"name":"Megha","generation":4},
  sreejith: {"name":"Sreejith","generation":4},
  subalekshmi: {"name":"Subalekshmi","generation":4},
  renjith: {"name":"Renjith","generation":4},
  priyanka: {"name":"Priyanka","generation":4},
  reshma: {"name":"Reshma Ajith Kumar","generation":5},
  akshay: {"name":"Akshay Ravi","generation":5},
  rahul: {"name":"Rahul Ajith Kumar","generation":5},
  gauthami: {"name":"Dr. Gauthami Sundar","generation":5},
  sundaram: {"name":"Dr. Sundaram Rajaram","generation":5},
  arun: {"name":"Arun Sundar","generation":5},
  sahana: {"name":"Sahana Arun","generation":5},
  vishnu: {"name":"Dr. Vishnu Sunil","generation":5},
  nayana: {"name":"Nayana","generation":5},
  nandu: {"name":"Nandu","generation":5},
  aravind: {"name":"Aravind","generation":5},
  neha: {"name":"Neha","generation":5},
  advik: {"name":"Advik Dev","generation":5},
  aadhithya: {"name":"Aadhithya","generation":5},
  advaith: {"name":"Advaith","generation":5},
  neelakantan: {"name":"Neelakantan","generation":5},
  meenakshi: {"name":"Meenakshi","generation":5},
  durga: {"name":"Durga Nair","generation":5},
  siddharth: {"name":"Siddharth Menon","generation":5},
  abhimanyu: {"name":"Abhimanyu","generation":5},
  aadikeshav: {"name":"Aadikeshav","generation":5},
  keshav: {"name":"Keshav","generation":5},
  madhav: {"name":"Madhav","generation":5},
  gouri: {"name":"Gouri","generation":5},
  thanvi: {"name":"Thanvi","generation":5},
  aditi: {"name":"Aditi","generation":6},
  akshara: {"name":"Akshara","generation":6},
  aarav: {"name":"Aarav","generation":6},
  avira: {"name":"Avira","generation":6},
  bhadra: {"name":"Bhadra Menon","generation":6},
};
export const branchIds = ['tanuvan','parameshwaran','vishwanathan','sukumaran','kamalamma','thankamma','kanakamma','rajamma','sarada','omana','sarojini'];
export const families = [
  {id:'founders', partners:['kumarapilla','valliyamma'], children:branchIds},
  {id:'tanuvan-family', partners:['tanuvan','lekshmi'], children:[]},
  {id:'parameshwaran-family', partners:['parameshwaran','pankajakshi'], children:[]},
  {id:'vishwanathan-family', partners:['vishwanathan','ananda'], children:['chandrika','sreekumari','harikumaran','geethaKumari','gopakumaran','satheesh']},
  {id:'sukumaran-family', partners:['sukumaran','saraswathi'], children:[]},
  {id:'kamalamma-family', partners:['kamalamma','velayudhan'], children:[]},
  {id:'sarojini-family', partners:['sarojini','krishnan'], children:[]},
  {"id":"chandrika-family","partners":["chandrika","padmanabhan"],"children":["ajith","beenaSundar","bindu"]},
  {"id":"sreekumari-family","partners":["sreekumari","gopinathan"],"children":["vinod","sindhu"]},
  {"id":"harikumaran-family","partners":["harikumaran","jayaprabha"],"children":["saju","saritha"]},
  {"id":"geetha-kumari-family","partners":["geethaKumari","vijayakumar"],"children":["raghesh","vijetha"]},
  {"id":"gopakumaran-family","partners":["gopakumaran","geetha"],"children":["anupama","anand"]},
  {"id":"satheesh-family","partners":["satheesh","leena"],"children":["sreejith","renjith"]},
  {"id":"ajith-family","partners":["ajith","sreekumariAjith"],"children":["reshma","rahul"]},
  {"id":"beena-sundar-family","partners":["beenaSundar","sundar"],"children":["gauthami","arun"]},
  {"id":"bindu-family","partners":["bindu","sunil"],"children":["vishnu"]},
  {"id":"vinod-family","partners":["vinod","beena"],"children":["nayana","nandu"]},
  {"id":"sindhu-family","partners":["sindhu","sivakumar"],"children":["aravind"]},
  {"id":"saju-family","partners":["saju","remya"],"children":["advik"]},
  {"id":"saritha-family","partners":["saritha"],"children":["aadhithya","advaith"]},
  {"id":"raghesh-family","partners":["raghesh","nandini"],"children":["neelakantan","meenakshi"]},
  {"id":"vijetha-family","partners":["vijetha","santhosh"],"children":["durga"]},
  {"id":"anupama-family","partners":["anupama","prajith"],"children":["abhimanyu","aadikeshav"]},
  {"id":"anand-family","partners":["anand","megha"],"children":[]},
  {"id":"sreejith-family","partners":["sreejith","subalekshmi"],"children":["keshav","madhav"]},
  {"id":"renjith-family","partners":["renjith","priyanka"],"children":["gouri","thanvi"]},
  {"id":"reshma-family","partners":["reshma","akshay"],"children":[]},
  {"id":"gauthami-family","partners":["gauthami","sundaram"],"children":["aditi","akshara","aarav"]},
  {"id":"arun-family","partners":["arun","sahana"],"children":["avira"]},
  {"id":"aravind-family","partners":["aravind","neha"],"children":[]},
  {"id":"durga-family","partners":["durga","siddharth"],"children":["bhadra"]},
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

export function ancestryPath(id) {
  const seen=new Set();
  function find(current){if(seen.has(current))return [];seen.add(current);const parents=parentsFor(current);if(!parents.length)return [current];return [...find(parents[0]),current];}
  return find(id);
}
export function bloodRelative(id){if(parentsFor(id).length||people[id]?.generation===1)return id;return spousesFor(id).find(s=>parentsFor(s).length)||id;}
export function branchFor(id){return ancestryPath(bloodRelative(id)).find(p=>branchIds.includes(p));}
const searchText = new Map(Object.entries(people).map(([id,p])=>[id,[p.name,p.place,p.note,...(p.aliases||[])].filter(Boolean).join(' ').toLocaleLowerCase()]));
export function searchPeople(query){const terms=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);return Object.keys(people).filter(id=>terms.every(t=>searchText.get(id).includes(t)));}
export function searchBranches(query){if(!query.trim())return branchIds;const found=new Set(searchPeople(query).map(branchFor));return branchIds.filter(id=>found.has(id));}
export function neighborhood(id){return [...new Set([...parentsFor(id),id,...spousesFor(id),...childrenFor(id)])];}
export function descendantIds(id){const seen=new Set();function visit(p){for(const child of childrenFor(p)){if(seen.has(child))continue;seen.add(child);visit(child);}}visit(id);return [...seen];}
