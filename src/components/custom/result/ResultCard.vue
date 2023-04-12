<template>
    <collapsable-card
      :title="'Результаты работы'"
      icon="$radioactive"
      draggable
      layout-path="dashboard.result-card"
      menu-breakpoint="lg"
    >
      <template #title>
        <v-icon left>
          $radioactive
        </v-icon>
        <span class="font-weight-light">Результаты работы</span>
      </template>

      <template #menu>
        <app-btn
          color=""
          fab
          x-small
          text
          @click="$filters.routeTo($router, '/results')"
        >
          <v-icon>$fullScreen</v-icon>
        </app-btn>
      </template>
      
      <result-table v-bind:full="size"/>

    </collapsable-card>
  </template>


<script lang="ts">
import ResultTable from './ResultTable.vue'
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'

@Component({
  components: {
    ResultTable
  }
})
export default class ResultCard extends Mixins(StateMixin) {
  size=false
}
</script>

<style>
</style>