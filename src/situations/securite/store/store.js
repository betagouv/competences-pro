import Vue from 'vue';
import Vuex from 'vuex';

import { CHANGEMENT_ETAT, CHARGEMENT, DEMARRE, FINI } from 'commun/modeles/situation';

Vue.use(Vuex);

export function creeStore () {
  return new Vuex.Store({
    state: {
      etat: CHARGEMENT,
      zones: []
    },
    mutations: {
      modifieEtat (state, etat) {
        state.etat = etat;
      },
      chargeZones (state, zones) {
        state.zones = zones;
      }
    }
  });
}

export function synchroniseStoreEtModeleSituation (situation, store) {
  situation.on(CHANGEMENT_ETAT, (etat) => {
    store.commit('modifieEtat', etat);
  });
  store.subscribe((mutation, state) => {
    if (mutation.type === 'modifieEtat') {
      situation.modifieEtat(mutation.payload);
    }
  });
  store.commit('modifieEtat', situation.etat());
}

export { CHARGEMENT, DEMARRE, FINI };