<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper mt-2">
      <div class="row content">
        <div class="col-sm-12">
          <h1>{{ $t('views.Terms.title') }}</h1>
          <p>
            {{ $t('views.Terms.subtitle') }}
          </p>


          <div class="first">
            <h5><b>{{ $t('views.Terms.first') }}</b></h5>
            <p>
              {{ $t('views.Terms.first_0') }}
            </p>
          </div>
          <div class="second">
            <h5><b>{{ $t('views.Terms.second') }}</b></h5>
            <p>
              {{ $t('views.Terms.second_0') }}
            </p>
          </div>
          <div class="third">
            <h5><b>{{ $t('views.Terms.third') }}</b></h5>
            <p>
              {{ $t('views.Terms.third_0') }}
            </p>
          </div>
          <div class="fourth">
            <h5><b>{{ $t('views.Terms.fourth') }}</b></h5>
            <p>
              {{ $t('views.Terms.fourth_0') }}
            </p>
          </div>
          <p>
            {{ $t('views.Terms.copyrights') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import MobileNavigation from '../components/layout/MobileNavigation.vue';

export default {
  name: 'Terms',
  components: {
    LeftSection,
    RightSection,
    MobileNavigation,
  },
};
</script>


<style lang="scss" scoped>
  .content {
    color: $primary_color;
  }

  .container.wrapper {
    min-height: 4rem;
  }

  @media only screen
    and (min-device-width: 320px)
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2) {
    .content {
      padding: 1rem;
    }
  }
</style>
