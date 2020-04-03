<template>
  <div class="maintenance container">
    <div v-if="view === 'recharge'">
      <div class="recharge">
        <h1>We're recharging our powers.</h1>
        <img
          class="maintenance--image"
          src="../assets/recharge.gif"
        >
        <h2>We'll be up, up and away in no time.</h2>
      </div>
    </div>
    <div v-if="view === 'cleaning'">
      <div class="cleaning">
        <h1>Cleaning up the HQ.</h1>
        <img
          class="maintenance--image"
          src="../assets/ShieldFill.svg"
        >
        <h2>We'll be flying again in a few minutes.</h2>
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
    color: #3290E2;
  }
}

.cleaning {
  h1 {
    color: #3290E2;
  }
  h2 {
    color: white;
  }
}
</style>
