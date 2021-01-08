<template>
  <div>
    <BackButtonRibbon :title="selectedWord">
      <WordBuySellButtons
        v-if="saleContractAddress"
        :sale="saleContractAddress"
      />
    </BackButtonRibbon>

    <ActivityRibbon
      v-model="activity"
      :tabs="ribbonTabs"
    />

    <div v-if="activity === 'info'">
      <div class="asset_details__section">
        <div
          v-if="data"
          class="asset_details__info"
        >
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Ticker') }}</h3>
            <div>{{ selectedWord }}</div>
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.CurrentPrice') }}</h3>
            <div>
              <AeAmount
                :amount="data.buyPrice"
                aettos
              />
            </div>
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.SellPrice') }}</h3>
            <AeAmount
              :amount="data.sellPrice"
              aettos
            />
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Supply') }}</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply"
            />
          </div>
        </div>

        <div class="asset_details__section-content">
          <h3>{{ $t('components.WordDetail.Asset') }}</h3>
          <div
            v-if="data && tokenInfo"
            class="asset-details__asset"
          >
            {{ tokenInfo[data.tokenAddress].name }}
          </div>
          <h3>{{ $t('components.WordDetail.Description') }}</h3>
          <div
            v-if="data"
            class="asset-details__description"
          >
            {{ data.description }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedWord && activity === 'voting'">
      <div class="asset_voting__section">
        <TabBar
          v-model="activeTab"
          :tabs="tabs"
        />

        <div
          v-if="activeTab === 'ongoing' && data"

          class="asset_details__section initiate-vote"
        >
          <i18n
            path="components.WordDetail.Release"
            tag="div"
            class="stake-label"
          >
            <AeAmount
              :amount="data.spread"
              aettos
            />
          </i18n>

          <div class="initiate-vote-inputs">
            <input
              v-model.trim="newVotePayout"
              :disabled="loading.createVote"
              class="form-control"
              placeholder="Enter aeternity address"
            >

            <AeButton
              :disabled="!newVotePayout"
              :loading="loading.createVote"
              @click="createVote"
            >
              <IconCheckmarkCircle />
              {{ $t('components.WordDetail.Initiate') }}
            </AeButton>
          </div>
        </div>

        <div
          v-if="data"
          class="asset_details__info"
        >
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Spread') }}</h3>
            <AeAmount
              :amount="data.spread"
              aettos
            />
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Supply') }}</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply"
            />
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Stake') }}</h3>
            <div>
              <AeAmount
                :token="data.tokenAddress"
                :amount="data.totalSupply / 2"
              />
            </div>
          </div>
        </div>

        <div class="asset_details__section">
          <div class="asset_details__section-content">
            <div
              v-for="vote in votes"
              :key="vote.id"
              class="vote"
            >
              <div class="vote-row">
                <div class="vote-row-start">
                  <AeAmount
                    :amount="data.spread"
                    aettos
                  />
                  <span v-if="vote.statusTimeouting">
                    {{ $t('components.WordDetail.ReleasedTo') }}
                  </span>
                  <span v-if="vote.statusApplied">{{ $t('components.WordDetail.SpreadTo') }}</span>
                  <span v-if="!vote.isClosed">
                    {{ $t('components.WordDetail.ToBeReleasedTo') }}
                  </span>
                  <span
                    v-if="vote.statusTimeouted || vote.statusClosedAndUnsuccessful"
                  >{{ $t('components.WordDetail.NotTransferred') }}</span>
                </div>
                <div class="vote-row-end">
                  <IconHourglass />
                  <span v-if="!vote.isClosed">{{ $t('components.WordDetail.ClosingIn') }}</span>
                  <span v-if="vote.statusPast">{{ $t('components.WordDetail.Closed') }}</span>

                  <Timeago
                    :datetime="vote.statusTimeouting ? vote.dateTimeout : vote.dateClose"
                    auto-update
                  />
                  <span v-if="vote.statusPast">{{ $t('components.WordDetail.Ago') }}</span>
                  <span v-if="vote.statusTimeouting">{{ $t('components.WordDetail.Left') }}</span>
                </div>
              </div>

              <div class="vote-row">
                <div class="vote-row-start payout-address">
                  {{ vote.subject.VotePayout[0] }}
                </div>

                <AeButton
                  v-if="vote.showApplyPayout"
                  class="vote-row-end green"
                  :loading="loading.applyPayout"
                  @click="applyPayout(vote.id)"
                >
                  <IconCheckmarkCircle />
                  {{ $t('components.WordDetail.Send') }}
                </AeButton>
              </div>

              <label
                v-if="vote.showVoteOption"
                class="stake-label"
              >
                {{ $t('components.WordDetail.Amount') }}
              </label>
              <label
                v-if="vote.accountHasVoted"
                class="stake-label"
              >
                {{ $t('components.WordDetail.Staked') }}
              </label>
              <label
                v-if="!vote.showVoteOption && !vote.accountHasVoted"
                class="stake-label"
              >
                {{ $t('components.WordDetail.NotParticipate') }}
              </label>

              <div class="input-bar">
                <AeInputAmount
                  v-if="vote.showVoteOption || vote.accountHasVoted"
                  v-model="vote.stakeAmount"
                  :disabled="!vote.showVoteOption || isZero(vote.stakeAmount) ||
                    loading.revokeVote || loading.voteOption || loading.withdraw"
                  :token="data.tokenAddress"
                  no-dropdown
                  no-fiatvalue
                />

                <AeButton
                  v-if="vote.showRevoke"
                  :loading="loading.revokeVote"
                  @click="revokeVote(vote.voteAddress)"
                >
                  <IconCloseCircle />
                  {{ $t('components.WordDetail.Revoke') }}
                </AeButton>

                <AeButton
                  v-if="vote.showVoteOption"
                  :disabled="isZero(vote.stakeAmount)"
                  :loading="loading.voteOption"
                  @click="voteOption(vote.voteAddress, true, vote.stakeAmount)"
                >
                  <IconCheckmarkCircle />
                  {{ $t('components.WordDetail.Vote') }}
                </AeButton>

                <AeButton
                  v-if="vote.showWithdraw"
                  :loading="loading.withdraw"
                  @click="withdraw(vote.voteAddress)"
                >
                  <IconClaimBack />
                  {{ $t('components.WordDetail.Claim') }}
                </AeButton>

                <div class="vote-progress-bar">
                  <div
                    class="vote-progress"
                    :class="{
                      timeouted: vote.statusTimeouted || vote.statusClosedAndUnsuccessful,
                      applied: vote.statusApplied,
                    }"
                    :style="{ width: vote.stakePercent + '%' }"
                  >
                    <span v-if="vote.statusOngoing">{{ `${vote.stakePercent}%` }}</span>
                    <span v-if="vote.statusTimeouted">
                      {{ $t('components.WordDetail.TimedOut') }}
                    </span>
                    <span v-if="vote.statusClosedAndUnsuccessful">
                      {{ $t('components.WordDetail.Unsuccessful') }}
                    </span>
                    <span v-if="vote.statusApplied">
                      {{ $t('components.WordDetail.Transfered') }}
                    </span>
                  </div>
                </div>
              </div>
              <br>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { EventBus } from '../utils/eventBus';
