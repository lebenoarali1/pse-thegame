/* Personnages jouables : couleurs, pouvoirs (ACT), apparences, position de départ */
export const CCOL: Record<string, string>={jordan:'#4fd1c5',marc:'#4c8dff',nadege:'#b57bff',kevin:'#ffa23a'};

export interface Action { k: string; n: string; s: string; i: string; mode: string; [k: string]: any }
export const ACT: Record<string, Action[]>={
 jordan:[{k:'ko',n:'Assommer',s:'Toucher un garde',i:'🧹',mode:'enemy'},{k:'hide',n:'Planquer',s:'Corps dans le chariot (2 max, ne se réveillent plus)',i:'🛒',mode:'auto'},{k:'puddle',n:'Flaque',s:'Il y va, pose une flaque : qui glisse est assommé',i:'💦',mode:'tile'},{k:'empty',n:'Vider',s:'Dépose les corps du chariot',i:'🗑️',mode:'auto'}],
 marc:[{k:'uniform',n:'Déguisement',s:'Prend la tenue d\'un corps, ou la retire',i:'👔',mode:'auto'},{k:'talk',n:'Baratin',s:'Déguisé : attire un PNJ, aussi longtemps que voulu',i:'🗣️',mode:'enemy'}],
 nadege:[{k:'hack',n:'Pirater',s:'Près du PC, ou porte (8 s si rouge)',i:'💻',mode:'hack'},{k:'clope',n:'Clope',s:'Lance une clope à un vigile : fumoir 60 s',i:'🚬',mode:'enemy'}],
 kevin:[{k:'vent',n:'Gaine',s:'Va à la gaine',i:'🕳️',mode:'auto'},{k:'throw',n:'Lancer',s:'Toucher un point',i:'🥤',mode:'tile'}]
};

export const ROLE: Record<string, string>={employe:'Support',vigile:'Vigile',manager:'Manager',beaugosse:'Sécurité',drh:'DRH',assistante:'Assistante',dg:'DG',camera:'Caméra'};

export const WHO: Record<string, string[]>={kevin:['Kévin','#ffa23a'],nadege:['Nadia','#b57bff'],marc:['Djibril','#4c8dff'],jordan:['Max','#4fd1c5']};

export const APP: Record<string, any>={
 jordan:{skin:'#e8b894',hair:'#3a2a1f',body:'#6b7b8c',legs:'#2f3b4a'},marc:{skin:'#e9bf9f',hair:'#2b2b2b',body:'#2f5fa8',legs:'#1f3b6b'},
 nadege:{skin:'#efc7a8',hair:'#5a2d82',body:'#8b4fd1',legs:'#2a2340'},kevin:{skin:'#f0c9ad',hair:'#7a4a21',body:'#f08a2c',legs:'#394152'},
 vigile:{skin:'#e0b090',hair:'#222',body:'#2a4373',legs:'#1c2a46'},manager:{skin:'#e6bd9c',hair:'#555',body:'#808a99',legs:'#474f5c'},
 beaugosse:{skin:'#d9a077',hair:'#111',body:'#15181f',legs:'#2b2f3a'},drh:{skin:'#eec6aa',hair:'#8a8a99',body:'#5a2f6e',legs:'#2e1b38'},
 employe:{skin:'#e8c0a0',hair:'#3d2b1f',body:'#b8c4d6',legs:'#3a4252'},assistante:{skin:'#efc9ad',hair:'#a0522d',body:'#c9a27a',legs:'#6b4f3a'},dg:{skin:'#e4b595',hair:'#c9c9d1',body:'#14161d',legs:'#0e0f14'}
};

/* Placement initial. Ordre = ordre de découverte (cartes 1 à 4) */
export function makeChars(C: any){return [
C('kevin','Kévin',3.5,9.5,2.8,{small:true,joined:true,face:-2.36}),C('nadege','Nadia',2.5,8.5,1.8,{joined:true,smoke:true,face:.78}),C('marc','Djibril',20.5,12.5,2.4,{f:1,face:-1.57}),C('jordan','Max',2.5,11.5,2.2,{f:1,face:0})
]}

/* PNJ : patrouilles, champs de vision, pauses */
export function makeEnemies(E: any){return [
    E('roger','Roger','vigile',0,10.5,2.5,{fov:84,range:8,sp:1,route:[{x:8.5,y:2.5,wait:1.5},{x:13.5,y:2.5,wait:1.5}]}),
    E('dede','Dédé','vigile',0,18.5,9.5,{fov:80,range:8,sp:1.3,route:[{x:18.5,y:9.5,wait:3},{x:22.5,y:9.5,wait:3}]}),
    E('manon','Manon','manager',1,10.5,4.5,{sp:1.2,route:[{x:10.5,y:4.5,wait:1.5},{x:15.5,y:4.5,wait:1},{x:15.5,y:10.5,wait:1.5},{x:9.5,y:10.5,wait:1}]}),
    E('lucie','Lucie','employe',1,9.5,4.5,{calm:true,fov:70,range:4.5,face:-Math.PI/2,scan:{base:-Math.PI/2,amp:0,period:7}}),
    E('hugo','Hugo','employe',1,12.5,4.5,{calm:true,tech:true,fov:70,range:5,face:-Math.PI/2,scan:{base:-Math.PI/2,amp:0,period:7}}),
    E('karim','Karim','employe',1,12.5,6.5,{calm:true,fov:70,range:4.5,face:-Math.PI/2,scan:{base:-Math.PI/2,amp:0,period:7}}),
    E('dylan','Dylan','beaugosse',1,6.5,11.5,{fov:80,range:7,sp:1,route:[{x:6.5,y:11.5,wait:1.2},{x:9.5,y:11.5,wait:1.2}]}),
    E('drh','Mme Lambert','drh',2,4.5,7.5,{fov:72,range:8,sp:1.1,route:[{x:4.5,y:7.5,wait:3},{x:20.5,y:7.5,wait:3}]}),
    E('brigitte','Brigitte','assistante',2,18.5,12.5,{fov:90,range:7,face:-Math.PI/2,scan:{base:-Math.PI/2,amp:.35,period:8}}),
    E('dg','M. Vasseur','dg',2,20.5,2.5,{fov:100,range:7,sp:1.2,scan:{base:Math.PI/2,amp:.4,period:10}}),
    E('cam1','Caméra','camera',2,1.5,7.5,{fov:58,range:10,scan:{base:0,amp:.55,period:7}}),
    E('cam2','Caméra','camera',2,22.5,8.5,{fov:58,range:10,scan:{base:Math.PI,amp:.55,period:8}})
]}
