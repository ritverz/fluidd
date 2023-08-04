<template>
  <v-data-table :headers="headers()" :items="values" :items-per-page="itemsPerPage" class="elevation-1"></v-data-table>
</template>

<script lang="ts">

import { Component, Mixins, Prop, PropSync } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'

@Component({
  components: {
  }
})
export default class ResultTable extends Mixins(StateMixin) {
  @Prop({ type: Boolean, required: true })
  readonly full!: boolean

  @Prop({ type: Number, required: true, default: 33})
  readonly itemsPerPage!: number

  get iterations(){
    return  this.$store.getters['printer/getIterCount']
  }
  
  get values(){
    let values = this.$store.getters['config/getExperimentResult']
    let tableValues = []
    for (let tab in values){
      tableValues.push(Object.assign({},...values[tab]))
    }
    
    return tableValues
  }

  headers() {
    let headersArr = []

    let firstCol = {
        text: '№ табл.',
        align: 'start',
        sortable: false,
        value: 'tablet',
    }
    headersArr.push(firstCol)

    let mesuared = []
    for (let i = 0; i < this.iterations; i++){
      mesuared.push(
        {
          text: `V${i+1}`,
          value: `V${i+1}`
        }
      )
      mesuared.push(
        {
          text: `A${i+1}`,
          value: `A${i+1}`
        }
      )
      mesuared.push(
        {
          text: `a${i+1}`,
          value: `a${i+1}`
        }
      )
      mesuared.push(
        {
          text: `Дата/Время`,
          value: `date${i+1}`,
          divider: true
        }
      )
      

    }

    headersArr.push(...mesuared)
    return headersArr
  }
}
</script>

<style>
v-data-table {
  overflow-x: auto;
}
</style>