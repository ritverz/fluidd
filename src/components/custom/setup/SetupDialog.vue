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
         
    <v-col cols="3" >

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
                <v-toolbar-title>Редактирование набора</v-toolbar-title>
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
                                v-model="name"></v-text-field>
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
                                v-model="sourceCode"
                                :items="sourceCodeValues"
                                clearable
                                label="Код источника">
                            </v-autocomplete>
                            <v-text-field  
                                v-model="numberTP" 
                                label="Номер ТП">
                            </v-text-field>
                            <v-text-field
                                v-model="radionuclide"
                                label="Радионуклид">
                            </v-text-field>
                            <v-text-field 
                                v-model="radionuclideActivity" 
                                label="Активность радионуклида в источнике">
                            </v-text-field>
                            <v-text-field 
                                v-model.number="sourceStart"
                                type="number"
                                label="Начальный номер источника"
                                @submit="updateSourceStart"
                            >
                            </v-text-field>
                            <app-named-slider
                                suffix="шт"
                                :value="sourceNumber"
                                :reset-value="0"
                                :label="label"
                                @submit="updateSourceNumber"
                            />
                            
                            <p class="text--disabled font-weight-thin" v-if="sourceNumber != undefined && sourceStart !=undefined">
                            {{ rangeValue }}
                            </p>
                            <v-autocomplete  
                                v-model="recipient"
                                :items="recipientValues"
                                clearable
                                label="Получатель">
                            </v-autocomplete>
                            <v-autocomplete 
                                v-model="technologist"
                                :items="technologistValues"
                                clearable
                                label="Технолог">
                            </v-autocomplete>
                            <v-text-field 
                                v-model="notes" 
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
                                v-model="matrix"
                                :items="matrixTypeValues"
                                clearable
                                label="Тип керамической матрицы">
                            </v-autocomplete>
                            <v-text-field suffix="мКи" label="Целевая активность одной активной части"></v-text-field>
                        </v-col>
                    </v-container>
                </v-tab-item>
                    
                <!--Измерения и РВ-->
                <v-tab-item>
                    <v-container>
                        <v-col>
                            <v-text-field suffix="мКи" label="Активность эталона № 1"></v-text-field>
                            <setup-calendar  type="date" label="Дата калибровки активности эталона №1"/>
                            <v-text-field suffix="мКи" label="Активность эталона № 2"></v-text-field>
                            <setup-calendar  label="Дата калибровки активности эталона №2"/>
                            <v-text-field label="Номер ПВК радиоактивного препарата"></v-text-field>
                            <v-text-field suffix="мКи" label="Начальная активность препарата"></v-text-field>
                            <v-text-field suffix="мкл" label="Начальный объем препарата"></v-text-field>
                        </v-col>
                    </v-container>
                </v-tab-item>

                <!-- Комплектующие -->
                <v-tab-item>
                    <v-container>
                    <v-list>
                        <v-list-item
                        class="mb-5 d-block"
                        v-for="(item, index) in items"
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
                                    <v-btn v-if="index == items.length - 1" @click="addItem()">
                                        <v-icon>
                                            $plus
                                        </v-icon>
                                    </v-btn>
                                    <v-btn v-if="items.length > 1" @click="deleteItem(index)">
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
    sourceCode = ''
    numberTP = ''
    radionuclide = ''
    radionuclideActivity = ''
    technologist = ''
    recipient = ''
    notes = ''
    matrix = ''
    id = -1
    name = ''


    // presets = ['-', 'Пресет1', 'Пресет2', 'Пресет3']
    selectedPreset = '-'

    sourceStart = 0
    sourceNumber = 1
    label = "Количество"

    dialog = false
    dialogName = false


    get presetsNames(){
        let names = [...this.$store.getters['config/getSetupPresetsNames']]
        names.push('-')
        return names
    }

    get presets(){
        return this.$store.getters['config/getSetupPresets']
    }

    get preset(){
        return {
                id: this.id,
                name: this.name,
                sourceCode: this.sourceCode,
                numberTP: this.numberTP,
                radionuclide: this.radionuclide,
                radionuclideActivity: this.radionuclideActivity,
                sourceStart: this.sourceStart,
                sourceNumber: this.sourceNumber,
                recipient: this.recipient,
                technologist: this.technologist,
                notes: this.notes
        }
    }

    removePreset(){
        this.dialog = false
        this.$store.dispatch('config/removeSetupPreset', this.preset)
        this.selectedPreset = '-'
    }

    saveNewPreset(){
        this.dialog = false
        let  newPreset = Object.create(this.preset)
        newPreset.id = -1
        this.$store.dispatch('config/updateSetupPreset', newPreset)
    }

    updatePreset(){
        this.dialog = false
        this.$store.dispatch('config/updateSetupPreset', this.preset)

    }

    @Watch('dialog')
    dialogVisible(val: boolean) {
        if (val) {
            if (this.selectedPreset != '-'){
                const preset = this.$store.getters['config/getSetupPresetByName'](this.selectedPreset)
                this.initWithPresetData(preset)
            }
        }
    }

    initWithPresetData(preset: any){
        this.sourceCode = preset.sourceCode
        this.numberTP = preset.numberTP
        this.radionuclide = preset.radionuclide
        this.radionuclideActivity = preset.radionuclideActivity
        this.technologist = preset.technologist
        this.recipient = preset.recipient
        this.notes = preset.notes
        this.matrix = preset.matrix
        this.sourceStart = preset.sourceStart
        this.sourceNumber = preset.sourceNumber
        this.id = preset.id
        this.name = preset.name
    }


    updateSourceStart(target: number){
        this.sourceStart = target
    }
    updateSourceNumber(target: number){
        this.sourceNumber = target
    }

    get rangeValue(){
        if (this.sourceStart != undefined && this.sourceNumber != undefined){
            let end = this.sourceStart + this.sourceNumber
            return `Диапазон (${this.sourceStart} - ${end})`
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

    items = [
        {
            id: undefined,
            number: undefined,
            date: undefined, 
        },
    ]
    tab = null
    test = 999
    date = new Date().toISOString().substr(0, 10);
    ctrlMenu = false


    addItem() {
        this.items.push(
            {
                id: undefined,
                number: undefined,
                date: undefined, 
            }
        )

    }

    deleteItem(i: number){
        if (this.items.length > 1) {
            this.items.splice(i, 1)
        }

    }
}

</script>

<style>
</style>