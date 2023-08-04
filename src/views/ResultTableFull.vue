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

            <v-chip
            class="ma-2"
            label
            text-color="white"
            >
            <v-icon left>
                $kZero
            </v-icon>
            {{ backgroundActivity }}
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

        get ativityZero(){
            return this.$store.getters['printer/getActivityZero']
        }


        get backgroundActivity(){
            return this.$store.getters['printer/getActivityBackground']
        }

        get ref(){
            return this.$store.getters['printer/getRef']
        }
       

    }
</script>
