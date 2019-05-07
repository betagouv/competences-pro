import jsdom from 'jsdom-global';
import VueBouton from 'commun/vues/bouton';

describe('vue Bouton', function () {
  let vue;
  let $;

  beforeEach(function () {
    jsdom('<div id="point-insertion"></div>');
    $ = jQuery(window);
    vue = new VueBouton('bouton-lire-consigne', 'imagePlayer', () => this.click());
  });

  it("sait s'insérer dans une page web", function () {
    vue.affiche('#point-insertion', $);
    expect($('.bouton-lire-consigne').length).to.eql(1);
  });

  it('sait aussi afficher un libellé', function () {
    vue.ajouteUneEtiquette('Un texte');
    vue.affiche('#point-insertion', $);

    expect($('.bouton-et-etiquette').length).to.eql(1);
    expect($('.bouton-et-etiquette .bouton-lire-consigne').length).to.eql(1);
    expect($('.bouton-et-etiquette span').text()).to.equal('Un texte');
  });

  it('sait afficher le libellé à gauche du bouton', function () {
    vue.ajouteUneEtiquette('Un texte', true);
    vue.affiche('#point-insertion', $);

    expect($('.bouton-et-etiquette.gauche').length).to.eql(1);
  });
});