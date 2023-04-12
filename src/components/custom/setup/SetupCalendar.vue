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
        v-model="date"
        :label="label"
        prepend-icon=$calendar
        readonly
        v-bind="attrs"
        v-on="on"
        ></v-text-field>
    </template>
    <v-date-picker v-model="date" @input="ctrlMenu = false"></v-date-picker>
</v-menu>

</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'


@Component
export default class SetupCalendar extends Mixins(StateMixin){
    date = new Date().toISOString().substr(0, 10);
    ctrlMenu = false

    @Prop({ type: String, default: 'Дата' })
    readonly label!: String
}

</script>