import jQuery from 'jquery';

import 'accueil/styles/app.scss';

import { accesSituations } from 'accueil/data/acces_situations';
import VueAccueil from 'accueil/vues/accueil';
import { initialise as initialiseInternationalisation, traduction } from 'commun/infra/internationalisation';
import RegistreUtilisateur from 'commun/infra/registre_utilisateur';
import DepotRessourcesAccueil from 'accueil/infra/depot_ressources_accueil';
import 'commun/infra/report_erreurs';

function afficheAccueil (pointInsertion, $) {
  const _accesSituations = accesSituations();
  const registreUtilisateur = new RegistreUtilisateur(_accesSituations.map((acces) => acces.identifiant));
  const depotRessources = new DepotRessourcesAccueil();
  const vueAccueil = new VueAccueil(_accesSituations, registreUtilisateur, depotRessources);
  depotRessources.chargement().then(() => {
    vueAccueil.affiche(pointInsertion, $);
  });
}

initialiseInternationalisation().then(function () {
  jQuery(function () {
    document.title = traduction('accueil.titre');
    jQuery('body').prepend('<div id="accueil" class="conteneur"></div>');
    afficheAccueil('#accueil', jQuery);
  });
});
