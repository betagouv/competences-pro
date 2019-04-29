import jsdom from 'jsdom-global';

import VueChargement from 'commun/vues/chargement';
import Situation, { CHARGEMENT, ATTENTE_DEMARRAGE, ERREUR_CHARGEMENT } from 'commun/modeles/situation';
import { traduction } from 'commun/infra/internationalisation';

describe('vue chargement', function () {
  let situation;
  let $;
  let vue;
  let chargeurRessources;

  beforeEach(() => {
    jsdom('<div id="pointInsertion"></div>');
    $ = jQuery(window);
    situation = new Situation();
    chargeurRessources = { chargement () { return Promise.resolve(); } };
    vue = new VueChargement(situation, chargeurRessources);
  });

  it('affiche les informations', () => {
    vue.affiche('#pointInsertion', $);
    expect($('#pointInsertion .overlay').length).to.eql(1);
    expect($('#pointInsertion .bouton-chargement').length).to.eql(1);
    expect($('#pointInsertion .message').text()).to.eql(traduction('situation.chargement'));
  });

  it('passe la situation en ATTENTE_DEMARRAGE une fois le chargement terminé', function () {
    expect(situation.etat()).to.equal(CHARGEMENT);
    return vue.affiche('#pointInsertion', $).then(() => {
      expect(situation.etat()).to.equal(ATTENTE_DEMARRAGE);
    });
  });

  it('passe la situation en ERREUR_CHARGEMENT si toutes les ressources ne sont pas chargées', function () {
    expect(situation.etat()).to.equal(CHARGEMENT);
    chargeurRessources.chargement = () => Promise.reject(new Error('test'));
    return vue.affiche('#pointInsertion', $).then(() => {
      expect(situation.etat()).to.equal(ERREUR_CHARGEMENT);
    });
  });
});
