<template>
  <div class="maintenance container">
    <div v-if="view === 'recharge'">
      <div class="recharge">
        <h1>{{ $t('views.Maintenance.RechargeTitle') }}</h1>
        <img
          class="maintenance--image"
          src="../assets/recharge.gif"
        >
        <h2>{{ $t('views.Maintenance.RechargeSubTitle') }}</h2>
      </div>
    </div>
    <div v-if="view === 'cleaning'">
      <div class="cleaning">
        <h1>{{ $t('views.Maintenance.CleaningTitle') }}</h1>
        <img
          class="maintenance--image"
          src="../assets/ShieldFill.svg"
        >
        <h2>{{ $t('views.Maintenance.CleaningSubTitle') }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Maintenance',
  data() {
    return {
      // cleaning or recharge
      view: 'recharge',
    };
  },
};
</script>

<style lang="scss" scoped>
.maintenance {
  margin: 4rem auto;
  padding: 1rem;

  h1 {
    font-size: 55px;
    font-weight: bold;
    text-align: center;
    line-height: 80px;
    margin: 50px 0;
  }

  h2 {
    font-size: 35px !important;
    line-height: 55px;
    text-align: center;
    margin: 50px 0;
  }

  .maintenance--image {
    display: block;
    margin: 0 auto;
  }
}

.recharge {
  h1 {
    color: white;
  }

  h2 {
    color: #3290e2;
  }
}

.cleaning {
  h1 {
    color: #3290e2;
  }

  h2 {
    color: white;
  }
}
</style>
