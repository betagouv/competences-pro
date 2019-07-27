import 'accueil/styles/acces_situation.scss';

import { CHANGEMENT_CONNEXION } from 'commun/infra/registre_utilisateur';

export default class VueAccesSituation {
  constructor (accesSituation, depotRessources, utilisateur) {
    this.accesSituation = accesSituation;
    this.depotRessources = depotRessources;
    this.utilisateur = utilisateur;
  }

  affiche (pointInsertion, $) {
    this.utilisateur.on(CHANGEMENT_CONNEXION, () => this.metsAJourAcces());

    this.$accesSituation = $(`
        <a href="${this.accesSituation.chemin}" class='acces-situation ${this.accesSituation.identifiant}'>
          ${this.accesSituation.nom}
        </a>
      `);

    this.$accesSituation.on('dragstart', (e) => e.preventDefault());
    this.$accesSituation.css('background-image', `url('${this.depotRessources.batimentSituation(this.accesSituation.identifiant).src}')`);
    $(pointInsertion).append(this.$accesSituation);

    this.metsAJourAcces();
  }

  metsAJourAcces () {
    const niveau = this.utilisateur.niveauActuel();
    const estInaccessible = !this.accesSituation.estAccessible(niveau);

    this.$accesSituation.toggleClass('desactivee', estInaccessible);
  }
}
