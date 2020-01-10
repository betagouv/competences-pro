import { creeStore } from 'prevention/modeles/store';

describe('Le store de la situation sécurité', function () {
  it("permet la configuration d'un acte", function () {
    const store = creeStore();
    const zones = [{ x: 1, y: 2, r: 3 }];
    store.commit('configureActe', { zones, fondSituation: 'fond' });
    expect(store.state.zones).to.eql(zones);
    expect(store.state.fondSituation).to.eql('fond');
  });
});