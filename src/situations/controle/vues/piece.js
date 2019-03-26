import 'controle/styles/piece.scss';

export const DUREE_VIE_PIECE_INFINIE = undefined;

export function animationInitiale ($element) {
  $element.animate({ left: '-10%' }, 10000, 'linear');
}

export function animationFinale ($element, done) {
  $element.fadeOut(500, () => { done($element); });
}

export class VuePiece {
  constructor (piece,
    dureeVie = DUREE_VIE_PIECE_INFINIE,
    callbackApresApparition = animationInitiale,
    callbackAvantSuppression = animationFinale) {
    this.piece = piece;
    this.dureeVie = dureeVie;
    this.callbackApresApparition = callbackApresApparition;
    this.callbackAvantSuppression = callbackAvantSuppression;
    this.abonnes = [];
  }

  abonne (unAbonne) {
    this.abonnes.push(unAbonne);
  }

  notifieSuppression () {
    this.abonnes.forEach((a) => {
      a.unePieceADisparu(this.piece.position(), this.piece.dimensions());
    });
  }

  affiche (pointInsertion, $) {
    function creeElementPiece (pieceConforme, position, dimensions, dimensionsElementParent) {
      let classeConformite = pieceConforme ? 'conforme' : 'defectueuse';
      let $piece = $(`<div class="piece ${classeConformite}"></div>`);
      metsAJourDimensions($piece, dimensions, dimensionsElementParent);
      metsAJourPosition($piece, position, dimensionsElementParent);
      return $piece;
    }

    function metsAJourDimensions ($piece, { largeur, hauteur }, { largeurParent, hauteurParent }) {
      $piece.width(largeur * largeurParent / 100).height(hauteur * hauteurParent / 100);
    }

    function metsAJourPosition ($piece, { x, y }, { largeurParent, hauteurParent }) {
      $piece.css('left', x * largeurParent / 100);
      $piece.css('top', y * hauteurParent / 100);
    }

    const $elementParent = $(pointInsertion);
    const dimensionsElementParent = {
      largeurParent: $elementParent.width(),
      hauteurParent: $elementParent.height()
    };
    const $piece = creeElementPiece(
      this.piece.estConforme(), this.piece.position(), this.piece.dimensions(), dimensionsElementParent);

    $piece.mousedown(e => {
      $piece.stop(true);
      $piece.css('opacity', 1);
      this.piece.changePosition({
        x: 100 * parseInt($piece.css('left')) / $elementParent.width(),
        y: 100 * parseInt($piece.css('top')) / $elementParent.height()
      });
      this.piece.selectionne({
        x: 100 * e.clientX / $elementParent.width(),
        y: 100 * e.clientY / $elementParent.height()
      });
    });

    $piece.mouseup(e => { this.piece.deselectionne(); });

    $elementParent.mousemove(e => {
      this.piece.deplaceSiSelectionnee({
        x: 100 * e.clientX / $elementParent.width(),
        y: 100 * e.clientY / $elementParent.height()
      });
    });

    this.piece.quandChangementPosition(function (nouvellePosition) {
      metsAJourPosition($piece, nouvellePosition, dimensionsElementParent);
    });
    $elementParent.append($piece);
    $piece.show(() => { this.callbackApresApparition($piece); });

    if (this.dureeVie !== DUREE_VIE_PIECE_INFINIE) {
      setTimeout(() => {
        this.callbackAvantSuppression($piece, () => { $piece.remove(); });
        this.notifieSuppression();
      }, this.dureeVie);
    }
  }
}
