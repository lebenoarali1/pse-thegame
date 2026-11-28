import { ST } from './store';
import type { DlgStep, Point } from './types';
/* Textes du jeu : humour, dialogues, bavardages. Modifiable sans toucher aux règles */
export const BRK_SAY=['Une clope ? Allez, cinq minutes. Mon burn-out attendra.','Chut, le DG ne doit pas savoir que je prends ma pause légale.','Ça fait du bien, un plan social, ça vide les bureaux.','Tu crois que je suis sur la liste ? Moi aussi, je suis un coût.','Sur mon contrat, il est écrit \"vigilance\". Pas \"loyauté\".'];

export const BAR=['Nous allons disrupter votre verticale pour activer un levier de co-création.','Je ne vous vends rien : je vous offre une opportunité d\'engagement.','Votre silo est en réalité un écosystème qui s\'ignore.','Le churn, c\'est juste de l\'amour qui s\'en va.','Pensons out of the box, mais dans le budget de la box.','Je vais être transparent : je ne sais plus ce que je dis.','Votre ROI, c\'est le Retour sur Ma Parole.','On va faire un point rapide. Un point de quarante minutes.','Mon équipe a pivoté. Moi aussi. Je suis dizzy.','Ce n\'est pas un problème, c\'est une opportunité de problème.','Faites-moi confiance : j\'ai lu un livre sur le sujet.','L\'agilité, c\'est faire la même chose, mais en sprint.'];

export const BAR_R=['Hum. Oui. Je note.','Je ne comprends rien, mais c\'est passionnant.','Vous avez un support de présentation ?','Mmh. Mmh. Mmh.','Je dois en parler à mon manager. Qui ne m\'écoute pas.','Vous pouvez répéter, mais en français ?','D\'accord. Et concrètement ?','Je vais faire semblant de réfléchir.'];

export const CHAT: Record<string, string[]>={vigile:['Rien à signaler. Comme toujours.','On m\'a dit \"sécurité renforcée\". Pas \"effectifs\".','Mon badge fonctionne encore. Pour combien de temps ?'],manager:['On va réorganiser tout ça.','Pas de budget, mais beaucoup d\'attentes.','Je ne vous mets pas la pression, je vous l\'explique.','Ce n\'est pas un licenciement, c\'est une opportunité.'],beaugosse:['Je ne suis pas payé pour réfléchir.','Je fais de la sécurité. Et du sport.'],drh:['Je ne licencie pas, j\'accompagne.','Le bien-être au travail, c\'est ma priorité. Après le chiffre.'],assistante:['Tout est sous contrôle. Et sous mon bureau.','Le DG n\'est pas là. Il est en réunion, comme toujours.'],dg:['Les effectifs sont ma variable d\'ajustement.','Mon coffre est un coffre. Il n\'y a rien dedans.']};

export function introSteps(){return [
 {w:'nadege',t:"Tiens, le petit. Toi aussi, tu as reçu le mail ?"},
 {w:'kevin',t:"« Point d'étape sur l'évolution des effectifs », 18h, salle de réunion. C'est une bonne nouvelle ?"},
 {w:'nadege',t:"Ça veut dire que dans un quart d'heure, on n'a plus de badge, plus de bureau et plus de mutuelle. Même toi, et tu n'as même pas de contrat."},
 {w:'nadege',t:"Au fait, tu as quel âge, déjà ? Je n'ai jamais osé demander."},
 {w:'kevin',t:"Que répond Kévin ?",ch:[
   {t:"Ça ne se demande pas à un stagiaire.",fx:()=>{ST.S.age=0},r:[{w:'nadege',t:"Un mystère. J'adore. On le gardera pour le générique."}]},
   {t:"Sept ans.",fx:()=>{ST.S.age=7},r:[{w:'nadege',t:"Ça explique le montant de ta gratification. Je ne pose plus de question."}]},
   {t:"Soixante-dix-sept ans.",fx:()=>{ST.S.age=77},r:[{w:'nadege',t:"Un stagiaire senior ! Tu as connu la disquette, alors. Respect."}]}]},
 {w:'nadege',t:"Bref. Au 2e étage, il y a le coffre du DG. Vasseur y planque de quoi lui faire très mal, donc de quoi garder nos postes. Moi, je m'occupe de l'informatique. Toi, tu te faufiles, comme tout bon stagiaire."},
 {w:'kevin',t:"On n'est que deux ?"},
 {w:'nadege',t:"Djibril s'est enfermé dans une salle de réunion du 1er pour pleurer, discrètement, en faisant semblant de répéter un pitch. Et Max, notre homme de ménage, est sûrement aux toilettes du 1er, téléphone en main, et pas pour la raison habituelle."},
 {w:'nadege',t:"Les vigiles ne doivent pas nous voir. Toi surtout : le moindre regard, et l'alerte est donnée. Toi, tu jettes un gobelet : un vigile qui nettoie ne surveille rien. Moi, je lance une clope au second : un vigile qui fume ne surveille presque rien, avec la fumée. Ensuite, je pirate le portillon bleu. Tu cours."}]}

