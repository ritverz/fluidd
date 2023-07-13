<template>
  <collapsable-card
    :title="'Ручное управление'"
    icon="$radioactive"
    draggable
    layout-path="dashboard.custom-toolhead-card"
    menu-breakpoint="lg"
  >
    <template #title>
      <v-icon left>
        $radioactive
      </v-icon>
      <span class="font-weight-light">Ручное управление</span>
    </template>

    <toolhead />

    <manual-probe-dialog
      v-if="manualProbeDialogOpen"
      v-model="manualProbeDialogOpen"
    />

    <bed-screws-adjust-dialog
      v-if="bedScrewsAdjustDialogOpen"
      v-model="bedScrewsAdjustDialogOpen"
    />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ToolheadMixin from '@/mixins/toolhead'
import Toolhead from './Toolhead.vue'

@Component({
  components: {
    Toolhead
  }
})
export default class CustomToolheadCard extends Mixins(StateMixin, ToolheadMixin) {
  manualProbeDialogOpen = false
  bedScrewsAdjustDialogOpen = false

  @Prop({ type: Boolean, default: false })
  readonly menuCollapsed!: boolean

  get printerSettings () {
    return this.$store.getters['printer/getPrinterSettings']()
  }

  get printerSupportsQgl (): boolean {
    return 'quad_gantry_level' in this.printerSettings
  }

  get printerSupportsZtilt (): boolean {
    return 'z_tilt' in this.printerSettings
  }

  get printerSupportsBedScrews (): boolean {
    return 'bed_screws' in this.printerSettings
  }

  get printerSupportsBedScrewsCalculate (): boolean {
    return 'screws_tilt_adjust' in this.printerSettings
  }

  get printerSupportsForceMove () {
    return (
      (this.printerSettings.force_move?.enable_force_move ?? false) &&
      !this.printerIsDelta
    )
  }

  get printerIsDelta () {
    return ['delta', 'rotary_delta'].includes(this.printerSettings.printer.kinematics)
  }

  get showManualProbeDialogAutomatically () {
    return this.$store.state.config.uiSettings.general.showManualProbeDialogAutomatically
  }

  get showBedScrewsAdjustDialogAutomatically () {
    return this.$store.state.config.uiSettings.general.showBedScrewsAdjustDialogAutomatically
  }

  get forceMove () {
    return this.$store.state.config.uiSettings.toolhead.forceMove
  }

  @Watch('isManualProbeActive')
  onIsManualProbeActive (value: boolean) {
    if (value && this.showManualProbeDialogAutomatically &&
      this.klippyReady && !this.printerPrinting) {
      this.manualProbeDialogOpen = true
    }
  }

  @Watch('isBedScrewsAdjustActive')
  onIsBedScrewsAdjustActive (value: boolean) {
    if (value && this.showBedScrewsAdjustDialogAutomatically &&
      this.klippyReady && !this.printerPrinting) {
      this.bedScrewsAdjustDialogOpen = true
    }
  }

  bedScrewsAdjust () {
    if (this.isBedScrewsAdjustActive) {
      this.bedScrewsAdjustDialogOpen = true
    } else {
      this.sendGcode('BED_SCREWS_ADJUST', this.$waits.onBedScrewsAdjust)
    }
  }

  async toggleForceMove () {
    if (!this.forceMove && this.$store.state.config.uiSettings.general.forceMoveToggleWarning) {
      const result = await this.$confirm(
        this.$tc('app.general.simple_form.msg.confirm_forcemove_toggle'),
        { title: this.$tc('app.general.label.confirm'), color: 'card-heading', icon: '$warning' }
      )

      if (!result) {
        return
      }
    }

    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.toolhead.forceMove',
      value: !this.forceMove,
      server: false
    })
  }
}
</script>
