import { ActionTree } from 'vuex'
import { PrinterState, RadiometerState } from './types'
import { RootState } from '../types'
import { handlePrintStateChange, handleCurrentFileChange, handleExcludeObjectChange } from '../helpers'
import { handleAddChartEntry, handleSystemStatsChange, handleMcuStatsChange } from '../chart_helpers'
import { SocketActions } from '@/api/socketActions'
import { Globals } from '@/globals'
import consola from 'consola'
import { DiagnosticsCardContainer } from '@/store/diagnostics/types'
import sandboxedEval from '@/plugins/sandboxedEval'

// let retryTimeout: number

export const actions: ActionTree<PrinterState, RootState> = {

 // Custom actions

  //Remove all results
  removeAllHistory({commit, dispatch, getters, rootGetters}, payload){
    commit('config/clearHistory', null, {root:true})
    SocketActions.serverWrite('uiSettings.history', rootGetters['config/getHistory'])
   },

   removeHistoryById({commit, dispatch, getters, rootGetters}, payload){
    commit('config/clearHistoryByID', payload, {root:true})
    SocketActions.serverWrite('uiSettings.history', rootGetters['config/getHistory'])

   },

   

  onRadiometerRespond({commit, dispatch, getters, rootGetters}, payload){
    // dispatch('initHeader')

    // //get macros process_vars
    // let macros = rootGetters['macros/getMacros']
    // let process = macros?.find((m: { name: string; variables: any } )=> m.name == 'process_vars' )

    // //Compute radiation sig using temp coeff, backroung activity
    // let actBack = getters['getActivityBackground']
    // let k1 =  getters['getK1']
    // let k2 =  getters['getK2']
    // let t_current = getters['getRadioTemp']
    // let Az = process.variables["az"]
    // let ka = process.variables["a"]
    // let kb = process.variables["b"]
    // let sig = payload

    // commit('setKa', ka)
    // commit('setKb', kb)
    // commit('setAz', Az)

    // if (getters['getInCalib']){
    //   let ref = getters['getRef']
    //   if (ref == 0) // Compute background
    //   {
    //     commit('setActivityBackground', sig.toFixed(3))
    //   }

    //   else if (ref == 1) //Compute first reference
    //   {
    //     let A1ref = rootGetters['config/getCurrentSetup'].refFirstActivity
    //     k1 = (Az *(ka * t_current + kb) + A1ref) / payload
    //     commit('setK1', k1)
    //   }

    //   else if (ref == 2) //Compute second reference
    //   {
    //     let A2ref = rootGetters['config/getCurrentSetup'].refSecondActivity
    //     k2 = (Az *(ka * t_current + kb) + A2ref) / payload
    //     commit('setK2', k2)
    //   }

    //   commit('setCurrentRadiometerSig', sig)
    //   commit('setRef', ref + 1)
    //   return
    // }
    // else{
    //    sig = payload * (k1 + k2) / 2 - actBack
    // }

    // commit('setCurrentRadiometerSig', sig)



    // //get current experiment status
    // let inExperiment = process.variables["in_experiment"]
    // commit('setInExperiment', inExperiment)

    // //get  current tablet
    // let tab = process.variables["tab_current"]
    // commit('setCurrentExperimentTab', tab)

    // //get  current iteration
    // let iter = process.variables["iter_current"]
    // commit('setCurrentExperimentIter', iter)

    // //get  current A
    // let A = sig 

    // //get  current Vsum
    // let disp_volume = process.variables["disp_volume"]
    // let disp_volume_last = process.variables["disp_volume_last"]
    // let V = (iter == getters['getIterCount']) ? disp_volume_last + disp_volume*(iter-1) : disp_volume * iter

    // //get  current a
    // let a = sig / V


    // //Append radiometer data to results object
    // let payload_experiment = {
    //   currTab: getters['getcurrTab'],
    //   currIter: getters['getcurrIter'],
    //   inExperiment: getters['getInExperiment'],
    //   sig: sig,
    //   A: A.toFixed(3),
    //   a: a.toFixed(3),
    //   V: V.toFixed(3),
    // }

    // commit('config/addRadiometerResult', payload_experiment, {root:true})
    
    // dispatch('config/saveByPath', {
    //    path: 'uiSettings.results',
    //    value: JSON.stringify(rootGetters['config/getExperimentResult']),
    //    server: true
    //    }, 
    //  )
  },

  cycleReadExperiment({commit, dispatch, rootGetters}){
    let macros = rootGetters['macros/getMacros']
    let process = macros?.find((m: { name: string; variables: any } )=> m.name == 'process_vars' )
    
    let in_experiment = process.variables["in_experiment"]
    let tab_count = process.variables["tab_count"]
    let iter_count = process.variables["iter_count"]
    let iter_current = process.variables["iter_current"]
    let tab_current = process.variables["tab_current"]
    let vol_activity = process.variables["sol_vol_activity"]
    let disp_volume = process.variables["disp_volume_initial"]
    let tab_activity_list = process.variables["tab_activity_list"]  // measured tab activities array
    let disp_volume_final_list = process.variables["disp_volume_final"]  // final aliquot volumes array
    let tab_dispense_ts_list = process.variables["tab_dispense_ts_list"]    // dispensing timestamps array
    let radiometer_avg_sig = process.variables["radiometer_avg_sig"]
    let radiometer_zero_sig = process.variables["radiometer_zero_sig"]
    let radiometer_floor_sig = process.variables["radiometer_floor_sig"]
    let radiometer_k = process.variables["radiometer_k"]
    let radiometer_k1 = process.variables["radiometer_k1"]
    let radiometer_k2= process.variables["radiometer_k2"]

//    //Debug
//    console.error(process.variables["in_experiment"])
    if (iter_count == 0) return

    commit('setInExperiment', in_experiment)
    commit('setTabCount', tab_count)
    commit('setIterCount', iter_count)
    commit('setCurrentExperimentIter', iter_current)
    commit('setCurrentExperimentTab', tab_current)

    commit('setActivityZero', radiometer_zero_sig)
    commit('setCurrentRadiometerSig', radiometer_avg_sig)
    commit('setActivityBackground', radiometer_floor_sig)
    commit('setK1', radiometer_k1)
    commit('setK2', radiometer_k2)
    commit('setK', radiometer_k)

    if (tab_activity_list[1] == 777) {
      tab_activity_list = tab_activity_list[0]
    }
    if (tab_dispense_ts_list[1] == 777) {
      tab_dispense_ts_list = tab_activity_list[0]
    }
    if (disp_volume_final_list[1] == 777) {
      disp_volume_final_list = tab_activity_list[0]
    }
//    window.console.error( 'список измеренных активностей', tab_activity_list)
//    window.console.error('tab=', tab_current,'/',tab_count)
//    window.console.error('iter=', iter_current, '/',iter_count)
    //Append radiometer data to results object
    commit('config/clearResults', null, {root:true})  
//    for (let iter = 0; iter < tab_dispense_ts_list.length; iter++) {  
    for (let iter = 0; iter < iter_current; iter++) {  
      let final_volume = 0

      for (let tab = 0; tab < tab_dispense_ts_list[iter].length; tab++) {  
        if (iter == iter_count - 1 && iter != 0) {final_volume = disp_volume_final_list[tab]-disp_volume}
        let V = disp_volume * (iter + 1) + final_volume
        let A:string
        let a:number
        if (tab_activity_list[iter].length > tab) {
          A = tab_activity_list[iter][tab].toFixed(3).toString()
          a = tab_activity_list[iter][tab] / V
        } else {
          a = vol_activity
          if (iter>0) {
            A = (a*disp_volume_final_list[tab] + tab_activity_list[iter-1][tab]).toFixed(3).toString()+"*"  
          } else {
            A = (a*V).toFixed(3).toString()+"*"
          }
        }

        let payload_experiment = {
          currTab: tab+1,
          currIter: iter+1,

          inExperiment: in_experiment,
          sig: radiometer_avg_sig,
          A: A,
          a: a.toFixed(3),
          V: V.toFixed(3),
          TS: tab_dispense_ts_list[iter][tab],
        }
        // Update table data
        commit('config/addRadiometerResult', payload_experiment, {root:true})
      }
    }

    dispatch('config/saveByPath', {
       path: 'uiSettings.results',
       value: JSON.stringify(rootGetters['config/getExperimentResult']),
       server: true
       }, 
    )
  },


  onExperimentStart({commit, dispatch, rootGetters}, payload){
    commit('config/clearResults', null, {root:true})

    dispatch('config/saveByPath', {
      path: 'uiSettings.results',
      value: '',
      server: true
      }, 
    )

    commit('startNewExperiment') 
    
  },

  onExperimentEnd({commit, dispatch, rootGetters}){
    commit('endExperiment')
    dispatch('config/addHistory', null , { root: true })
  },

//End of custom actions

  /**
   * Reset our store
   */
  async reset ({ commit }) {
    commit('setReset')
  },

  /**
   * Printer Info
   */
  async onPrinterInfo ({ commit }, payload) {
    commit('setPrinterInfo', payload)
  },

  /**
   * Query endstops
   */
  async onQueryEndstops ({ commit }, payload) {
    commit('setQueryEndstops', payload)
  },

  /**
   * Print cancelled confirmation.
   * Fires as a part of a socket action.
   */
  async onPrintCancel () {
    consola.debug('Print Cancelled')
  },

  /**
   * Print paused confirmation.
   * Fires as a part of a socket action.
   */
  async onPrintPause () {
    consola.debug('Print Paused')
  },

  /**
   * Print resumed confirmation.
   * Fires as a part of a socket action.
   */
  async onPrintResume () {
    consola.debug('Print Resumed')
  },

  /**
   * Print start confirmation.
   * Fires as a watch on a printer state change.
   */
  async onPrintStart (_, payload) {
    consola.debug('Print start detected', payload)
  },

  /**
   * Print end confirmation.
   * Fires as a watch on a printer state change.
   */
  async onPrintEnd (_, payload) {
    consola.debug('Print end detected', payload)
  },

  /**
   * ==========================================================================
   *  Non specific socket requests
   * ==========================================================================
   */

  /**
   * Stores the printers object list.
   */
  async onPrinterObjectsList ({ commit }, payload) {
    // Given our object list, subscribe to any data we'd want constant updates for
    // and prepopulate our store.
    let intendedSubscriptions = {}
    payload.objects.forEach((k: string) => {
      if (!k.includes('menu')) {
        intendedSubscriptions = { ...intendedSubscriptions, [k]: null }
      }
      let key = k
      if (k.includes(' ')) key = key.replace(' ', '.')
      commit('printer/setPrinterObjectList', key, { root: true })
    })

    SocketActions.printerObjectsSubscribe(intendedSubscriptions)
  },

  async onPrinterObjectsSubscribe ({ commit, dispatch }, payload) {
    // Accept notifications, and commit the first subscribe.
    commit('socket/setAcceptNotifications', true, { root: true })
    await dispatch('onNotifyStatusUpdate', payload.status)

    SocketActions.serverGcodeStore()
    SocketActions.printerGcodeHelp()
    SocketActions.serverTemperatureStore()
  },

  /**
   * ==========================================================================
   * Automated notifications via socket
   * Note that klipper will send an update every 250ms, if the data CHANGED.
   * This applies per object subscribed - which can add up.
   * ==========================================================================
   */

  /** Automated notify events via socket */
  async onNotifyStatusUpdate ({ rootState, commit, getters, dispatch }, payload) {
    // TODO: We potentially get many updates here.
    // Consider caching the updates and sending them every <interval>.
    // We don't want to miss an update - but also don't need all of them
    // so quickly.

    // Do NOT accept notification updates until our subscribe comes back.
    // This is because moonraker currently sends notification updates
    // prior to subscribing on browser refresh.
    if (payload && rootState.socket.acceptingNotifications) {
      // Detect a printing state change.
      // We do this prior to commiting the notify so we can
      // compare the before and after.
      handleCurrentFileChange(payload, rootState, commit)
      handlePrintStateChange(payload, rootState, dispatch)
      handleExcludeObjectChange(payload, rootState, dispatch)
      handleSystemStatsChange(payload, rootState, commit)
      handleMcuStatsChange(payload, rootState, commit)

      for (const key in payload) {
        const val = payload[key]
        // Commit the value.
        commit('printer/setSocketNotify', { key, payload: val }, { root: true })
      }

      // Add a temp chart entry
      const rootStateServerConfig = rootState.server.config
      const retention =
        rootStateServerConfig?.data_store?.temperature_store_size ??
        rootStateServerConfig?.server?.temperature_store_size ??
        Globals.CHART_HISTORY_RETENTION
      handleAddChartEntry(retention, rootState, commit, getters)
      dispatch('onDiagnosticsMetricsUpdate')
    }
  },

  async onFastNotifyStatusUpdate ({ rootState, commit, dispatch }, payload) {
    // Do NOT accept updates until our subscribe comes back.
    // This is because moonraker currently sends notification updates
    // prior to subscribing on browser refresh.
    if (payload && rootState.socket.acceptingNotifications) {
      commit('printer/setSocketNotify', payload, { root: true })
      dispatch('onDiagnosticsMetricsUpdate')
    }
  },

  async onDiagnosticsMetricsUpdate ({ rootState, commit, rootGetters }) {
    if (!rootState.config.uiSettings.general.enableDiagnostics) return
    const layout = rootState.layout.layouts.diagnostics as DiagnosticsCardContainer
    const metrics = Object.values(layout)
      .flat()
      .map(card => card.axes)
      .flat()
      .filter(axis => axis.enabled)
      .map(axis => axis.metrics)
      .flat()

    const collectors = Array.from(new Set(metrics.map(metric => metric.collector)))
    let data

    try {
      data = sandboxedEval(`
      const printer = ${JSON.stringify(rootState.printer.printer)}
      const collectors = ${JSON.stringify(collectors)}
      const result = { }

      for (const collector of collectors) {
        try {
          result[collector] = eval(collector)
        } catch (err) {
          result[collector] = err.message
        }
      }

      return JSON.stringify(result) // in order to only return serializable data
    `, 'metrics')

      if (typeof data !== 'string') throw new Error('Metrics collector returned invalid data')
      data = JSON.parse(data)
    } catch (err: any) {
      data = Object.fromEntries(collectors.map(collector => [collector, err?.message ?? 'Unknown Error']))
    }

    data.date = new Date()

    commit('charts/setChartEntry', {
      type: 'diagnostics',
      retention: rootGetters['charts/getChartRetention'],
      data
    }, { root: true })
  }
}
