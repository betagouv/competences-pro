import 'controle/styles/app.scss';

import { ActionsCommunesSituation } from 'commun/vues/actions_communes_situation.js';
import { VueCadre } from 'commun/vues/cadre.js';
import { initialise as initialiseInternationalisation, traduit } from 'commun/infra/internationalisation';

import { Situation } from 'controle/modeles/situation.js';
import { VueSituation } from 'controle/vues/situation.js';

function afficheSituation (pointInsertion, $) {
  const situation = new Situation({
    scenario: [true, false, true],
    cadence: 3000,
    positionApparitionPieces: { x: 100, y: 70 },
    dureeViePiece: 12000
  });
  const vueSituation = new VueSituation(situation);
  const vueCadre = new VueCadre(vueSituation);
  vueCadre.affiche(pointInsertion, $);

  new ActionsCommunesSituation(pointInsertion, $, {
    enregistreStop () {}
  }).afficheElementEnCommun();
}

initialiseInternationalisation().then(function () {
  jQuery(function () {
    document.title = traduit('controle.titre');
    jQuery('body').append('<div id="situation-controle" class="conteneur"></div>');

    afficheSituation('#situation-controle', jQuery);
  });
});
