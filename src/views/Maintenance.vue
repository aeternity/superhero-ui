<template>
  <div class="maintenance">
    <h1>{{ $t('views.Maintenance.RechargeTitle') }}</h1>
    <img src="../assets/recharge.gif">
    <h2>{{ $t('views.Maintenance.RechargeSubTitle') }}</h2>
  </div>
</template>

<script>
import { EventBus } from '../utils/eventBus';

export default {
  name: 'Maintenance',
  mounted() {
    const interval = setInterval(() => EventBus.$emit('reloadData'), 10 * 1000);

    EventBus.$on('backendLive', () => {
      clearInterval(interval);
      this.$router.push('/');
    });
  },
};
</script>

<style lang="scss" scoped>
.maintenance {
  background-color: #14151f;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  h1 {
    font-size: 55px;
    font-weight: bold;
    text-align: center;
    line-height: 80px;
    margin: 50px 0;
    color: white;
  }

  img {
    display: block;
    margin: 0 auto;
  }

  h2 {
    font-size: 35px;
    line-height: 55px;
    text-align: center;
    margin: 50px 0;
    color: #3290e2;
  }
}
</style>