import Backend from '../utils/backend';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import WordBuySellButtons from '../components/WordBuySellButtons.vue';
import IconPie from '../assets/iconPie.svg?icon-component';
import IconInfo from '../assets/iconInfo.svg?icon-component';
import IconClaimBack from '../assets/iconClaimBack.svg?icon-component';
import IconCloseCircle from '../assets/iconCloseCircle.svg?icon-component';
import IconCheckmarkCircle from '../assets/iconCheckmarkCircle.svg?icon-component';
import IconHourglass from '../assets/iconHourglass.svg?icon-component';
import AeAmount from '../components/AeAmount.vue';
import ActivityRibbon from '../components/ActivityRibbon.vue';
import TabBar from '../components/TabBar.vue';
import AeInputAmount from '../components/AeInputAmount.vue';
import AeButton from '../components/AeButton.vue';
import { shiftDecimalPlaces, blockToDate } from '../utils';

export default {
  name: 'WordBazaar',
  components: {
    TabBar,
    ActivityRibbon,
    AeAmount,
    WordBuySellButtons,
    BackButtonRibbon,
    AeInputAmount,
    AeButton,
    IconClaimBack,
    IconCloseCircle,
    IconCheckmarkCircle,
    IconHourglass,
  },
  data: () => ({
    wordRegistryState: null,
    selectedWord: null,
    saleContractAddress: null,
    ongoingVotes: [],
    pastVotes: [],
    myVotes: [],
    data: null,
    newVotePayout: '',
    tokenVoting: {},
    activity: 'info',
    activeTab: 'ongoing',
    ribbonTabs: [{ icon: IconInfo, text: 'Token Info', activity: 'info' }, { icon: IconPie, text: 'Voting', activity: 'voting' }],
    tabs: [{ text: 'Ongoing Votes', tab: 'ongoing' }, { text: 'Past Votes', tab: 'past' }, { text: 'My Votes', tab: 'my' }],
    loading: {
      createVote: false,
      revokeVote: false,
      applyPayout: false,
      withdraw: false,
      voteOption: false,
    },
  }),
  computed: {
    ...mapState(['address', 'tokenInfo', 'tokenBalances']),
    votes() {
      switch (this.activeTab) {
        case 'ongoing':
          return this.ongoingVotes;
        case 'past':
          return this.pastVotes;
        case 'my':
          return this.myVotes;
        default:
          return [];
      }
    },
    maxAmount() {
      const tokenBalance = this.tokenBalances && this.data
        && this.tokenBalances.find((b) => b.token === this.data.tokenAddress);

      return tokenBalance ? tokenBalance.balance : '0';
    },
  },
  watch: {
    maxAmount() {
      this.loadVotes();
    },
  },
  created() {
    this.selectedWord = this.$route.params.word;
    this.reloadData();
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
  },
  methods: {
    isZero(number) {
      return new BigNumber(number).isZero();
    },
    async reloadData() {
      this.wordRegistryState = await Backend.getWordRegistry();

      // eslint-disable-next-line prefer-destructuring
      this.saleContractAddress = this.wordRegistryState.tokens
        .find(([word]) => word === this.selectedWord)[1];

      this.loadSpread();
      this.loadVotes();
    },
    async loadSpread() {
      this.data = await Backend.getWordSale(this.saleContractAddress);
    },
    async loadVotes() {
      let votes = await Backend.getWordSaleVotesDetails(this.saleContractAddress);
      const height = await this.$store.dispatch('aeternity/getHeight');
      votes = votes.map((vote) => {
        const voterAccount = vote.voteAccounts.find(([acc]) => acc === this.address);

        const accountHasVoted = !!voterAccount;
        const hasWithdrawAmount = voterAccount
          && new BigNumber(voterAccount[1][0]).isGreaterThan(0) && !voterAccount[1][2];

        const showRevoke = !vote.isClosed && accountHasVoted;
        const showVoteOption = !vote.isClosed && !accountHasVoted;
        const showApplyPayout = vote.isClosed && !vote.alreadyApplied
          && !vote.timeouted && vote.isSuccess;
        const showWithdraw = vote.isClosed && hasWithdrawAmount;

        const statusClosed = vote.isClosed && !vote.alreadyApplied && !vote.timeouted;
        const statusClosedAndUnsuccessful = statusClosed && !vote.isSuccess;
        const statusApplied = vote.alreadyApplied;
        const statusTimeouted = !vote.alreadyApplied && vote.timeouted;
        const statusTimeouting = statusClosed && !statusClosedAndUnsuccessful && !statusTimeouted;
        const statusOngoing = (!vote.isClosed || !(statusTimeouted || statusApplied))
          && !statusClosedAndUnsuccessful;
        const statusPast = statusTimeouted || statusApplied || statusClosedAndUnsuccessful;

        const statusMy = accountHasVoted;
        const stakeMaxAmount = showVoteOption ? this.maxAmount : 0;
        const stakeAmountUnshifted = voterAccount ? voterAccount[1][0] : stakeMaxAmount;
        const stakeAmount = shiftDecimalPlaces(
          stakeAmountUnshifted, -this.tokenInfo[this.data.tokenAddress].decimals,
        ).toFixed(2);

        const dateClose = blockToDate(vote.closeHeight, height);
        const dateTimeout = blockToDate(vote.timeoutHeight, height);

        return {
          ...vote,
          accountHasVoted,
          hasWithdrawAmount,
          showRevoke,
          showVoteOption,
          showApplyPayout,
          showWithdraw,
          statusClosed,
          statusClosedAndUnsuccessful,
          statusApplied,
          statusTimeouted,
          statusTimeouting,
          statusOngoing,
          statusPast,
          statusMy,
          stakeAmount,
          dateClose,
          dateTimeout,
        };
      });

      this.ongoingVotes = votes.filter((v) => v.statusOngoing);
      this.pastVotes = votes.filter((v) => v.statusPast);
      this.myVotes = votes.filter((v) => v.statusMy);
    },
    async applyPayout(id) {
      this.load.applyPayout = true;
      try {
        await this.$store.dispatch('aeternity/tokenSaleMethod',
        {
        contractAddress: this.saleContractAddress,
          method: 'apply_vote_subject',
          args: [id],
        });

      this.updateWords();
        await Backend.invalidateWordSaleVotesCache(this.saleContractAddress);
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Payout failed!',
          primaryButtonText: 'OK',
        });
      } finally {
        this.load.applyPayout = false;
        EventBus.$emit('reloadData');
      }
    },
    async withdraw(address) {
      this.loading.withdraw = true;
      try {
        await this.$store.dispatch('aeternity/tokenVotingMethod', address, 'withdraw');
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Withdraw failed!',
          primaryButtonText: 'OK',
        });
      } finally {
        this.loading.withdraw = false;
        EventBus.$emit('reloadData');
      }
    },
    async voteOption(address, option, amount) {
      this.loading.voteOption = true;
      try {

        const shiftedAmount = shiftDecimalPlaces(amount,
          this.tokenInfo[this.data.tokenAddress].decimals).toFixed();

        await this.$store.dispatch('aeternity/createOrChangeAllowance', this.data.tokenAddress, shiftedAmount, address.replace('ct_', 'ak_'));
        await this.$store.dispatch('aeternity/tokenVotingMethod', address, 'vote', [option, shiftedAmount]);
        await Backend.invalidateWordSaleVoteStateCache(address);
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Vote failed!',
          primaryButtonText: 'OK',
        });
      } finally {
        this.loading.voteOption = false;
        EventBus.$emit('reloadData');
      }
    },
    async revokeVote(address) {
      this.loading.revokeVote = true;
      try {
        await this.$store.dispatch('aeternity/tokenVotingMethod', address, 'revoke_vote');
        await Backend.invalidateWordSaleVoteStateCache(address);
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Vote revoke failed!',
          primaryButtonText: 'OK',
        });
      } finally {
        this.loading.revokeVote = false;
        EventBus.$emit('reloadData');
      }
    },
    async createVote() {
      this.loading.createVote = true;
      try {
        const metadata = {
          subject: {VotePayout: [this.newVotePayout]},
          description: `Payout spread of ${this.selectedWord} to ${this.newVotePayout}`,
          link: 'https://aeternity.com/',
        };

        const height = await this.$store.dispatch('aeternity/getHeight');
        const closeHeight = height + 20;
        const token = await this.$store.dispatch('aeternity/tokenSaleMethod',
          {
            contractAddress: this.saleContractAddress,
            method: 'get_token',
          });
        const address = await this.$store.dispatch('aeternity/deployTokenVotingContract', {
          metadata,
          closeHeight,
          token,
        });

        await this.$store.dispatch('aeternity/tokenSaleMethod',
          {
            contractAddress: this.saleContractAddress,
            method: 'add_vote',
            args: [address],
          });
        await Backend.invalidateWordSaleVotesCache(this.saleContractAddress);
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Vote was not created!',
          primaryButtonText: 'OK',
        });
      } finally {
        this.loading.createVote = false;
        EventBus.$emit('reloadData');
      }
    },
  },
};
</script>

