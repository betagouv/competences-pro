import jsdom from 'jsdom-global';
import jQuery from 'jquery';

import VueNumeratie, { EVENEMENT_REPONSE } from 'compte_rendu/vues/numeratie';
import MockDepotRessourcesCompteRendu from '../aides/mock_depot_ressources';

describe('La vue de la question Numératie', function () {
  let $;
  let depotRessources;

  beforeEach(function () {
    jsdom('<div id="point-insertion"></div>');
    $ = jQuery(window);
    depotRessources = new MockDepotRessourcesCompteRendu();
  });

  it('affiche des radios', function () {
    const $vue = new VueNumeratie(depotRessources);
    expect($('#point-insertion input[type=radio]').length).to.equal(0);

    $vue.affiche('#point-insertion', $);
    expect($('#point-insertion input[type=radio]').length).to.equal(5);
  });

  it('affiche la palette', function () {
    const $vue = new VueNumeratie(depotRessources);
    expect($('#point-insertion .illustration').length).to.equal(0);

    $vue.affiche('#point-insertion', $);
    expect($('#point-insertion .illustration').length).to.equal(1);
    expect($('#point-insertion .illustration').attr('src'))
      .to.equal('palette');
  });

  it("affiche un bouton d'envoi de réponse", function () {
    const $vue = new VueNumeratie(depotRessources);
    expect($('#point-insertion #envoi-reponse').length).to.equal(0);

    $vue.affiche('#point-insertion', $);
    expect($('#point-insertion #envoi-reponse').length).to.equal(1);
  });

  it('emet un événément réponse quand on appuie sur le bouton envoi', function (done) {
    const $vue = new VueNumeratie(depotRessources);

    $vue.affiche('#point-insertion', $);
    $('#point-insertion input[type=radio][value=32]').prop('checked', true);
    $vue.on(EVENEMENT_REPONSE, (reponse) => {
      expect(reponse).to.eql('32');
      done();
    });

    $('#point-insertion #envoi-reponse').click();
  });
});