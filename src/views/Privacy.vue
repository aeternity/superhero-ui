<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper mt-2">
      <div class="row content">
        <div class="col-sm-12">
          <h1>{{ $t('views.Privacy.title') }}</h1>

          <p>
            {{ $t('views.Privacy.subtitle') }}
          </p>

          <div class="first">
            <h5><b>{{ $t('views.Privacy.first') }}</b></h5>
            <p>
              {{ $t('views.Privacy.first_0') }}
            </p>

            <p>
              {{ $t('views.Privacy.first_1') }}
            </p>
            <p>
              {{ $t('views.Privacy.first_2') }}
            </p>
          </div>
          <div class="second">
            <h5><b>{{ $t('views.Privacy.second') }}</b></h5>
            <p>{{ $t('views.Privacy.second_0') }}</p>
            <ul>
              <li>
                {{ $t('views.Privacy.second_1') }}
              </li>
              <li>
                {{ $t('views.Privacy.second_2') }}
              </li>
              <li>
                {{ $t('views.Privacy.second_3') }}
              </li>
              <li>
                {{ $t('views.Privacy.second_4') }}
              </li>
              <li>
                {{ $t('views.Privacy.second_5') }}
              </li>
            </ul>
          </div>
          <div class="third">
            <h5><b>{{ $t('views.Privacy.third') }}</b></h5>
            <p>{{ $t('views.Privacy.third_0') }}</p>
            <ul>
              <span>{{ $t('views.Privacy.third_1') }}</span>
              <li>{{ $t('views.Privacy.third_2') }}</li>
              <li>{{ $t('views.Privacy.third_3') }}</li>
            </ul>
          </div>
          <div class="fourth">
            <h5><b>{{ $t('views.Privacy.fourth') }}</b></h5>
            <p>{{ $t('views.Privacy.fourth_0') }}</p>
            <ul>
              <li>{{ $t('views.Privacy.fourth_1') }}</li>
              <li>{{ $t('views.Privacy.fourth_2') }}</li>
              <li>{{ $t('views.Privacy.fourth_3') }}</li>
              <li>{{ $t('views.Privacy.fourth_4') }}</li>
              <li>{{ $t('views.Privacy.fourth_5') }}</li>
              <li>{{ $t('views.Privacy.fourth_6') }}</li>
              <li>{{ $t('views.Privacy.fourth_7') }}</li>
            </ul>
          </div>
          <div class="fifth">
            <h5><b>{{ $t('views.Privacy.fifth') }}</b></h5>
            <p>{{ $t('views.Privacy.fifth_0') }}</p>
            <p>{{ $t('views.Privacy.fifth_1') }}</p>
          </div>
          <div class="sixth">
            <h5><b>{{ $t('views.Privacy.sixth') }}</b></h5>
            <ul>
              <li>{{ $t('views.Privacy.sixth_0') }}</li>
              <li>{{ $t('views.Privacy.sixth_1') }}</li>
              <li>{{ $t('views.Privacy.sixth_2') }}</li>
            </ul>
          </div>
          <div class="seventh">
            <h5><b>{{ $t('views.Privacy.seventh') }}</b></h5>
            <p>{{ $t('views.Privacy.seventh_0') }}</p>
          </div>
          <div class="eighth">
            <h5><b>{{ $t('views.Privacy.eighth') }}</b></h5>
            <p>{{ $t('views.Privacy.eighth_0') }}</p>
          </div>
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
  name: 'Privacy',
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
