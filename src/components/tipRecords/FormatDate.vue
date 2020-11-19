<template>
  <time
    class="format-date"
    :datetime="isoFormattedDateAndTime"
    :title="wholeDateAndTime"
  >
    {{ formatDate }}
  </time>
</template>

<script>
export default {
  props: {
    date: { type: [String, Number, Date], required: true },
  },
  computed: {
    dateObject() {
      return new Date(this.date);
    },
    formatDate() {
      const now = new Date();
      const date = this.dateObject;
      const isToday = now.toDateString() === date.toDateString();
      return isToday ? date.toLocaleTimeString('en-GB') : date.toLocaleDateString('en-US');
    },
    wholeDateAndTime() {
      return this.dateObject.toLocaleString('en-US', { hourCycle: 'h24' });
    },
    isoFormattedDateAndTime() {
      return this.dateObject.toISOString();
    },
  },
};
</script>
