<template>

<history-card></history-card>

</template>

<script lang="ts">

import HistoryCard from '@/components/custom/history/HistoryCard.vue'
import { Component, Vue } from 'vue-property-decorator'

    @Component({
    
    components: {
        HistoryCard,
    }
    })
    export default class HistoryReports extends Vue {

    }

</script>