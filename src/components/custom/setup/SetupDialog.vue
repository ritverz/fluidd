<template>
    <v-row mt-2>

    <v-col cols="6">
        <v-autocomplete
            label="Выбрать пресет"
            v-model="selectedPreset"
            :items="presetsNames"
            variant="solo"
        >
        </v-autocomplete>
    </v-col>
         
    <v-col cols="4" >

        <!--Редактор пресета-->

        <v-btn
            large
            color="primary"
            @click="dialog = true"
        >
            <v-icon
            large>
            
            $edit
            </v-icon>
        </v-btn>

        <v-btn
            large
            @click="clearPresetData()"
        >
            <v-icon
            large>
            
            $erase
            </v-icon>
        </v-btn>

        <v-dialog
            v-model="dialog"
            fullscreen
            :scrim="false"
            transition="dialog-bottom-transition"
        >
            <v-card>
            <v-toolbar
                dark
            >
                <!--Закрывает редактор-->
                <v-btn
                icon
                dark
                @click="dialog = false"
                >
                <v-icon>$close</v-icon>
                </v-btn>
                <v-toolbar-title>
                    <span>Редактирование набора</span>
                    <span v-if="selectedPreset != '-'"> {{ selectedPreset }}</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>

                <!--Обновление пресета-->
                <v-toolbar-items v-if="selectedPreset !== '-' ">
                <v-btn
                    variant="text"
                    @click="updatePreset"
                >
                    Сохранить
                </v-btn>
                </v-toolbar-items>

                <!--Удаление пресета-->
                <v-toolbar-items v-if="selectedPreset !== '-' ">
                <v-btn
                    variant="text"
                    @click="removePreset"
                >
                    Удалить
                </v-btn>
                </v-toolbar-items>

                <!--Создать новый пресет-->
                <v-toolbar-items>
                    <v-dialog
                    v-model="dialogName"
                    persistent
                    max-width="290"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                            v-bind="attrs"
                            v-on="on"
                            >
                                Сохранить как пресет
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="text-h5">
                            Введите имя нового пресета
                            </v-card-title>
                            <v-card-text>
                                <v-text-field
                                v-model="preset.name"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn
                                variant="text"
                                @click="saveNewPreset">
                                    Подтвердить
                                </v-btn>
                                <v-btn
                                variant="text"
                                @click="dialogName = false">
                                    Отмена
                                </v-btn>
                             
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar-items>
            </v-toolbar>

            <v-tabs
            v-model="tab"
            bg-color="primary"
            >
                <v-tab value="one">Данные по ТП</v-tab>
                <v-tab value="two">Технические параметры</v-tab>
                <v-tab value="three">Измерения и РВ</v-tab>
                <v-tab value="four">Комплектующие</v-tab>

                <!-- Секция данные по ТП -->
                <v-tab-item>
                    <v-container>
                        <v-col>
                            <v-autocomplete  
                                v-model="preset.sourceCode"
                                :items="sourceCodeValues"
                                clearable
                                label="Код источника">
                            </v-autocomplete>
                            <v-text-field  
                                v-model="preset.numberTP" 
                                label="Номер ТП">
                            </v-text-field>
                            <v-text-field
                                v-model="preset.radionuclide"
                                label="Радионуклид">
                            </v-text-field>
                            <v-text-field 
                                v-model="preset.radionuclideActivity" 
                                label="Активность радионуклида в источнике">
                            </v-text-field>
                            <v-text-field 
                                v-model.number="preset.sourceStart"
                                type="number"
                                label="Начальный номер источника"
                                @submit="updateSourceStart"
                            >
                            </v-text-field>
                            <app-named-slider
                                suffix="шт"
                                :value="preset.sourceNumber"
                                :reset-value="0"
                                :label="label"
                                @submit="updateSourceNumber"
                            />
                            
                            <p class="text--disabled font-weight-thin" v-if="preset.sourceNumber != undefined && preset.sourceStart !=undefined">
                            {{ rangeValue }}
                            </p>
                            <v-autocomplete  
                                v-model="preset.recipient"
                                :items="recipientValues"
                                clearable
                                label="Получатель">
                            </v-autocomplete>
                            <v-autocomplete 
                                v-model="preset.technologist"
                                :items="technologistValues"
                                clearable
                                label="Технолог">
                            </v-autocomplete>
                            <v-text-field 
                                v-model="preset.notes" 
                                label="Примечания">
                            </v-text-field>
                    </v-col>
                    </v-container>
                </v-tab-item>

                 <!-- Технические параметры -->
                <v-tab-item>
                    <v-container>
                        <v-col>
                            <v-autocomplete 
                                v-model="preset.matrix"
                                :items="matrixTypeValues"
                                clearable
                                label="Тип керамической матрицы">
                            </v-autocomplete>
                            <v-text-field 
                                v-model.number="preset.targetActivity"
                                suffix="мКи"
                                label="Целевая активность одной активной части">
                            </v-text-field>
                        </v-col>
                    </v-container>
                </v-tab-item>
                    
                <!--Измерения и РВ-->
                <v-tab-item>
                    <v-container>
                        <v-col>
                            <v-text-field 
                                v-model.number="preset.refFirstActivity"
                                suffix="мКи"
                                label="Активность эталона № 1">
                            </v-text-field>
                            <setup-calendar
                            v-model="preset.refFirstDate"
                            type="date"
                            label="Дата калибровки активности эталона №1"/>
                            <v-text-field
                                v-model="preset.refSecondActivity"
                                suffix="мКи" 
                                label="Активность эталона № 2">
                            </v-text-field>
                            <setup-calendar
                                v-model="preset.refSecondDate"
                                label="Дата калибровки активности эталона №2"/>
                            <v-text-field 
                                v-model="preset.radioactiveNumber"
                                label="Номер ПВК радиоактивного препарата">
                            </v-text-field>
                            <v-text-field 
                                v-model.number="preset.initialActivity"
                                suffix="мКи" 
                                label="Начальная активность препарата">
                            </v-text-field>
                            <v-text-field 
                                v-model.number="preset.initialVolume"
                                suffix="мкл" 
                                label="Начальный объем препарата">
                            </v-text-field>
                        </v-col>
                    </v-container>
                </v-tab-item>

                <!-- Комплектующие -->
                <v-tab-item>
                    <v-container>
                    <v-list>
                        <v-list-item
                        class="mb-5 d-block"
                        v-for="(item, index) in preset.accessories"
                        :key="index"
                        >
                            <v-card>
                                <v-card-text>
                                    <v-col>
                                        <v-text-field  v-model="item.id" label="ID"></v-text-field>
                                        <v-text-field v-model="item.number" label="Номер"></v-text-field>
                                        <setup-calendar v-model="item.date" label="Дата входного контроля"/>
                                    </v-col>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn v-if="index == preset.accessories.length - 1" @click="addAccessory()">
                                        <v-icon>
                                            $plus
                                        </v-icon>
                                    </v-btn>
                                    <v-btn v-if="preset.accessories.length > 1" @click="deleteAccessory(index)">
                                        <v-icon>
                                            $minus
                                        </v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-list-item>
                    </v-list>
                    </v-container>
                </v-tab-item>
            </v-tabs>


            </v-card>
        </v-dialog>
    </v-col>
    </v-row>
