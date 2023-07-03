import Vue from 'vue'
import { MutationTree } from 'vuex'
import { PrinterState} from './types'
import { SaveByPath } from '../config/types'
import { defaultState } from './state'
import consola from 'consola'
import { get, set } from 'lodash-es'
import { SetupPresets } from '../config/types'

export const mutations: MutationTree<PrinterState> = {
  /**
   * Custom mutations
   */

  setCurrentExperimentTab(state, payload){
    state.printer.radiometer.currTab =  payload
  },

  setTabCount(state, payload){
    state.printer.radiometer.tabCount =  payload
  },

  setIterCount(state, payload){
    state.printer.radiometer.iterCount =  payload
  },

  setCurrentExperimentIter(state, payload){
    state.printer.radiometer.currIter =  payload
},

  setCurrentRadiometerSig(state, payload){
    state.printer.radiometer.current = payload
  },

  setCurrentRadiometerTemp(state, payload){
    state.printer.radiometer.temp = payload
  },

  setKa(state, payload){
    state.printer.radiometer.ka = payload
  },

  setKb(state, payload){
    state.printer.radiometer.kb = payload
  },

  setAz(state, payload){
    state.printer.radiometer.Az = payload
  },

  setK1(state, payload){
    state.printer.radiometer.k1 = payload
  },

  setK2(state, payload){
    state.printer.radiometer.k2 = payload
  },

  setActivityBackground(state, payload){
    state.printer.radiometer.activityBackground = payload
  },


  setVelocity(state, payload){
    state.printer.radiometer.velocity = payload
  },

  startNewExperiment(state){
    
    state.printer.radiometer.inExperiment = true
  },

  endExperiment(state){
    state.printer.radiometer.inExperiment = false
  },

  setInExperiment(state, payload){
    state.printer.radiometer.inExperiment = payload
  },

  pauseExperiment(state){
    state.printer.radiometer.isPaused = true
  },

  resumeExperiment(state){
    state.printer.radiometer.isPaused = false
  },

  setInCalib(state, payload){
    state.printer.radiometer.inCalib = payload
  },

  setRef(state, payload){
    state.printer.radiometer.ref = payload
  },

  /**
   * Reset state
   */
  setReset (state) {
    Object.assign(state, defaultState())
  },

  setPrinterInfo (state, payload) {
    Vue.set(state.printer, 'info', payload)
  },

  setQueryEndstops (state, payload) {
    state.printer.endstops = payload
  },

  setPrinterBusy (state, payload: boolean) {
    state.printer.busy = payload
  },

  setPrinterObjectList (state, payload) {
    if (!state.printer.objects.includes(payload)) {
      state.printer.objects.push(payload)
    }
  },

  setClearEndStops (state) {
    state.printer.endstops = {}
  },

  setResetCurrentFile (state) {
    const newState = defaultState().printer.current_file
    consola.debug('resetting current file', newState)
    Vue.set(state.printer, 'current_file', newState)
  },

  setSocketNotify (state, payload) {
    if (typeof payload.payload === 'object') {
      const o = get(state.printer, payload.key)
      if (o === undefined) {
        // Object is not set yet, so create it.
        console.log('notify', payload)
        Vue.set(state.printer, payload.key, payload.payload)
      } else {
        Object.keys(payload.payload).forEach((p) => {
          // Leaving the if here, although it should
          // always evaluate true since we never
          // get an update unless something has changed.
          if (
            o[p] !== payload.payload[p]
          ) {
            Vue.set(state.printer[payload.key], p, payload.payload[p])
          }
        })
      }
    } else {
      // I don't think this'd get called.
      if (get(state.printer, payload.key) !== payload.payload) {
        Vue.set(state.printer, payload.key, payload.payload)
      }
    }
  }

}
