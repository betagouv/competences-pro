import chargeurs from '../aides/mock_chargeurs';
import DepotRessources from 'commun/infra/depot_ressources';
import DepotRessourcesCommunes from 'commun/infra/depot_ressources_communes';

import sonConsigneCommune from 'commun/assets/consigne_commune.wav';

describe('Le dépot de ressources communes', function () {
  let depot;
  let sonConsigneDemarrage;
  let sonConsigneTransition;
  let sonsCharges;

  beforeEach(function () {
    sonConsigneDemarrage = 'consigneDemarrage.wav';
    sonConsigneTransition = 'consigneTransition.wav';
    sonsCharges = [];
    const _chargeurs = chargeurs({
      wav: (_son) => {
        sonsCharges.push(_son);
        return Promise.resolve(() => 'wav_precharge');
      }
    });
    depot = new DepotRessourcesCommunes(_chargeurs, sonConsigneDemarrage, sonConsigneTransition);
  });

  it('étend DépotRessources', function () {
    expect(depot).toBeInstanceOf(DepotRessources);
  });

  it('charge la consigne commune', function () {
    expect(sonsCharges).toContain(sonConsigneCommune);
  });

  it('charge la consigne de demarrage', function () {
    expect(sonsCharges).toContain(sonConsigneDemarrage);
  });

  it('charge la consigne de transition', function () {
    expect(sonsCharges).toContain(sonConsigneTransition);
  });

  it('retourne la consigne', function () {
    return depot.chargement().then(() => {
      expect(depot.consigneDemarrage()).toEqual('wav_precharge');
    });
  });

  it('retourne la consigne commune', function () {
    return depot.chargement().then(() => {
      expect(depot.consigneCommune()).toEqual('wav_precharge');
    });
  });
});
