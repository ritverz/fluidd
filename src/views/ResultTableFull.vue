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
            {{currentRadiation}}
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $coefficient
            </v-icon>
            {{ k1 }}
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $coefficientAlt
            </v-icon>
            {{ k2 }}
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $speed
            </v-icon>
            {{ velocity }}
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $calc
            </v-icon>
            {{ computedActivity }}
            </v-chip>

           <div
            class="ma-2"
            label
            text-color="white"
            style="width: 300px word-wrap: break-word;"
            >

            {{ temp }}
            </div>
 
            <div
            class="ma-2"
            label
            text-color="white"
            style="width: 300px word-wrap: break-word;"
            >

            {{ temp2 }}
            </div>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $calc
            </v-icon>
            {{ temp3 }}
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

        get currentRadiation(){
            return this.$store.getters['printer/getCurrent']
        }

        get k1(){
            return this.$store.getters['printer/getK1']
        }

        get k2(){
            return this.$store.getters['printer/getK2']
        }

        get velocity(){
            return this.$store.getters['printer/geVelocity']
        }

        get computedActivity(){
            return this.$store.getters['printer/getComputedActivity']
        }

        get temp(){
            return this.$store.getters['config/getHistory']
            // return this.$store.getters['printer/getInExperiment']
            // return this.$store.getters['printer/getcurrTab']
        }

        get temp2(){
            //return this.$store.getters['printer/getcurrIter']
            return this.$store.getters['config/getTest']
        }

        get temp3(){
            return this.$store.getters['printer/getcurrTab']
            //return this.$store.getters['config/getHistory']
        }

       

    }
</script>
