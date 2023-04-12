<template>
        <v-card>
            <v-toolbar>
                <v-toolbar-title>Результаты измерений</v-toolbar-title>
                <v-spacer></v-spacer>
                
                <v-toolbar-items>
                <app-btn
                    color=""
                    fab
                    large
                    text
                    @click="$filters.routeTo($router, '/')"
                    >
                        <v-icon>$collapse</v-icon>
                </app-btn>
                </v-toolbar-items>
            </v-toolbar>

            <div>
            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $radioactive
            </v-icon>
            88.8
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $coefficient
            </v-icon>
            88.8
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $coefficientAlt
            </v-icon>
            88.8
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $speed
            </v-icon>
            88.8
            </v-chip>
            </div>
            <result-table v-bind:full="size"/>

        </v-card>    
</template>
  
<script lang="ts">
    import ResultTable from '@/components/custom/result/ResultTable.vue'
    import { Component, Vue } from 'vue-property-decorator'

    @Component({
    
    components: {
        ResultTable
    }
    })
    export default class ResultTableFull extends Vue {
        size = true

    }
</script>
  