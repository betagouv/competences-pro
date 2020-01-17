import DepotRessourcesCommunes from 'commun/infra/depot_ressources_communes';

import sonConsigne from 'inventaire/assets/consigne_demarrage.wav';

export default class DepotRessourcesMaintenance extends DepotRessourcesCommunes {
  constructor (chargeurs) {
    super(chargeurs, sonConsigne);
  }
}