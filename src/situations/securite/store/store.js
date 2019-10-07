import Vue from 'vue';
import Vuex from 'vuex';

import { CHANGEMENT_ETAT, CHARGEMENT, DEMARRE, FINI } from 'commun/modeles/situation';

Vue.use(Vuex);

export function creeStore () {
  return new Vuex.Store({
    state: {
      etat: CHARGEMENT,
      zones: [],
      dangers: {},
      dangersQualifies: {},
      aide: false
    },
    getters: {
      qualification (state) {
        return (nomDanger) => state.dangersQualifies[nomDanger];
      },
      nombreDangersQualifies (state) {
        return Object.keys(state.dangersQualifies).length;
      }
    },
    mutations: {
      modifieEtat (state, etat) {
        state.etat = etat;
      },
      chargeZonesEtDangers (state, { zones, dangers }) {
        state.zones = zones;
        state.dangers = dangers;
      },
      ajouteDangerQualifie (state, dangerQualifie) {
        Vue.set(state.dangersQualifies, dangerQualifie.nom, dangerQualifie.choix);
      },
      activeAide (state) {
        state.aide = true;
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
