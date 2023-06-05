<template>
<div>
    <v-toolbar>
        <v-btn>
          <a v-on:click="download()" :href="myUrl" :download="myFilename">Скачать CSV</a>
        </v-btn>
        
        
        <v-btn>
            Просмотр отчета
        </v-btn>

        <v-spacer />

        <app-column-picker
          v-if="headers"
          key-name="history"
          :headers="headers"
        />
    </v-toolbar>

    <!-- <p> {{ realHistory }}</p> -->
    <v-data-table
        v-model="selected"
        :headers="visibleHeaders"
        :items="history"
        :single-select="true"
        item-key="name"
        show-select
        class="elevation-1"
        :single-expand="false"
        :expanded.sync="expanded"
        show-expand
      >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            More info about {{ item.name }}
          </td>
        </template>
    </v-data-table>
</div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'

    @Component({
    
    components: {
    }
    })
    export default class HistoryTable extends Vue {
        expanded = []

        myUrl = '#'
        myFilename = ''
        json_data  = [
            {'name': 'Test'}]
        headers = [
        {
            text: 'Dessert (100g serving)',
            value: 'name',
          },
          { text: 'Calories', value: 'calories', configurable: true, visible: true },
          { text: 'Fat (g)', value: 'fat', configurable: true, visible: true },
          { text: 'Carbs (g)', value: 'carbs', configurable: true, visible: true},
          { text: 'Protein (g)', value: 'protein', configurable: true, visible: true },
          { text: 'Iron (%)', value: 'iron', configurable: true, visible: true },
        ]
        search = ''
        selected = ''
        history = [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: 1,
            
          },
          {
            name: 'Frozen Yogurt2',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: 1,
          },
        ]

        get visibleHeaders ()
        {
          return this.headers.filter(header => header.visible || header.visible === undefined)
        }
        
        get realHistory(){
          return this.$store.getters['config/getHistory']
        }

      download() {
      const data = encodeURIComponent('NAME, "HANNA"')
        this.myUrl = `data:text/plain;charset=utf-8,${data}`
        this.myFilename = 'example.CSV'
    }

    }
</script>