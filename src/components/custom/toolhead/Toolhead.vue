<template>
  <div>
    <v-card-text>
      <v-row
        justify="space-between"
        align="start"
      >
        <v-col class="controls-wrapper">
          <toolhead-moves v-if="!printerPrinting" />
        </v-col>

        <v-col class="controls-wrapper">
          <toolhead-position />
        </v-col>
      </v-row>
    </v-card-text>

    <!-- <v-card-text>
      <speed-and-flow-adjust />
    </v-card-text> -->

  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ToolheadMoves from './ToolheadMoves.vue'
import ToolheadPosition from './ToolheadPosition.vue'
import SpeedAndFlowAdjust from './SpeedAndFlowAdjust.vue'

@Component({
  components: {
    ToolheadMoves,
    ToolheadPosition,
    SpeedAndFlowAdjust,
  }
})
export default class Toolhead extends Mixins(StateMixin) {
}
</script>

<style type="scss" scoped>
  .controls-wrapper {
    min-width: 380px !important;
    max-width: 450px !important;
  }
</style>
