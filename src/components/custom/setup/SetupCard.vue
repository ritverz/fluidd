<template>
    <collapsable-card
      :title="'Исходные данные'"
      icon="$radioactive"
      draggable
      layout-path="dashboard.setup-card"
      menu-breakpoint="lg"
    >
      <template #title>
        <v-icon left>
          $radioactive
        </v-icon>
        <span class="font-weight-light">Исходные данные</span>
      </template>

      <setup/>
        
    </collapsable-card>
  </template>


<script lang="js">
import Setup from './Setup.vue'


export default {
  components: {
    Setup,
  },

}
</script>

<style>
</style>