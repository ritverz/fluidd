import Vue from 'vue'
import { MutationTree } from 'vuex'
import { RadiometerState, RadiometerEntry } from './types'


const testData: RadiometerEntry = {
    V: 1,
    A: 1,
    a: 1,
    date: 'no',
    iteration: 1
};

export const mutations: MutationTree<RadiometerState> = {

    setTestData (state) {
        state.values.push(testData);
    }
}