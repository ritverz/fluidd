<template>
      <v-container>
        <v-row>
          <v-col>
         <!--- State -->
          <v-tabs
            v-model="tab"
            background-color="transparent"
            mobile-breakpoint="0"
            height="41"
            hide-slider
          >
                <v-tab
                key="status"
                >
                <v-icon left>
                    $printer3d
                </v-icon>
                {{ $t('app.printer.state.' + printerState) || printerState }}
                </v-tab>
          </v-tabs>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
          <!--Buttons-->     
          
          <app-btn-group class="d-inline">
            <app-btn
                class="ms-1 my-1"
                @click="calibStart()"
              >
                <v-icon
                  small
                  left
                >
                  $calibration
                </v-icon>
                <span>Калибровка</span>
            </app-btn>

            <!--start-->
            <app-btn
                class="ms-1 my-1"
                @click="startPrint()"
              >
                <v-icon
                  small
                  left
                >
                  $reprint
                </v-icon>
                <span>Старт</span>
            </app-btn>

             <!-- cancel -->
            <app-btn
              :loading="hasWait($waits.onPrintCancel)"
              :disabled="hasWait([$waits.onPrintCancel, $waits.onPrintResume, $waits.onPrintPause])"
              class="ms-1 my-1"
              @click="cancelPrint()"
            >
              <v-icon
                small
                left
              >
                $cancelled
              </v-icon>
              <span>Стоп</span>
            </app-btn>

            <!-- pause -->
            <!-- <app-btn

              :loading="hasWait($waits.onPrintPause)"
              :disabled="hasWait([$waits.onPrintCancel, $waits.onPrintResume, $waits.onPrintPause])"
              class="ml-1"
              @click="pausePrint()"
            >
              <v-icon
                small
                left
              >
                $pause
              </v-icon>
              <span>{{ $t('app.general.btn.pause') }}</span>
            </app-btn> -->

            <!--resume -->
            <!-- <app-btn
              :loading="hasWait($waits.onPrintResume)"
              :disabled="hasWait([$waits.onPrintCancel, $waits.onPrintResume, $waits.onPrintPause])"
              class="ml-1"
              @click="resumePrint()"
            >
              <v-icon
                small
                left
              >
                $resume 
              </v-icon>
              <span>{{ $t('app.general.btn.resume') }}</span>
            </app-btn> -->
          </app-btn-group>
          </v-col>
          
          <v-spacer></v-spacer>

          <!--mode label -->
          <v-card min-width="250px" >
          <v-card-text>
          <v-col class="d-flex justify-center align-center">
            <div>{{ modeLabel }}</div>
          </v-col>

          <v-col class="d-flex justify-center align-center">

            <!--mode switch -->
            <v-btn-toggle
            v-model="mode"
            color="primary"
            mandatory
            >
              <app-btn>
                <v-icon>$manual</v-icon>
              </app-btn>
              <app-btn>
                <v-icon>$auto</v-icon>
              </app-btn>
            </v-btn-toggle>
          </v-col>
          </v-card-text>
          </v-card>

        </v-row> 

          <!-- Edit dialog -->
         <setup-dialog/>

      </v-container>
  </template>


<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { SocketActions } from '@/api/socketActions'
import StateMixin from '@/mixins/state'
import SetupDialog from './SetupDialog.vue'


@Component({
  components: {
    SetupDialog
  }
})
export default class Setup extends Mixins(StateMixin){

  tab = 0

  get mode() {
    return this.$store.getters['config/getMode']
  }

  set mode(val: number) {
    this.$store.commit('config/setMode', val)
  }

  get modeLabel() {
    if (this.mode) {
      return 'Автоматический'
    }
    else {
      return 'Ручной'
    }
  }

  get filename () {
    return this.$store.state.printer.printer.print_stats.filename
  }

  calibStart(){
    this.$store.commit('config/clearResults')
    this.$store.commit('printer/setInCalib', true)
    this.sendGcode("START_CALIBRATION")
  }

  startPrint() {
    //SocketActions.printerPrintStart("/path/main.nc")
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.setup.currentSetup',
      value: this.$store.getters['config/getCurrentSetup'],
      server: true
    })
    this.$store.dispatch('printer/onExperimentStart').then((res) => {
      let start_cmd = this.$store.getters['config/getSetupMacrosCmd']
      this.sendGcode(`${start_cmd}`)
    })
  }

  pausePrint() {
    //SocketActions.printerPrintPause()
    this.sendGcode('PAUSE')

  }

  resumePrint(){
    //SocketActions.printerPrintResume()
    this.sendGcode('RESUME')

  }

  cancelPrint () {
    this.sendGcode('STOP')
    this.$store.dispatch('printer/onExperimentEnd')
    this.emergencyStop()
  }
}

</script>

<style>
</style>