export const RECRUIT: Record<string, () => DlgStep[]>={
 marc:()=>[
  {w:'marc',t:"*renifle* Non, ne regardez pas ! Je répétais mon discours de départ. Il est si beau que j'en pleure. Enfin, c'est surtout le mascara."},
  {w:'$',t:"On est virés à 18h, Djibril."},
  {w:'marc',t:"Je sais. Moi, je dis « opportunité de rebond », mais mon corps dit « cinq mouchoirs en dix minutes »."},
  {w:'$',t:"Que lui dire ?",ch:[
   {t:"On a besoin de ton baratin pour piquer un truc au DG.",r:[{w:'marc',t:"Un coup de force ? J'adore, ça fait start-up. Je suis des vôtres."}]},
   {t:"Il y a un buffet gratuit au 2e étage.",r:[{w:'marc',t:"Un buffet ?! Il fallait commencer par là. J'ai le costume pour ça."}]},
   {t:"Tu peux te faire passer pour n'importe qui ?",r:[{w:'marc',t:"Manager, vigile, ce que tu veux, si on me prête la tenue. C'est ma spécialité."}]}]},
  {w:'marc',t:"Deux conseils : je ne cours jamais, ça froisse le costume. Et je ne baratine pas la DRH, elle a lu mon CV."}],
 jordan:()=>[
  {w:'jordan',t:"Hein ? Quoi ? Ah, c'est vous. Je finis mon niveau, deux secondes. Oui, je suis aux toilettes. C'est le seul endroit calme de l'immeuble."},
  {w:'$',t:"On est virés à 18h, Max."},
  {w:'jordan',t:"Ah ouais ? Cool. Je n'aurai plus à nettoyer les toilettes du 2."},
  {w:'$',t:"Que lui dire ?",ch:[
   {t:"Tu as les clés de l'immeuble, non ?",r:[{w:'jordan',t:"Celles des étages 0 et 1. Au-dessus, personne ne m'a rien confié. Par principe."}]},
   {t:"On va se venger du DG.",r:[{w:'jordan',t:"Se venger, c'est fatigant. Mais pour Vasseur, je veux bien faire un effort."}]},
   {t:"Il y a un canapé tout neuf au rez-de-chaussée.",r:[{w:'jordan',t:"Un canapé ? J'arrive. Enfin, j'arrive, c'est un grand mot."}]}]},
  {w:'jordan',t:"Personne ne regarde un mec qui passe la serpillère. Aux étages 0 et 1, je suis invisible. Sauf si je m'arrête devant une machine à café."}]
};

export const VCAP=[[2.4,5.2,"Dans un monde en guerre."],[5.2,8,"Quatre héros d'élite."],[8,10.4,"Un seul objectif : la victoire, brique par brique."]];

export const VCARD=[
 {id:'kevin',n:'KÉVIN',r:'Stagiaire',q:"Stagiaire depuis trois ans, payé en exposition. Âge classé secret défense.",p:['Gaine d\'aération','Lancer d\'objets'],f:"Repéré, il est viré sur-le-champ. Sans badge, il n'existe pas, mais on le voit.",c:'#ffa23a'},
 {id:'nadege',n:'NADIA',r:'Technicienne SI',q:"Connaît tous les mots de passe, le vôtre compris. Fume même quand elle est dedans.",p:['Piratage','Pause clope'],f:"Lente, et perd ses moyens devant un beau gosse en polo.",c:'#b57bff'},
 {id:'marc',n:'DJIBRIL',r:'Commercial',q:"Vend du vent depuis douze ans, avec slides. Se déguise en tout, sauf en honnête.",p:['Déguisement','Baratin'],f:"Ne court jamais : ça froisse le costume.",c:'#4c8dff'},
 {id:'jordan',n:'MAX',r:"Entretien",q:"Invisible aux étages 0 et 1 : personne ne regarde celui qui passe la serpillère.",p:['Assommer','Planquer au chariot'],f:"Un canapé ou une machine à café, et il s'arrête net.",c:'#4fd1c5'}];

