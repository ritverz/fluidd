import { RadiometerState} from './types'

export const defaultState = (): RadiometerState => {
  return {
    state: true,
    values: []
  }
}

export const state = defaultState()