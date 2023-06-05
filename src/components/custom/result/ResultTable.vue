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
    // if (!this.full){
    //   mesuared.reverse()
    // }
    headersArr.push(...mesuared)
    return headersArr
  }


  //     return [
  //     {
  //       text: '№ табл.',
  //       align: 'start',
  //       sortable: false,
  //       value: 'name',
  //     },
  //     { text: 'Calories', value: 'calories' },
  //     { text: 'Fat (g)', value: 'fat' },
  //     { text: 'Carbs (g)', value: 'carbs' },
  //     { text: 'Protein (g)', value: 'protein' },
  //     { text: 'Iron (%)', value: 'iron' },
  //     { text: 'Iron (%)', value: 'iron2' },
  //     { text: 'Iron (%)', value: 'iron3' },
  //     { text: 'Iron (%)', value: 'iron4' },
  //     { text: 'Iron (%)', value: 'iron5' },
  //     { text: 'Iron (%)', value: 'iron6' },
  //     { text: 'Iron (%)', value: 'iron7' },
  //     { text: 'Iron (%)', value: 'iron8' },
  //     { text: 'Iron (%)', value: 'iron9' },
  //     { text: 'Iron (%)', value: 'iron10' },
  //   ]
  // }
  // desserts = [
  //   {
  //     name: 'Frozen Yogurt',
  //     calories: 159,
  //     fat: 6.0,
  //     carbs: 24,
  //     protein: 4.0,
  //     iron: 1,
  //   },
  //   {
  //     name: 'Ice cream sandwich',
  //     calories: 237,
  //     fat: 9.0,
  //     carbs: 37,
  //     protein: 4.3,
  //     iron: 1,
  //   },
  // ]
}
</script>

<style>
v-data-table {
  overflow-x: auto;
}
</style>