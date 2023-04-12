import { GetterTree } from 'vuex'
import { RadiometerState, RadiometerEntry } from './types'
import { RootState } from '../types'


export const getters: GetterTree<RadiometerState, RootState> = {
    getRadiometerValues: (state): RadiometerEntry[] => {
        return state.values
    },

    getAccuracy: (state): number => {
        return 0
    }

}

