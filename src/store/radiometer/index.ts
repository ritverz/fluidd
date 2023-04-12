import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { RadiometerState } from './types'
import { RootState } from '../types'

const namespaced = true

export const radiometer: Module<RadiometerState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}