<style lang="scss">
h3 {
  color: $small_heading_color;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.2rem;
}

.asset_details__section {
  background-color: $light_color;
  font-weight: 500;
  font-size: 0.75rem;

  .asset-details__asset {
    color: $pure_white;
    padding-bottom: 1rem;
  }

  .asset-details__description {
    color: $tip_note_color;
    padding-bottom: 1rem;
  }

  .asset_details__info {
    background-color: $thumbnail_background_color;
  }

  .asset_details__section-content {
    padding: 1.5rem;
  }
}

.asset_details__info {
  padding: 1.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .info-item {
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
  }
}

.asset_voting__section {
  .asset_details__info {
    background-color: $light_color;
  }
}

.initiate-vote {
  margin-bottom: 0.1rem;
  padding: 1.2rem;

  .initiate-vote-inputs {
    display: flex;
    flex-direction: row;
    margin-top: 0.4rem;

    input {
      background-color: $buttons_background;
      color: $standard_font_color;
      border: 0.05rem solid $buttons_background;
      border-radius: 0.25rem;
      flex: 1;
      margin-right: 1.2rem;
      font-size: 0.7rem;
      height: 2rem;

      &:focus,
      &:active {
        border: 0.05rem solid $secondary_color;
        box-shadow: none;
      }
    }

    .ae-button {
      font-size: 0.8rem;
      height: 2rem;
    }
  }
}

