<template>
  <time
    :datetime="isoFormattedDateAndTime"
    :title="wholeDateAndTime"
  >
    {{ formatDate }}
  </time>
</template>

<script>
export default {
  name: 'FormatDate',
  props: {
    dateTimestamp: { type: Date, required: true },
  },
  computed: {
    formatDate() {
      const today = new Date();
      const tipDate = this.dateTimestamp;
      const isToday = (today.toDateString() === tipDate.toDateString());
      return isToday ? tipDate.toLocaleTimeString('en-GB') : tipDate.toLocaleDateString('en-US');
    },
    wholeDateAndTime() {
      return this.dateTimestamp.toLocaleString('en-US', { hourCycle: 'h24' });
    },
    isoFormattedDateAndTime() {
      return this.dateTimestamp.toISOString();
    },
  },
};
</script>
