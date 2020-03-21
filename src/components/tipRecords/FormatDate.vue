<template>
  <span>{{formatDate}}</span>
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
  },
};
</script>
