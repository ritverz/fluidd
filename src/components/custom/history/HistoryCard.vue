<template>

<collapsable-card
:title="'История и отчеты'"
icon="$history"
>
<history-table></history-table>
</collapsable-card>

</template>

<script lang="ts">

import HistoryTable from '@/components/custom/history/HistoryTable.vue'
import { Component, Vue } from 'vue-property-decorator'

    @Component({
    
    components: {
        HistoryTable,
    }
    })
    export default class HistoryCard extends Vue {

    }

</script>