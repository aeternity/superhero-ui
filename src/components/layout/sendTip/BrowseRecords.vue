<template>
  <div class="browse-form">
    <div v-if="open">
      <div class="form-title clearfix">
        <img
          :title="$t('close')"
          class="close-sendform"
          src="../../../assets/iconClose.svg"
          @click="toggleBrowseRecords(false)"
        >
      </div>
      <form @submit.prevent>
        <div class="form-group pick-url">
          <img
            src="../../../assets/defaultUrl.svg"
            class="url-status"
          >
          <input
            v-model="browseRecords.url"
            type="text"
            class="form-control url-input"
            :placeholder="$t('components.layout.BrowseRecords.EnterUrl')"
          >
        </div>
        <div class="pick-date">
          <b-form-datepicker
            v-model="browseRecords.startDate"
            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
            local="en"
            :no-highlight-today="false"
            locale="en-US"
            class="start-date"
            size="md"
            :placeholder="$t('components.layout.BrowseRecords.FromDate')"
            reset-button
            calendar-width="50%"
            :hide-header="true"
          />
          <b-form-datepicker
            v-model="browseRecords.endDate"
            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
            local="en"
            :no-highlight-today="false"
            locale="en-US"
            class="end-date"
            size="md"
            :placeholder="$t('components.layout.BrowseRecords.ToDate')"
            reset-button
            calendar-width="50%"
            :hide-header="true"
          />
          <AeButton
            :disabled="!isDataValid()"
            class="browse-button"
            @click="submitBrowseRecordsForm"
          >
            {{ $t('components.layout.BrowseRecords.BrowseRecords') }}
          </AeButton>
        </div>
      </form>
    </div>
    <div
      v-else-if="!open"
      class="closed-view"
      @click="toggleBrowseRecords(true)"
    >
      <div class="form-group selected-preview">
        <input
          v-model="appliedUrlFilter"
          type="text"
          class="form-control comment input-placeholder"
          :placeholder="$t('components.layout.BrowseRecords.BrowseRecords')"
          disabled
        >
        <div class="absolute-overlay" />
      </div>
    </div>
  </div>
</template>

<script>
import { testValidUrl } from '../../../utils/util';
import AeButton from '../../AeButton.vue';

export default {
  name: 'BrowseRecords',
  components: {
    AeButton,
  },
  data() {
    return {
      isBlacklistedUrl: false,
      open: true,
      browseRecords: {
        startDate: '',
        endDate: '',
        url: '',
      },
      appliedUrlFilter: '',
    };
  },
  methods: {
    toggleBrowseRecords(openSection) {
      this.open = openSection;
    },
    isDataValid() {
      return testValidUrl(this.browseRecords.url) && this.validateDates();
    },
    validateDates() {
      const startDate = new Date(this.browseRecords.startDate);
      const endDate = new Date(this.browseRecords.endDate);
      return endDate >= startDate;
    },
    submitBrowseRecordsForm() {
      this.appliedUrlFilter = this.browseRecords.url;
      this.toggleBrowseRecords(false);
    },
  },
};
</script>

<style lang="scss" scoped>
  .browse-form {
    background-color: $actions_ribbon_background_color;
    max-height: 400px;
  }

  form {
    padding: 0.6rem 1rem 1rem 1rem;
  }

  .form-group {
    margin-bottom: 0;

    input {
      background-color: $buttons_background;
      color: $standard_font_color;
      font-size: 0.75rem;
      height: 2.2rem;
    }
  }

  .pick-url {
    display: flex;
    align-items: center;
    position: relative;
  }

  .url-input {
    padding-left: 2.6rem;
  }

  .form-title {
    font-weight: 600;
    font-size: 0.8rem;
    color: $standard_font_color;
    padding: 0.375rem 0.5rem;
    background-color: $light_color;

    label {
      margin-bottom: 0;
    }
  }

  .url-status {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .closed-view {
    padding: 1rem;
    position: relative;

    &:hover {
      cursor: pointer;
    }
  }

  .pick-date {
    margin-top: 1rem;
    display: flex;
    align-items: center;

    .form-control {
      padding: 0.2125rem 0;
    }

    .browse-button {
      min-width: 7.5rem;
    }
  }

  .input-placeholder[disabled] {
    &::placeholder {
      color: $standard_font_color;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .close-sendform {
    width: 0.65rem;
    float: right;

    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }

  @media (max-width: 1024px) {
    .pick-date {
      flex-wrap: wrap;
      justify-content: flex-end;

      .form-control {
        margin-right: 0;
        margin-bottom: 1rem;
      }
    }
  }
</style>
