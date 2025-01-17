import { GetterTree } from 'vuex'
import vuetify from '@/plugins/vuetify'
import { ConfigState, SupportedTheme, TemperaturePreset, ThemeConfig, SetupPresets, Experiment } from './types'
import { RootState } from '../types'
import { Heater, Fan } from '../printer/types'
import tinycolor from '@ctrl/tinycolor'
import { AppTableHeader } from '@/types'
import { AppTablePartialHeader } from '@/types/tableheaders'
import { RootFile } from '../files/types'
import md5 from 'md5'
import { set } from 'vue/types/umd'

export const getters: GetterTree<ConfigState, RootState> = {

// Custom getters
getTest: (state)=> {
return state.test
},

getHistory: (state)=> {
  return state.uiSettings.history
},

getSetupMacrosCmd: (state) : string => {
    let setup = state.uiSettings.setup.currentSetup
    let tab_count = setup.sourceNumber
    let tab_activity = setup.radionuclideActivity
    let sol_volume = setup.initialVolume
    let sol_activity = setup.initialActivity
    let sol_vol_activity =  sol_activity == 0 ? '' : sol_activity / sol_volume

    return `start_process TAB_ACTIVITY=${tab_activity} TAB_COUNT=${tab_count} SOL_VOLUME=${sol_volume} SOL_VOL_ACTIVITY=${sol_vol_activity}`
},

// End of custom getters
  getCurrentInstance: (state) => {
    return state.instances.find(instance => instance.active)
  },

  getInstances: (state) => {
    const instances = [
      ...state.instances
    ].sort((a, b) =>
      a.active
        ? -1
        : (b.active ? 1 : a.name.localeCompare(b.name))
    )
    return instances
  },

  getHostConfig: (state) => {
    return state.hostConfig
  },

  getSetupPresets: (state) => {
    return state.uiSettings.setup.setupPresets
  },

  getCurrentSetup: (state) => {
    return state.uiSettings.setup.currentSetup
  },

  getSetupPresetByName: (state) => (name: string) => {
    const presets: SetupPresets[] = state.uiSettings.setup.setupPresets
    const index: number = presets.findIndex(preset => preset.name === name)
    return presets[index]
  },

  getSetupPresetsNames: (state) => {
    const presets: SetupPresets[] = state.uiSettings.setup.setupPresets
    return presets.map(preset => preset.name)
  },

  getMode: (state) => {
    return state.uiSettings.setup.mode
  },

  getExperimentResult: (state): Experiment => {
    /** Results type is
    {1: //tablet num
      [
        {tablet: 1},
        {V1:0, a1 :0...}, //iteration 1
        {V2:0 ...}  //iteration 2
      ],
     2:[
        {},
        {}
      ]
    }
    */
    return state.uiSettings.results 
  },
  

  /**
   * Return temp presets. Ensure we only return a preset
   * for a known heater or fan, incase things change
   * after a preset has been saved.
   */
  getTempPresets: (state, getters, rootState, rootGetters) => {
    const originalPresets: TemperaturePreset[] = state.uiSettings.dashboard.tempPresets
    const presets: TemperaturePreset[] = []
    const heaters = rootGetters['printer/getHeaters']
    const fans = rootGetters['printer/getOutputs'](['temperature_fan'])

    originalPresets.forEach((originalPreset: TemperaturePreset) => {
      const preset: TemperaturePreset = {
        ...originalPreset,
        values: {}
      }
      // Loop through the preset and ensure that;
      // a) a given heater and fan exists and;
      // b) unknown heaters and fans are removed.
      // For items added to an existing preset, default them to disabled.
      heaters.forEach((heater: Heater) => {
        if (originalPreset.values[heater.name]) {
          preset.values[heater.name] = { ...originalPreset.values[heater.name] }
        } else {
          preset.values[heater.name] = { value: 0, type: 'heater', active: false }
        }
      })
      fans.forEach((fan: Fan) => {
        if (originalPreset.values[fan.name]) {
          preset.values[fan.name] = { ...originalPreset.values[fan.name] }
        } else {
          preset.values[fan.name] = { value: 0, type: 'fan', active: false }
        }
      })

      presets.push(preset)
    })

    return presets.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  },

  /**
   * Returns our current theme data.
   * Should augment vuetifies default.
   */
  getTheme: (state) => {
    const v = vuetify.framework.theme
    const o = state.uiSettings.theme

    const r: ThemeConfig = {
      ...state.uiSettings.theme,
      currentTheme: {
        ...v.currentTheme,
        ...o.currentTheme
      }
    }

    for (const key in r.currentTheme) {
      // Currently used for the offset in the logo.
      r.currentTheme[key + 'Offset'] = tinycolor(o.currentTheme.primary as string)
        .desaturate(5)
        .darken(10)
        .toHexString()
    }
    return r
  },

  getCustomThemeFile: (state, getters, rootState, rootGetters) => (filename: string, extensions: string[]) => {
    const files = rootGetters['files/getRootFiles']('config') as RootFile[]

    if (files) {
      for (const extension of extensions) {
        const path = `.fluidd-theme/${filename}${extension}`

        if (files.some(f => f.path === path)) {
          return path
        }
      }
    }
  },

  /**
   * Returns a default theme preset for first init / when reset
   */
  getDefaultThemePreset: (state) => {
    if (state.hostConfig.themePresets.length > 0) {
      return state.hostConfig.themePresets[0] // First entry represents default
    }
    return {
      name: 'Fluidd',
      logo: {
        src: '/logo_fluidd.svg',
        changeWithTheme: true
      },
      color: '#2196F3'
    }
  },

  getCurrentThemePreset: (state, getters) => {
    const presets = state.hostConfig.themePresets
    const theme = getters.getTheme
    return presets.find((preset: SupportedTheme) => preset.logo.src === theme.logo.src)
  },

  getMergedTableHeaders: (state, getters) => (headers: AppTableHeader[], key: string) => {
    const configured: AppTablePartialHeader[] = getters.getConfiguredTableHeaders(key)
    if (!configured) {
      return headers
    }
    const merged: AppTableHeader[] = []
    headers.forEach(header => {
      const keyBy = (header.key)
        ? 'key'
        : 'value'

      const o = {
        visible: true,
        configurable: false,
        ...header,
        ...configured.find(p => p[keyBy] === header[keyBy])
      }

      merged.push(o)
    })
    return merged
  },

  getConfiguredTableHeaders: (state) => (key: string) => {
    return state.uiSettings.tableHeaders[key]
  },

  getTokenKeys: (state) => {
    const url = state.apiUrl
    const hash = (url) ? md5(url) : ''
    return {
      'user-token': `user-token-${hash}`,
      'refresh-token': `refresh-token-${hash}`
    }
  }
}
