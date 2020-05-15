<template>
  <div>
    <div class="container my-2" v-if="blockchainTrace">
      <h2>Tip {{ blockchainTrace.tip.id }}</h2>

      <div class="row">
        <FormatDate :date-timestamp="new Date(blockchainTrace.tip.timestamp)"/>
      </div>
      <div class="row">
        {{ blockchainTrace.tip.url }} ({{ blockchainTrace.url_tips.length }} Tips)
      </div>
      <div class="row">
        Total Claimed:
        <AeAmount class="mx-2" :round="2" :amount="blockchainTrace.tip.total_claimed_amount"/>
        Total Unclaimed:
        <AeAmount class="mx-2" :round="2" :amount="blockchainTrace.tip.total_unclaimed_amount"/>
        Retips:
        <span class="mx-2">
          {{ blockchainTrace.tip.retips.length }}
          (<AeAmount :round="2" :amount="blockchainTrace.tip.retip_amount_ae"/>)
        </span>
      </div>
      <div class="row" v-if="blockchainTrace.url_oracle_claim"
           v-bind:class="[blockchainTrace.url_oracle_claim.success ? 'success' : 'error']">
        Oracle Response: {{ blockchainTrace.url_oracle_claim.account }}
        ({{ blockchainTrace.url_oracle_claim.percentage }}%)
      </div>
      <div class="row error" v-else>No Oracle Result yet</div>
    </div>
    <div class="container my-2" v-if="blockchainTrace">
      <h2>Events</h2>

      <div class="row" v-for="(event, i) in sortedEvents" v-bind:key="i">
        <FormatDate :date-timestamp="new Date(event.time)"/>
        <span class="mx-1 font-weight-bold">{{ event.event }}</span>
        ({{ event.address }}
        <span v-if="event.event === 'CheckPersistClaim'">, {{ event.amount }}%</span>
        <span v-if="event.event === 'TipWithdrawn' || event.event === 'TipReceived'">
          , <AeAmount :round="2" :aettos="true" :amount="event.amount"/>
        </span>)
      </div>
    </div>
  </div>
</template>

<script>
import Backend from '../../utils/backend';
import AeAmount from '../../components/AeAmount.vue';
import FormatDate from '../../components/tipRecords/FormatDate.vue';

export default {
  name: 'Tracing',
  components: { FormatDate, AeAmount },
  data() {
    return {
      tipId: this.$route.params.id,
      backendTrace: null,
      blockchainTrace: null,
    };
  },
  computed: {
    sortedEvents() {
      return this.blockchainTrace.url_events.sort((a, b) => a.time - b.time);
    },
  },
  mounted() {
    this.traceTip(this.tipId);
  },
  methods: {
    async traceTip(id) {
      this.backendTrace = await Backend.getTipTraceBackend(id);
      this.blockchainTrace = await Backend.getTipTraceBlockchain(id);
    },
  },
};
</script>

<style scoped>
  .success {
    color: limegreen;
  }

  .error {
    color: orangered;
  }
</style>
