<template>
  <div class="word-bazaar">
    <BackButtonRibbon hide-back>
      <template #title>
        {{ title }}
      </template>
    </BackButtonRibbon>

    <ActivityRibbon
      :tabs="[]"
      value=""
    >
      <template slot="left">
        <FilterButton :to="{ name: 'word-bazaar-assets' }">
          <IconTokens />
          {{ $t('views.WordBazaar.RibbonTabs.0.Text') }}
        </FilterButton>
        <FilterButton :to="{ name: 'word-bazaar-create-token' }">
          <IconPlus />
          {{ $t('views.WordBazaar.RibbonTabs.1.Text') }}
        </FilterButton>
        <FilterButton :to="{ name: 'word-bazaar-get-ae' }">
          <IconAe />
          {{ $t('views.WordBazaar.RibbonTabs.2.Text') }}
        </FilterButton>
        <FilterButton :to="{ name: 'word-bazaar-how-it-works' }">
          <IconHelp2 />
          {{ $t('views.WordBazaar.RibbonTabs.3.Text') }}
        </FilterButton>
      </template>
    </ActivityRibbon>

    <RouterView />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import Backend from '../utils/backend';
import ActivityRibbon from '../components/ActivityRibbon.vue';
import FilterButton from '../components/FilterButton.vue';
import IconHelp2 from '../assets/iconHelp2.svg?icon-component';
import IconTokens from '../assets/iconTokens.svg?icon-component';
import IconPlus from '../assets/iconPlus.svg?icon-component';
import IconAe from '../assets/iconAe.svg?icon-component';
import { EventBus } from '../utils/eventBus';

export default {
  components: {
    BackButtonRibbon,
    ActivityRibbon,
    FilterButton,
    IconTokens,
    IconPlus,
    IconAe,
    IconHelp2,
  },
  computed: {
    ...mapState(['address']),
    title() {
      return this.$route.matched[1].components.default.metaInfo.call(this).title;
    },
  },
  mounted() {
    this.reloadData();
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
  },
  methods: {
    async order(ordering, direction) {
      this.ordering = ordering;
      this.direction = direction;
      await this.reloadData();
    },
    async reloadData() {
      this.loading = true;
      this.wordRegistryState = await Backend
        .getWordRegistry(this.ordering, this.direction, this.search);
      this.loading = false;
    },
  },
  metaInfo: {
    titleTemplate: '%s - WordBazaar',
  },
};
</script>

<style lang="scss" scoped>
.word-bazaar {
  .actions-ribbon {
    background-color: $actions_ribbon_background_color;
    color: $standard_font_color;
  }

  .activity-ribbon {
    background-color: $buttons_background;
    margin-bottom: 1px;

    svg {
      height: 24px;
      margin-right: 0.15rem;
    }
  }

  ::v-deep .abbreviation {
    font-weight: 500;
    color: $secondary_color;
  }
}
</style>