export const CLEAN_SAY=['Encore un gobelet ! Ces stagiaires, je vous jure.','Qui jette ça par terre ? Une gratification, ça ne se mérite pas ?','Je suis vigile, pas femme de ménage. Mais bon.','Un gobelet. Voilà ce qui arrive sans plan de formation.'];
export const COF_SAY=['Le café de la cafétéria est le seul avantage du contrat.','Un expresso, ça fait oublier le plan social.','Tu as vu la liste ? Moi non. Je préfère ne pas savoir.','Ce café n\'a pas de nom, comme nos postes.','Un café. Un gobelet. Je commence à voir un schéma.'];
export const SMS_SAY=['Le serveur est en panne ? Moi, je n\'ai touché à rien.','Qui a écrit ce SMS ? Le numéro est interne.','On a tous reçu le même message. C\'est louche, ou c\'est la DSI.','Je redémarre tout. Ça marche une fois sur deux.'];
export const TALK: Record<string, string[]>={
 lucie:['Chut, je fais semblant de travailler. C\'est épuisant.','Les licenciements ? Je n\'ai rien entendu. Je ne suis pas payée pour entendre.','Prenez un café, ici c\'est la seule chose que la direction ne compte pas.'],
 hugo:['Je suis technicien. Je répare des choses que personne ne comprend, y compris moi.','Le serveur ? Ne le touchez pas, il est fragile. Comme moi le lundi.','Si vous cherchez la sortie, elle est à droite de ma démission.'],
 karim:['Mon PC met 12 minutes à démarrer. Je l\'allume en arrivant et je déjeune.','Vous avez un badge ? Moi, plus pour longtemps, apparemment.','Je ne dirai rien, mais je note tout. Pour mes prud\'hommes.']};
export const TALK_R: Record<string, string[]>={kevin:['Euh, bonjour. Je suis le stagiaire.','Vous avez déjà vu un stagiaire embauché ?','Je cherche mon tuteur. Il est parti en 2019.'],nadege:['Joli écran. Dommage pour le mot de passe.','Je ne suis pas de la DSI, je suis de la bonne DSI.','Votre WiFi est pourri, je dis ça pour vous.'],marc:['Écoutez, j\'ai une offre irrésistible.','Entre nous, vous méritez mieux que cette entreprise.','Je vous vends du rêve, à crédit.'],jordan:['Ouais. Je passe nettoyer. Enfin, je passe.','Pas de souci, je n\'ai rien vu.','Je suis là pour le ménage. Les corbeilles, c\'est mon pouvoir.']};
export const PC_SAY=['Mot de passe : Azerty123. Le DG est un visionnaire.','Quarante mails non lus, dont « Plan social : rien à signaler ».','Dossier « Stratégie 2026 » : un tableau Excel de trois cellules.','Historique : « comment se faire licencier avec la prime ». Pas le premier.','Fond d\'écran : le DG au ski. Casque de ski, sourire de requin.'];

/** Astuces affichées une seule fois, au premier usage (clé = id de pouvoir ou événement). */
export const HINTS: Record<string, string>={
  cone:"Le cône coloré est le champ de vision d'un garde. Restez hors du cône, ou derrière un mur : le jaune devient orange puis rouge quand il vous remarque.",
  jauge:"La jauge au-dessus d'un garde monte quand il vous voit. Reculez ou mettez un obstacle entre vous avant qu'elle soit pleine.",
  cacher:"Pas de cachette ici : le mur et les angles sont vos abris. Kévin passe par la gaine, Max cache les corps dans son chariot.",
  move:"Touchez le sol pour déplacer le perso choisi. Les boutons du bas lancent ses pouvoirs, ❓ rappelle les commandes.",
  ko:"Max : touchez un garde pour l'assommer, de près. Un corps vu par quelqu'un, c'est perdu : planquez-le.",
  hide:"Max : le corps assommé le plus proche va dans le chariot (2 au maximum) et ne se réveille plus.",
  puddle:"Max : touchez une case, il y va et pose une flaque. Le premier qui glisse dort 20 s.",
  uniform:"Djibril : près d'un corps assommé, il prend la tenue. Déguisé, il passe presque partout. Ne le faites pas courir.",
  talk:"Djibril : déguisé, touchez un PNJ en vue pour l'attirer et le retenir. Rappuyez sur le bouton pour le relâcher.",
  hack:"Nadia : touchez un PC ou une porte bleue. Elle doit être tout près et le piratage prend quelques secondes.",
  clope:"Nadia : touchez un vigile, il part fumer 1 minute. Le pouvoir recharge en 90 s.",
  vent:"Kévin : la gaine d'aération est à l'étage 2. Lui seul peut s'y glisser.",
  throw:"Kévin : touchez un point. Le gobelet fait du bruit, les gardes vont voir. Stock limité.",
};
