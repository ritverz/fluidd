<template>

<v-menu
v-model="ctrlMenu"
:close-on-content-click="false"
:nudge-right="40"
transition="scale-transition"
offset-y
min-width="290px"
>
    <template v-slot:activator="{ on, attrs }">
        <v-text-field
        v-model="value"
        :label="label"
        prepend-icon=$calendar
        readonly
        v-bind="attrs"
        v-on="on"
        ></v-text-field>
    </template>
    <v-date-picker v-model="value" @input="update"></v-date-picker>
</v-menu>

</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'


@Component
export default class SetupCalendar extends Mixins(StateMixin){

    // get innerDate (){
    //     //new Date().toISOString().substr(0, 10);
    //     return this.value
    // }

    // set innerDate(val: String){
    //     this.$emit('input', val)
    // }

    ctrlMenu = false


    @Prop({ type: String, default: 'Дата' })
    readonly label!: String

    @Prop({type: String})
    readonly value!: String

    update(target: string){
        this.ctrlMenu = false
        this.$emit('input', target)
    }
}

</script>