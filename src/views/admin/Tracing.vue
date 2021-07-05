<template>
  <div>
    <div
      v-if="blockchainTrace"
      class="container my-2"
    >
      <h2>Tip {{ blockchainTrace.tip.id }}</h2>

      <div class="row">
        <FormatDate
          :date="blockchainTrace.tip.timestamp"
          class="mr-1"
        />
        <span class="font-weight-bold">{{ blockchainTrace.tip.url }}</span>
      </div>
      <div class="row">
        <span class="font-weight-bold mr-1">Single Tip:</span>
        Total Claimed:
        <AeAmount
          class="mx-2"
          :amount="blockchainTrace.tip.totalClaimedAmount"
        />
        Total Unclaimed:
        <AeAmount
          class="mx-2"
          :amount="blockchainTrace.tip.totalUnclaimedAmount"
        />
        Retips:
        <span class="mx-2">
          {{ blockchainTrace.tip.retips.length }}
        </span>
      </div>
      <div class="row">
        <span class="font-weight-bold mr-1">Tip Url:</span>
        Total Claimed:
        <AeAmount
          class="mx-2"
          :amount="blockchainTrace.urlStats.totalClaimedAmount"
        />
        Total Unclaimed:
        <AeAmount
          class="mx-2"
          :amount="blockchainTrace.urlStats.totalUnclaimedAmount"
        />
        Total Tips:
        <span class="mx-2">
          {{ blockchainTrace.urlStats.tipsLength }}
          (+ {{ blockchainTrace.urlStats.retipsLength }} Retips)
        </span>
      </div>
      <div
        v-if="blockchainTrace.urlOracleClaim"
        class="row"
        :class="[blockchainTrace.urlOracleClaim.success ? 'success' : 'error']"
      >
        Oracle Response: {{ blockchainTrace.urlOracleClaim.account }}
        ({{ blockchainTrace.urlOracleClaim.percentage }}%)
      </div>
      <div
        v-else
        class="row error"
      >
        No Oracle Result yet
      </div>
    </div>
    <div
      v-if="blockchainTrace"
      class="container my-2"
    >
      <h2>Contract Events</h2>

      <div
        v-for="(event, i) in sortedEvents"
        :key="i"
        class="row"
      >
        <FormatDate :date="parseInt(event.time)" />
        <span class="mx-1 font-weight-bold">{{ event.name }}</span>
        ({{ event.addresses.join(', ') }}
        <span v-if="event.name === 'CheckPersistClaim'">, {{ event.amount }}%</span>
        <span v-if="event.name === 'TipWithdrawn' || event.name === 'TipReceived'">
          , <AeAmount
            aettos
            :amount="event.amount"
          />
        </span>)
      </div>
    </div>
    <div
      v-if="backendTrace"
      class="container my-2"
    >
      <h2>Backend Claims</h2>

      <div
        v-for="(trace, i) in sortedTraces"
        :key="i"
        class="flex-column"
      >
        <h4 @click="expandedTrace = expandedTrace === i ? null : i">
          <FormatDate :date="trace[0].date" />
          Claim {{ i }} - {{ traceState(trace) }}
        </h4>
        <div
          v-for="(event, j) in trace"
          v-show="expandedTrace === i"
          :key="j"
          class="mb-2"
        >
          <span class="font-weight-bold">
            <FormatDate :date="event.date" />
            {{ event.state }}
          </span>
          <br>
          <span
            v-if="Object.keys(adjustEvent(event)).length > 2"
            class="text-info"
          >
            {{ adjustEvent(event) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Backend from '../../utils/backend';
import AeAmount from '../../components/AeAmount.vue';
import FormatDate from '../../components/tipRecords/FormatDate.vue';

export default {
  components: { FormatDate, AeAmount },
  props: {
    tipId: { type: [String, Number], required: true },
  },
  data() {
    return {
      backendTrace: null,
      blockchainTrace: null,
      expandedTrace: null,
    };
  },
  computed: {
    sortedEvents() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.blockchainTrace.urlEvents.sort((a, b) => a.time - b.time);
    },
    sortedTraces() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.backendTrace.sort((a, b) => a[0].date - b[0].date);
    },
  },
  mounted() {
    this.traceTip(this.tipId);
  },
  methods: {
    adjustEvent(event) {
      return { ...event, state: undefined, date: undefined };
    },
    traceState(trace) {
      return trace[trace.length - 1].answer || trace[trace.length - 1].result;
    },
    async traceTip(id) {
      this.backendTrace = await Backend.getTipTraceBackend(id);
      this.blockchainTrace = await Backend.getTipTraceBlockchain(id);
    },
  },
  metaInfo: {
    title: 'Tip Tracing',
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