</template>


<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import SetupCalendar from './SetupCalendar.vue'


@Component({
  components: {
    SetupCalendar
  }
})
export default class SetupDialog extends Mixins(StateMixin){
    selectedPreset = '-'
    label = "Количество"
    dialog = false
    dialogName = false
    tab = null
    //date = new Date().toISOString().substr(0, 10);
    ctrlMenu = false
    

    get presetsNames(){
        let names = [...this.$store.getters['config/getSetupPresetsNames']]
        names.push('-')
        return names
    }

    get presets(){
        return this.$store.getters['config/getSetupPresets']
    }

    set preset(payload){
        this.$store.commit('config/setCurrentSetup', payload)

    }

    get preset(){
        return this.$store.getters['config/getCurrentSetup']
    }

    removePreset(){    
        this.$store.dispatch('config/removeSetupPreset', this.preset)
        this.selectedPreset = '-'
        this.dialog = false
    }

    saveNewPreset(){
        this.dialog = false
        this.preset.id = -1
        this.$store.dispatch('config/updateSetupPreset', this.preset)
    }

    updatePreset(){
        this.dialog = false
        this.$store.dispatch('config/updateSetupPreset', this.preset)

    }

    addAccessory() {
        this.preset.accessories.push(
            {
                id: undefined,
                number: undefined,
                date: new Date().toISOString().substr(0, 10), 
            }
        )

    }

