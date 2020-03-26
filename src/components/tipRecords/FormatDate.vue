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
  props: ['dateTimestamp'],
  computed: {
    formatDate() {
      const today = new Date();
      const tipDate = new Date(this.dateTimestamp);
      const isToday = (today.toDateString() === tipDate.toDateString());
      return isToday ? tipDate.toLocaleTimeString('en-US', { hourCycle: 'h24' }) : tipDate.toLocaleDateString('en-US');
    },
    wholeDateAndTime() {
      return new Date(this.dateTimestamp).toLocaleString('en-US', { hourCycle: 'h24' });
    },
    isoFormattedDateAndTime() {
      return new Date(this.dateTimestamp).toISOString();
    },
  },
};
</script>
