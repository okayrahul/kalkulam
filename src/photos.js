// Shared photographs retain their complete composition, rather than becoming cropped portraits.
export const photoGroups = [
 {id:'vishwanathan-anandavalli',src:'./assets/photos/vishwanathan-anandavalli.webp',width:760,height:958,rows:[{label:'Left to right',people:['vishwanathan','ananda']}]},
 {id:'sarojini-krishnan',src:'./assets/photos/sarojini-krishnan.webp',width:1600,height:1200,rows:[{label:'Left to right',people:['krishnan','sarojini']}]},
 {id:'arun-sahana-avira',src:'./assets/photos/arun-sahana-avira.webp',width:3840,height:5120,rows:[{label:'Left to right',people:['arun','avira','sahana']}]},
 {id:'gauthami-sundaram-family',src:'./assets/photos/gauthami-sundaram-family.webp',width:1600,height:1447,rows:[{label:'Left to right',people:['gauthami','akshara','aditi','sundaram']},{label:'Below Dr. Sundaram Rajaram',people:['aarav']}]},
];
const groupsByPerson=new Map();
for(const group of photoGroups)for(const id of group.rows.flatMap(row=>row.people))groupsByPerson.set(id,[...(groupsByPerson.get(id)||[]),group]);
export const groupPhotosForPerson=id=>groupsByPerson.get(id)||[];
