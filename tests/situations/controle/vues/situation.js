import $ from 'jquery';

import MockDepotRessourcesControle from '../aides/mock_depot_ressources_controle';
import EvenementPieceBienPlacee from 'commun/modeles/evenement_piece_bien_placee';
import EvenementPieceMalPlacee from 'commun/modeles/evenement_piece_mal_placee';
import EvenementPiecePrise from 'commun/modeles/evenement_piece_prise';
import EvenementPieceRatee from 'controle/modeles/evenement_piece_ratee';
import Piece, { PIECE_BIEN_PLACEE, PIECE_MAL_PLACEE } from 'commun/modeles/piece';
import Situation, { PIECE_RATEE, NOUVELLE_PIECE } from 'controle/modeles/situation';
import VueSituation from 'controle/vues/situation';

function vueSituationMinimaliste (journal) {
  const situation = new Situation({ scenario: [], bacs: [{}, {}] });
  return new VueSituation(situation, journal, new MockDepotRessourcesControle());
}

describe('La vue de la situation « Contrôle »', function () {
  beforeEach(function () {
    $('body').append('<div id="point-insertion"></div>');
  });

  it('affiche le fond', function () {
    const vueSituation = vueSituationMinimaliste();
    vueSituation.depotRessources.fondSituation = () => { return { src: 'image-de-fond' }; };
    vueSituation.affiche('#point-insertion', $);
    expect($('#point-insertion').css('background-image')).to.equal('url(image-de-fond)');
  });

  it('affiche les bacs et le tapis', function () {
    const vueSituation = vueSituationMinimaliste();
    expect($('#point-insertion .bac').length).to.equal(0);

    vueSituation.affiche('#point-insertion', $);

    expect($('#point-insertion').hasClass('controle')).to.be(true);
    expect($('#point-insertion .bac').length).to.equal(2);
    expect($('#point-insertion .tapis').length).to.equal(1);
  });

  it('demarre la situation', function (done) {
    const journal = { enregistre (e) {} };
    const vueSituation = vueSituationMinimaliste(journal);
    vueSituation.demarre = done();

    vueSituation.affiche('#point-insertion', $);
    vueSituation.demarre('#point-insertion', $);
  });

  describe('avec une situation démarrée, une pièce et un journal', function () {
    let journal;
    let piece;
    let vueSituation;

    beforeEach(function () {
      journal = {};
      piece = new Piece({ categorie: true });
      vueSituation = vueSituationMinimaliste(journal);

      vueSituation.affiche('#point-insertion', $);
      vueSituation.demarre('#point-insertion', $);
    });

    it('écoute les événements de sélection de pièces', function (done) {
      journal.enregistre = function (e) {
        expect(e).to.be.a(EvenementPiecePrise);
        expect(e.donnees()).to.eql({ piece: { conforme: true } });
        done();
      };
      vueSituation.situation.emit(NOUVELLE_PIECE, piece);
      piece.selectionne({ x: 0, y: 0 });
    });

    it('écoute seulement les événements de sélection de pièces', function () {
      let nombreAppelsEnregistre = 0;
      journal.enregistre = function (e) {
        nombreAppelsEnregistre++;
      };
      vueSituation.situation.emit(NOUVELLE_PIECE, piece);
      piece.selectionne({ x: 0, y: 0 });
      piece.deselectionne();
      expect(nombreAppelsEnregistre).to.eql(1);
    });

    it('écoute les événements PIECE_BIEN_PLACEE pour les enregistrer dans le journal', function (done) {
      journal.enregistre = function (e) {
        expect(e).to.be.a(EvenementPieceBienPlacee);
        expect(e.donnees()).to.eql({ piece: { conforme: true } });
        done();
      };
      vueSituation.situation.emit(PIECE_BIEN_PLACEE, piece);
    });

    it('écoute les événements PIECE_MAL_PLACEE pour les enregistrer dans le journal', function (done) {
      journal.enregistre = function (e) {
        expect(e).to.be.a(EvenementPieceMalPlacee);
        expect(e.donnees()).to.eql({ piece: { conforme: true } });
        done();
      };
      vueSituation.situation.emit(PIECE_MAL_PLACEE, piece);
    });

    it('écoute les événements PIECE_RATEE pour les enregistrer dans le journal', function (done) {
      journal.enregistre = function (e) {
        expect(e).to.be.a(EvenementPieceRatee);
        expect(e.donnees()).to.eql({ piece: { conforme: true } });
        done();
      };
      vueSituation.situation.emit(PIECE_RATEE, piece);
    });
  });
});
