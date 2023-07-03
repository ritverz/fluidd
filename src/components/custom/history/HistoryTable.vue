<template>
<div>
    <v-toolbar>
        <v-chip v-if="showBtns" class="ma-2">
          <a v-on:click="selected? downloadHTML(): ''" :href="selected? myUrlHTML: ''" :download="myFilename">Скачать HTML</a>
        </v-chip>

        <v-chip v-if="showBtns" class="ma-2">
          <a v-on:click="selected? downloadJSON(): ''" :href="selected? myUrl: ''" :download="myFilename">Скачать JSON</a>
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          @click="deleteAll()">
          Очистить историю
        </v-btn>
        
<!--         
        <v-btn>
            Просмотр отчета
        </v-btn> -->


        <!-- <app-column-picker
          v-if="headers"
          key-name="history"
          :headers="headers"
        /> -->
    </v-toolbar>

    <!-- <p> {{ showBtns  }} {{ selected }}</p> -->
    <v-data-table
        v-model="selected"
        @input="checkSelected"
        :headers="visibleHeaders"
        :items="history"
        :single-select="true"
        item-key="id"
        show-select
        class="elevation-1"
        :single-expand="false"
        :expanded.sync="expanded"
        show-expand
      >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            Res table: {{ JSON.stringify(item) }}
          </td>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            @click="deleteItem(item)"
          >
            $delete
          </v-icon>
        </template>

    </v-data-table>
</div>
</template>

<script lang="ts">

import { HistoryEntry } from '@/store/config/types'
import { Component, Vue } from 'vue-property-decorator'
import { v4 as uuidv4 } from 'uuid'
import { template } from 'lodash-es'


    @Component({
    
    components: {
    }
    })
    export default class HistoryTable extends Vue {
        expanded = []

        myUrl = '#'
        myUrlHTML = '#'
        myFilename = ''
        json_data  = [
            {'name': 'Test'}]
        search = ''
        selected = []
        showBtns = false

        checkSelected()
        {
          this.showBtns =  this.selected.length? true : false
        }
        
        get visibleHeaders ()
        {
          return this.headers.filter(header => header.visible || header.visible === undefined)
        }
        
        get realHistory(){
          return this.$store.getters['config/getHistory']
        }

        get headers(){
          return [
            {text: 'Дата', value: 'date', configurable: true, visible: true},
            {text: 'Id', value: 'id', configurable: true, visible: false},
            {text: 'Количество', value: 'sourceNumber', configurable: true, visible: true},
            {text: 'Получатель', value: 'recipient', configurable: true, visible: true},
            {text: 'Название пресета', value: 'name', configurable: true, visible: true},
            {text: 'Номер ТП', value: 'numberTP', configurable: true, visible: true},
            {text: 'Радионуклид', value: 'radionuclide', configurable: true, visible: true},
            {text: 'Технолог', value: 'technologist', configurable: true, visible: true},
            {text: 'Код источника', value: 'sourceCode', configurable: true, visible: true},
            {text: 'Матрица', value: 'matrix', configurable: true, visible: true},
            { text: 'Действия', value: 'actions', sortable: false },
        ]
        }

        get history(){
          let data = []
          for (let h of this.realHistory) {
            data.push(
              {
              name: h.setup.name,
              id: h.id,
              date: h.date,
              sourceNumber: h.setup.sourceNumber,
              recipient: h.setup.recipient,
              numberTP: h.setup.numberTP,
              radionuclide: h.setup.radionuclide,
              technologist: h.setup.technologist,
              sourceCode: h.setup.sourceCode,
              matrix: h.setup.matrix,
              results: h.experiment,
              appendix: h.setup,
            })
          }
          return data
        }
    
    table(item: any){
      let res = '<table style="border-collapse: collapse; width: 100%;" border="1"><tbody>'

      for (let attr in item.appendix){
        res = res + '<tr>'
        res =  res + `<td style="width: 50%;">${attr}</td>`
        if (attr == 'accessories'){
          res =  res + `<td style="width: 50%;">${JSON.stringify(item.appendix[attr])}</td>`
        }
        else {
          res =  res + `<td style="width: 50%;">${item.appendix[attr]}</td>`
        }
        res =  res + '</tr>'
      }

      res = res + '</tbody></table>'
      return res
    }

    tableResults(item: any){
      
      let res = ''
      for (let tablet in item.results){
         res += `<h3>Таблетка ${tablet}</h3>`
        res += '<table style="border-collapse: collapse; width: 100%;" border="1"><tbody>'
        let measurements = item.results[tablet]
        for (let obj of measurements){
          for (let attr in obj){
            if (attr == 'tablet') break
            res += '<tr>'
            res += `<td style="width: 50%;">${attr}</td>`
            res += `<td style="width: 50%;">${obj[attr]}</td>`
            res += '</tr>'
          }
          res += '<tr>'
          res += `<td style="width: 50%;"> </td>`
          res += '</tr>'
        }
        res += '</tbody></table>'
      }

     
      return res
    }

    generateHTML(data: any){
      let html_text = ''

      let item = data[0]
      let setup_html_table = this.table(item)
      let tablets_tables = this.tableResults(item)
      html_text = `
      <html>
        <head>
          <meta charset=UTF-8">
        </head>
        <body>
          <h1 style="text-align: center;">Отчет</h1>
          <p style="text-align: right;"><em>Дата:${item.date}</em></p><h3>Входные параметры</h3><p><br></p>
          ${setup_html_table}
          ${tablets_tables}
        </body>
      </html>
      `
      return html_text.replace(/[\r\n]/gm, '')

      
    }

    downloadHTML() {
      if (!this.selected) return
      let text = this.generateHTML(this.selected)
      const data = encodeURIComponent(text)
          this.myUrlHTML = `data:text/plain;charset=utf-8,${data}`
          this.myFilename = 'report.html'
    }

    downloadJSON() {
      if (!this.selected) return
      const data = encodeURIComponent(JSON.stringify(this.selected))
          this.myUrl = `data:text/plain;charset=utf-8,${data}`
          this.myFilename = 'report.JSON'
    }

    deleteAll(){
      this.$store.dispatch('printer/removeAllHistory')

    }

    deleteItem(item: any){
      
      this.$store.dispatch('printer/removeHistoryById', item.id)

    }

    }
</script>