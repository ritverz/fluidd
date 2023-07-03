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

            <v-chip>
            <v-icon left>
                $calibration
            </v-icon>
            {{ inCalib }}
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $k1
            </v-icon>
            {{ k1 }}
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $k2
            </v-icon>
            {{ k2 }}
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $kbackground
            </v-icon>
            {{ backgroundActivity }}
            </v-chip>


            <!-- <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                
            </v-icon>
            {{ k1 + k2 }}
            </v-chip> -->

            <!-- <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $kbackground
            </v-icon>
            {{ ref }}
            </v-chip> -->

            <!-- <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $kbackground
            </v-icon>
            {{ refFirstActivity }}
            </v-chip> -->
            
            <!-- <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $kbackground
            </v-icon>
            {{ refSecondActivity }}
            </v-chip> -->

            <!-- <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $kbackground
            </v-icon>
            {{ ka }}
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $kbackground
            </v-icon>
            {{ kb }}
            </v-chip>

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $k1
            </v-icon>
            {{ Az }}
            </v-chip> -->




            

            <!-- <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $calc
            </v-icon>
            {{ computedActivity }}
            </v-chip> -->

           <!-- <div
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
            </v-chip>  -->
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

        get inCalib(){
            return this.$store.getters['printer/getInCalib']
        }
        get refFirstActivity(){
            return this.$store.getters['config/getCurrentSetup'].refFirstActivity
        }

        get refSecondActivity(){
            return this.$store.getters['config/getCurrentSetup'].refSecondActivity
        }

        get currentRadiation(){
            return this.$store.getters['printer/getCurrent']
        }

        get k1(){
            return this.$store.getters['printer/getK1']
        }

        get k2(){
            return this.$store.getters['printer/getK2']
        }

        get ka(){
            return this.$store.getters['printer/getKa']
        }

        get kb(){
            return this.$store.getters['printer/getKb']
        }

        get Az(){
            return this.$store.getters['printer/getAz']
        }


        get backgroundActivity(){
            return this.$store.getters['printer/getActivityBackground']
        }

        get ref(){
            return this.$store.getters['printer/getRef']
        }

        // get temp(){
        //     return this.$store.getters['config/getHistory']
        //     // return this.$store.getters['printer/getInExperiment']
        //     // return this.$store.getters['printer/getcurrTab']
        // }

        // get temp2(){
        //     //return this.$store.getters['printer/getcurrIter']
        //     return this.$store.getters['config/getTest']
        // }

        // get temp3(){
        //     return this.$store.getters['printer/getcurrTab']
        //     //return this.$store.getters['config/getHistory']
        // }

       

    }
</script>
