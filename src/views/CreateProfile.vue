<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper">
      <div class="content tutorial-page">
        <h1>
          {{ $t('views.CreateProfile.header1') }} <br>
          {{ $t('views.CreateProfile.header2') }} <br>
          {{ $t('views.CreateProfile.header3') }}
        </h1>
        <hr width="30%">
        <expandable-block :title="$t('views.CreateProfile.01.title')">
          <p><b>{{ $t('views.CreateProfile.01.info_0') }}</b></p>
          <p />
          <p>
            {{ $t('views.CreateProfile.01.info_1') }}<br>
            {{ $t('views.CreateProfile.01.info_2') }}
          </p>
          <p>
            {{ $t('views.CreateProfile.01.info_3') }}<br>
            {{ $t('views.CreateProfile.01.info_4') }}
            <a
              href="https://addons.mozilla.org/en-US/firefox/addon/superhero-wallet/"
              target="_blank"
            >
              {{ $t('views.CreateProfile.here') }} </a><br>
            {{ $t('views.CreateProfile.click') }}
            <span class="highlited">{{ $t('views.CreateProfile.add') }}</span>
            {{ $t('views.CreateProfile.01.info_5') }}
            <span class="highlited">{{ $t('views.CreateProfile.add') }}</span>
            {{ $t('views.CreateProfile.01.info_6') }}<br>
            {{ $t('views.CreateProfile.01.info_7') }}<br>
          </p>
          <p>
            {{ $t('views.CreateProfile.01.info_8') }}<br>
            {{ $t('views.CreateProfile.01.info_9') }}
            <a
              :href="chromeLink"
              target="_blank"
            >
              {{ $t('views.CreateProfile.here') }}
            </a><br>
            {{ $t('views.CreateProfile.01.info_10') }}<br>
            {{ $t('views.CreateProfile.01.info_11') }}
          </p>
        </expandable-block>
        <expandable-block :title="$t('views.CreateProfile.02.title')">
          <p>
            {{ $t('views.CreateProfile.02.info_0') }}<br>
            {{ $t('views.CreateProfile.click') }}
            <span class="highlited">{{ $t('views.CreateProfile.02.info_1') }}</span><br>
            {{ $t('views.CreateProfile.02.info_2') }}<br>
            {{ $t('views.CreateProfile.02.info_3') }}<br>
          </p>
          <p>
            {{ $t('views.CreateProfile.02.info_4') }}<br>
            {{ $t('views.CreateProfile.02.info_5') }}<br>
            {{ $t('views.CreateProfile.02.info_6') }}<br>
            {{ $t('views.CreateProfile.02.info_7') }}
          </p>
        </expandable-block>
        <expandable-block :title="$t('views.CreateProfile.03.title')">
          <p>
            {{ $t('views.CreateProfile.03.info_0') }}<br>
            {{ $t('views.CreateProfile.03.info_1') }}<br>
            {{ $t('views.CreateProfile.03.info_2') }}<br>
            {{ $t('views.CreateProfile.03.info_3') }}
          </p>
          <p>
            {{ $t('views.CreateProfile.03.info_4') }}<br>
            {{ $t('views.CreateProfile.03.info_5') }}<br>
            {{ $t('views.CreateProfile.03.info_6') }}<br>
          </p>
          <ul>
            <li>
              {{ $t('views.CreateProfile.03.info_7') }}
              <span class="highlited">{{ $t('views.CreateProfile.03.info_8') }}</span>
              {{ $t('views.CreateProfile.03.info_9') }}
            </li>
            <li>
              {{ $t('views.CreateProfile.03.info_10') }}
            </li>
            <li>
              {{ $t('views.CreateProfile.03.info_11') }}
            </li>
          </ul>
          <p>
            {{ $t('views.CreateProfile.03.info_12') }}
          </p>
          <ul>
            <li>
              <b>{{ $t('views.CreateProfile.03.info_13') }}</b>
            </li>
          </ul>
          <p>
            {{ $t('views.CreateProfile.03.info_14') }}
          </p>
        </expandable-block>
        <expandable-block :title="$t('views.CreateProfile.04.title')">
          <p>
            {{ $t('views.CreateProfile.04.info_0') }}<br>
            {{ $t('views.CreateProfile.04.info_1') }}
          </p>
          <ul>
            <li>
              {{ $t('views.CreateProfile.04.info_2') }}
              <img src="../assets/iconExtension.svg"> {{ $t('views.CreateProfile.04.info_3') }}<br>
            </li>
            <li>
              {{ $t('views.CreateProfile.click') }}
              <span class="highlited">{{ $t('views.CreateProfile.04.info_4') }}</span>
            </li>
            <li>
              {{ $t('views.CreateProfile.04.info_5') }}
            </li>
            <li>
              {{ $t('views.CreateProfile.04.info_6') }}
              <span class="highlited">{{ $t('views.CreateProfile.04.info_7') }}</span>
              {{ $t('views.CreateProfile.04.info_8') }}
            </li>
            <li>
              {{ $t('views.CreateProfile.04.info_9') }}
            </li>
            <li>
              {{ $t('views.CreateProfile.click') }}
              <span class="highlited">{{ $t('views.CreateProfile.04.info_10') }}</span>
              {{ $t('views.CreateProfile.04.info_11') }}
            </li>
          </ul>
        </expandable-block>
        <expandable-block :title="$t('views.CreateProfile.05.title')">
          <p>
            {{ $t('views.CreateProfile.05.info_0') }}
          </p>
          <p>
            {{ $t('views.CreateProfile.05.info_1') }}<br>
            {{ $t('views.CreateProfile.05.info_2') }}
          </p>
          <p>
            {{ $t('views.CreateProfile.05.info_3') }}<br>
            {{ $t('views.CreateProfile.05.info_4') }}<br>
            {{ $t('views.CreateProfile.05.info_5') }}<br>
            {{ $t('views.CreateProfile.05.info_6') }}<br>
            {{ $t('views.CreateProfile.05.info_7') }}
            <a
              href="https://form.jotform.com/201075183408046"
              target="_blank"
            >
              {{ $t('views.CreateProfile.05.info_8') }}
            </a>
          </p>
        </expandable-block>
        <expandable-block :title="$t('views.CreateProfile.06.title')">
          <p>
            {{ $t('views.CreateProfile.06.info_0') }}
          </p>
          <ul>
            <li>
              {{ $t('views.CreateProfile.06.info_1') }}
              <span class="highlited">{{ $t('views.CreateProfile.06.info_2') }}</span>
            </li>
            <li>{{ $t('views.CreateProfile.06.info_3') }}</li>
            <li>{{ $t('views.CreateProfile.06.info_4') }}</li>
            <li>{{ $t('views.CreateProfile.06.info_5') }}</li>
          </ul>
          <p>
            {{ $t('views.CreateProfile.06.info_6') }}<br>
            {{ $t('views.CreateProfile.06.info_7') }}
          </p>
        </expandable-block>
        <expandable-block :title="$t('views.CreateProfile.07.title')">
          <p>
            {{ $t('views.CreateProfile.07.info_0') }}<br>
            {{ $t('views.CreateProfile.07.info_1') }}<br>
            {{ $t('views.CreateProfile.07.info_2') }}<br>
            {{ $t('views.CreateProfile.07.info_3') }}
          </p>
          <ul>
            <li>
              {{ $t('views.CreateProfile.07.info_4') }}
              <span class="highlited">{{ $t('views.CreateProfile.07.info_5') }}</span>
              {{ $t('views.CreateProfile.07.info_6') }}
            </li>
            <li>
              {{ $t('views.CreateProfile.click') }}
              <span class="highlited">{{ $t('views.CreateProfile.names') }}</span>.
            </li>
            <li>
              {{ $t('views.CreateProfile.07.info_7') }}
              <span class="highlited">{{ $t('views.CreateProfile.07.info_8') }}</span>
              {{ $t('views.CreateProfile.07.info_9') }}
            </li>
            <li>
              {{ $t('views.CreateProfile.07.info_10') }}
              <span class="highlited">+</span> {{ $t('views.CreateProfile.07.info_11') }}
            </li>
            <li>{{ $t('views.CreateProfile.07.info_12') }}</li>
          </ul>
          <p>
            {{ $t('views.CreateProfile.07.info_13') }}
            <a
              href="https://aeternity.com/documentation-hub/protocol/AENS/"
              target="_blank"
            >
              {{ $t('views.CreateProfile.here') }} </a>.
          </p>
          <p>
            {{ $t('views.CreateProfile.07.info_14') }}
          </p>
        </expandable-block>
        <expandable-block :title="$t('views.CreateProfile.08.title')">
          <p>
            {{ $t('views.CreateProfile.08.info_0') }}
          </p>
          <ul>
            <li>
              {{ $t('views.CreateProfile.08.info_1') }}
              <span class="highlited">{{ $t('views.CreateProfile.08.info_2') }}</span>
              {{ $t('views.CreateProfile.08.info_3') }}
              <span class="highlited">{{ $t('views.CreateProfile.names') }}</span>.
            </li>
            <li>
              {{ $t('views.CreateProfile.click') }}
              <span class="highlited">{{ $t('views.CreateProfile.08.info_4') }}</span>.
            </li>
            <li>
              {{ $t('views.CreateProfile.08.info_5') }}
              <span class="highlited">{{ $t('views.CreateProfile.08.info_6') }}</span>.
            </li>
            <li>
              {{ $t('views.CreateProfile.08.info_7') }}
            </li>
            <li>
              {{ $t('views.CreateProfile.click') }}
              <span class="highlited">{{ $t('views.CreateProfile.08.info_8') }}</span>
              {{ $t('views.CreateProfile.08.info_9') }}
            </li>
          </ul>
        </expandable-block>
      </div>
    </div>
  </div>
</template>

<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import ExpandableBlock from '../components/ExpandableBlock.vue';
import MobileNavigation from '../components/layout/MobileNavigation.vue';

export default {
  name: 'CreateProfile',
  components: {
    LeftSection,
    RightSection,
    ExpandableBlock,
    MobileNavigation,
  },
  computed: {
    chromeLink() {
      return 'https://chrome.google.com/webstore/detail/superhero/mnhmmkepfddpifjkamaligfeemcbhdne';
    },
  },
};
</script>

<style lang="scss">
.tutorial-page {
  color: $standard_font_color;

  .spacer {
    margin-bottom: 1rem;
  }

  .icons-margin {
    margin-right: 1rem;
  }

  .highlited {
    color: $standard_font_color;
    font-weight: 500;
  }
}
</style>
