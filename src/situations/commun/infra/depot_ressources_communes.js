import DepotRessources from 'commun/infra/depot_ressources';

export default class DepotRessourcesCommunes extends DepotRessources {
  constructor (sonConsigne, chargeurs) {
    super(chargeurs);
    this.chargeContexte(require.context('commun/assets'));
    this.charge([sonConsigne]);
    this.sonConsigne = sonConsigne;
  }

  chargeContexte (contexte) {
    const ressources = contexte.keys().map(contexte);
    this.charge(ressources);
  }

  consigne () {
    return this.ressource(this.sonConsigne);
  }
}