.stake-label {
  color: $small_heading_color;
  font-weight: 500;
  font-size: 0.75rem;
  padding-left: 0.1rem;
}

.vote {
  box-sizing: border-box;
  box-shadow: 0.1rem 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  background-color: $thumbnail_background_color;
  padding: 0.8rem;
  border: 1px solid $thumbnail_background_color;
  margin-bottom: 1.2rem;
  color: $small_heading_color;

  .vote-row {
    display: flex;
    margin-bottom: 0.6rem;

    .vote-row-start {
      flex: 1;
    }

    .vote-row-end {
      font-weight: normal;
      justify-content: end;

      time {
        color: $tip_note_color;
      }
    }
  }

  .payout-address {
    color: $tip_note_color;
    font-weight: normal;
    font-size: 0.7rem;
  }

  &:active,
  &:hover {
    border: 1px solid $custom_links_color;
  }

  .vote-progress-bar {
    background-color: $bg_hover;
    width: 9rem;
    border-radius: 0.3rem;
    overflow: hidden;
  }

  .vote-progress {
    background-color:
      rgba(
        red($custom_links_color),
        green($custom_links_color),
        blue($custom_links_color),
        0.5
      );
    font-weight: normal;
    height: 100%;
    color: $pure_white;
    line-height: 2rem;
    font-size: 1rem;
    padding-left: 0.7rem;

    &.timeouted {
      text-align: center;
      background-color: $bg_hover;
      color: $red_color;
      font-size: 0.75rem;
      width: 100% !important;
    }

    &.applied {
      text-align: center;
      background-color: $bg_hover;
      color: $custom_links_color;
      font-size: 0.75rem;
      width: 100% !important;
    }
  }

  .ae-button {
    height: 100%;
    font-weight: bold;
    font-size: 0.8rem;
  }

  .input-bar {
    margin-top: -0.4rem;
    display: flex;
    height: 2rem;
    width: 100%;
    justify-content: space-between;

    & > * {
      margin-left: 0.4rem;
    }

    & > *:first-child {
      margin-left: 0;
    }

    & > *:last-child {
      justify-content: flex-end;
      margin-left: auto;
    }
  }

  .input-group {
    width: auto;
    max-width: 8rem;
    height: 100%;

    .input-group-append > span.append__ae {
      font-size: 0.62rem;
    }

    .form-control {
      height: 100%;
    }
  }
}

</style>