    deleteAccessory(i: number){
        if (this.preset.accessories.length > 1) {
            this.preset.accessories.splice(i, 1)
        }

    }

    @Watch('dialog')
    dialogVisible(val: boolean) {
        if (val) {
            if (this.selectedPreset != '-'){
                const preset = this.$store.getters['config/getSetupPresetByName'](this.selectedPreset)
                this.initWithPresetData(preset)
            }

        }
        if (!val){
            this.$store.commit('config/setCurrentSetup', this.preset)
        }
    }

    @Watch('selectedPreset')
    selectedPresetSet(val: string) {
        if (this.selectedPreset != '-'){
            const preset = this.$store.getters['config/getSetupPresetByName'](this.selectedPreset)
            this.initWithPresetData(preset)
            this.$store.commit('config/setCurrentSetup', this.preset)
        }
        else{
            this.$store.commit('config/setCurrentSetup', this.preset)
        }
    }


    clearPresetData(){
        this.selectedPreset = '-'
        this.$store.commit('config/clearCurrentSetup')
    }

    initWithPresetData(payload: any){
       
        this.preset = {...payload}
        // this.id = preset.id
        // this.name = preset.name
        // this.sourceCode = preset.sourceCode
        // this.numberTP = preset.numberTP
        // this.radionuclide = preset.radionuclide
        // this.radionuclideActivity = preset.radionuclideActivity
        // this.sourceStart = preset.sourceStart
        // this.sourceNumber = preset.sourceNumber
        // this.technologist = preset.technologist
        // this.recipient = preset.recipient
        // this.notes = preset.notes
        // this.matrix = preset.matrix
        // this.targetActivity = preset.targetActivity
        // this.refFirstActivity = preset.refFirstActivity
        // this.refFirstDate = preset.refFirstDate != '' ?  preset.refFirstDate :  new Date().toISOString().substr(0, 10)
        // this.refSecondActivity = preset.refSecondActivity 
        // this.radioactiveNumber = preset.radioactiveNumber
        // this.refSecondDate = preset.refSecondDate != '' ? preset.refSecondDate : new Date().toISOString().substr(0, 10)
        // this.initialVolume = preset.initialVolume
        // this.initialActivity = preset.initialActivity
        // this.accessories = preset.accessories
        
    }


    updateSourceStart(target: number){
        this.preset.sourceStart = target
    }
    
    updateSourceNumber(target: number){
        this.preset.sourceNumber = target
    }

    get rangeValue(){
        if (this.preset.sourceStart != undefined && this.preset.sourceNumber != undefined){
            let end = this.preset.sourceStart + this.preset.sourceNumber
            return `Диапазон (${this.preset.sourceStart} - ${end})`
        }
        else {
            return ""

        }
    }

    get matrixTypeValues(){
        return this.$store.state.config.uiSettings.setup.matrixTypeValues
    }

    get sourceCodeValues(){
        return this.$store.state.config.uiSettings.setup.sourceCodeValues
    }

    get technologistValues (){
        return this.$store.state.config.uiSettings.setup.technologistValues
    }

    get recipientValues (){
        return this.$store.state.config.uiSettings.setup.recipientValues
    }
}

</script>

<style>
</style>