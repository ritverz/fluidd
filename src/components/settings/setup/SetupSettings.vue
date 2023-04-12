<template>
    <div>
        <v-subheader id="setup">
            Исходные данные
        </v-subheader>
        <v-card
        :elevation="5"
        dense
        class="mb-4"
        >

        <app-setting :title="'Список технологов'">
        <v-combobox
          ref="technologistValues"
          v-model="technologistValues"
          filled
          dense
          hide-selected
          hide-details="auto"
          multiple
          small-chips
          append-icon=""
          deletable-chips
          :rules="[
          ]"
        />
      </app-setting>

      <app-setting :title="'Список получателей'">
        <v-combobox
          ref="recipientValues"
          v-model="recipientValues"
          filled
          dense
          hide-selected
          hide-details="auto"
          multiple
          small-chips
          append-icon=""
          deletable-chips
          :rules="[
          ]"
        />
      </app-setting>

      <app-setting :title="'Список кодов источников'">
        <v-combobox
          ref="sourceCodeValues"
          v-model="sourceCodeValues"
          filled
          dense
          hide-selected
          hide-details="auto"
          multiple
          small-chips
          append-icon=""
          deletable-chips
          :rules="[
          ]"
        />
      </app-setting>

      <app-setting :title="'Список типов керамических матриц'">
        <v-combobox
          ref="matrixTypeValues"
          v-model="matrixTypeValues"
          filled
          dense
          hide-selected
          hide-details="auto"
          multiple
          small-chips
          append-icon=""
          deletable-chips
          :rules="[
          ]"
        />
      </app-setting>



        </v-card>
    </div>

</template>


<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'


@Component({
  components: {
  }
})
export default class SetupSettings extends Mixins(StateMixin){

  get matrixTypeValues() {
    return this.$store.state.config.uiSettings.setup.matrixTypeValues   
  }

  set matrixTypeValues (value: string[]) {

    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.setup.matrixTypeValues',
      value: value,
      server: true
    })
  }

  get sourceCodeValues() {
    return this.$store.state.config.uiSettings.setup.sourceCodeValues   
  }

  set sourceCodeValues (value: string[]) {

    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.setup.sourceCodeValues',
      value: value,
      server: true
    })
  }


  get technologistValues () {
      return this.$store.state.config.uiSettings.setup.technologistValues
  }

  set technologistValues (value: string[]) {

    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.setup.technologistValues',
      value: value,
      server: true
    })
  }

  get recipientValues() {
      return this.$store.state.config.uiSettings.setup.recipientValues
  }

  set recipientValues (value: string[]) {

    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.setup.recipientValues',
      value: value,
      server: true
    })
  }
}

</script>