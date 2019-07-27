import 'accueil/styles/accueil.scss';
import FormulaireIdentification from './formulaire_identification';
import VueAccesSituation from 'accueil/vues/acces_situation';
import VueProgression from 'accueil/vues/progression';
import VueBoiteUtilisateur from 'commun/vues/boite_utilisateur';

export default class VueAccueil {
  constructor (accesSituations, utilisateur, depotRessources) {
    this.accesSituations = accesSituations;
    this.utilisateur = utilisateur;
    this.depotRessources = depotRessources;
  }

  affiche (pointInsertion, $) {
    const $gabarit = $(`
      <div>
        <div class="titre">
          <h1>Compétences pro</h1>
        </div>
        <div style="background-image: url(${this.depotRessources.fondAccueil().src});"
             class="acces-situations">

          <div id="progression"></div>
          <div style="background-image: url(${this.depotRessources.personnages().src});"
               class="personnages"></div>

        </div>
      </div>
    `);
    const $accesSituations = $gabarit.find('.acces-situations');

    const progression = new VueProgression(this.depotRessources, this.utilisateur);
    progression.affiche($gabarit.find('#progression'), $);

    this.accesSituations.forEach((accesSituation) => {
      const vue = new VueAccesSituation(accesSituation, this.depotRessources, this.utilisateur);
      vue.affiche($accesSituations, $);
    });

    const formulaireIdentification = new FormulaireIdentification(this.utilisateur);
    formulaireIdentification.affiche($accesSituations, $);
    const boiteUtilisateur = new VueBoiteUtilisateur(this.utilisateur, this.accesSituations);
    boiteUtilisateur.affiche($gabarit.find('.titre'), $);

    $(pointInsertion).append($gabarit);
  }
}
