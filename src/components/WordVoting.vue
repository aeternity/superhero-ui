<template>
  <div class="word-voting">
    <TabBar>
      <TabBarButton
        :class="{ active: activeTab === 'ongoing' }"
        @click="activeTab = 'ongoing'"
      >
        {{ $t('views.WordDetail.Tabs.Ongoing') }}
      </TabBarButton>
      <TabBarButton
        :class="{ active: activeTab === 'past' }"
        @click="activeTab = 'past'"
      >
        {{ $t('views.WordDetail.Tabs.Past') }}
      </TabBarButton>
      <TabBarButton
        :class="{ active: activeTab === 'my' }"
        @click="activeTab = 'my'"
      >
        {{ $t('views.WordDetail.Tabs.My') }}
      </TabBarButton>
      <template slot="right">
        <ButtonPlain
          v-if="activeTab === 'ongoing' && maxAmount > 0"
          slot="right"
          @click="showInitiate = !showInitiate"
        >
          <span
            v-if="!showInitiate"
            class="desktop"
          >{{ $t('views.WordDetail.NewVote') }}</span>
          <IconPlus
            class="plus"
            :class="{ rotate: showInitiate }"
          />
        </ButtonPlain>
      </template>
    </TabBar>

    <Transition name="fade">
      <div
        v-if="activeTab === 'ongoing' && data && showInitiate"

        class="initiate-vote"
      >
        <Loader
          v-if="loading"
          :progress-message="progressMessage"
          :message="$t('views.WordDetail.ConfirmMessage')"
        />
        <template v-else>
          <div class="stake-label">
            {{ $t('views.WordDetail.CreateVote.YourMessage') }}
          </div>
          <MessageInput
            v-model="description"
            :placeholder="$t('views.WordDetail.CreateVote.Placeholder')"
          />
          <i18n
            path="views.WordDetail.Release"
            tag="div"
            class="stake-label"
          >
            <AeAmount
              :amount="data.spread"
              aettos
            />
          </i18n>

          <div class="initiate-vote-inputs">
            <Input
              v-model.trim="newVotePayout"
              :placeholder="$t('views.WordDetail.CreateVote.AddressPlaceholder')"
            />

            <AeButton
              :disabled="!newVotePayout || !description.length"
              @click="createVote"
            >
              <IconCheckmarkCircle /> <span>{{ $t('views.WordDetail.Initiate') }}</span>
            </AeButton>
          </div>
        </template>
      </div>
    </Transition>
    <div
      v-if="data"
      class="asset_details__info"
    >
      <div class="info-item">
        <h3>{{ $t('views.WordDetail.Spread') }}</h3>
        <AeAmount
          :amount="data.spread"
          aettos
        />
        <FiatValue
          :amount="data.spread"
          aettos
          no-parentheses
        />
      </div>
      <div class="info-item">
        <h3>{{ $t('views.WordDetail.Supply') }}</h3>
        <AeAmount
          :token="data.tokenAddress"
          :amount="data.totalSupply"
          no-symbol
        />
        <span class="abbreviation">
          {{ selectedWord }}
        </span>
      </div>
      <div class="info-item">
        <h3>{{ $t('views.WordDetail.Stake') }}</h3>
        <AeAmount
          :token="data.tokenAddress"
          :amount="data.totalSupply / 2"
          no-symbol
        />
        <span class="abbreviation">
          {{ selectedWord }}
        </span>
      </div>
    </div>

    <div class="asset_details__section">
      <div class="asset_details__section-content">
        <div
          v-if="!votes.length && activeTab === 'ongoing' && !loading"
          class="no-content"
        >
          <h3>{{ $t('views.WordDetail.NoVotes') }}</h3>
          <i18n
            v-if="maxAmount > 0"
            path="views.WordDetail.VoteText"
            tag="p"
          >
            <template #balance>
              <AeAmount
                :token="data.tokenAddress"
                :amount="maxAmount"
              />
            </template>
            <template #spread>
              <AeAmount
                :amount="data.spread"
                aettos
              />
            </template>
          </i18n>
          <i18n
            v-else
            path="views.WordDetail.VoteTextZero"
            tag="p"
          >
            <template #token>
              <span class="abbreviation">{{ selectedWord }}</span>
            </template>
            <template #spread>
              <AeAmount
                :amount="data.spread"
                aettos
              />
            </template>
          </i18n>
          <div class="buttons">
            <WordBuySellButtons
              v-if="saleContractAddress"
              :sale="saleContractAddress"
            >
              <OutlinedButton
                slot-scope="{ open }"
                class="green unpadded"
                :class="{ wide: maxAmount > 0 }"
                @click="open"
              >
                <IconTokensBuySell />
                <span class="mobile">{{ $t('views.WordDetail.BuyMobile') }}</span>
                <span
                  v-if="maxAmount > 0"
                  class="desktop"
                >{{ $t('views.WordDetail.BuyMore') }}</span>
                <span
                  v-else
                  class="desktop"
                >{{ $t('views.WordDetail.Buy') }}</span>
              </OutlinedButton>
            </WordBuySellButtons>
            <AeButton
              :disabled="maxAmount <= 0"
              @click="showInitiate = !showInitiate"
            >
              <IconCheckmarkCircle />
              <span class="desktop">{{ $t('views.WordDetail.Initiate') }}</span>
              <span class="mobile">{{ $t('views.WordDetail.InitiateMobile') }}</span>
            </AeButton>
          </div>
        </div>
        <VoteCard
          v-for="vote in votes"
          :key="vote.id"
          :vote="vote"
          :data="data"
          :contract-address="saleContractAddress"
          :info="tokenInfo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { EventBus } from '../utils/eventBus';
import Backend from '../utils/backend';
import IconCheckmarkCircle from '../assets/iconCheckmarkCircle.svg?icon-component';
import IconPlus from '../assets/iconPlus.svg?icon-component';
import IconTokensBuySell from '../assets/iconTokensBuySell.svg?icon-component';
import WordBuySellButtons from './WordBuySellButtons.vue';
import AeButton from './AeButton.vue';
import AeAmount from './AeAmount.vue';
import FiatValue from './FiatValue.vue';
import VoteCard from './VoteCard.vue';
import MessageInput from './MessageInput.vue';
import OutlinedButton from './OutlinedButton.vue';
import TabBar from './TabBar.vue';
import TabBarButton from './TabBarButton.vue';
import ButtonPlain from './ButtonPlain.vue';
import Loader from './Loader.vue';
import Input from './Input.vue';
import { shiftDecimalPlaces, blockToDate } from '../utils';

export default {
  name: 'WordVoting',
  components: {
    AeButton,
    AeAmount,
    FiatValue,
    IconCheckmarkCircle,
    IconPlus,
    IconTokensBuySell,
    VoteCard,
    MessageInput,
    OutlinedButton,
    TabBar,
    TabBarButton,
    ButtonPlain,
    WordBuySellButtons,
    Loader,
    Input,
  },
  props: {
    data: { type: Object, required: true },
    selectedWord: { type: String, required: true },
    saleContractAddress: { type: String, required: true },
  },
  data() {
    return {
      activeTab: 'ongoing',
      description: '',
      loading: false,
      progressMessage: '',
      newVotePayout: '',
      ongoingVotes: [],
      pastVotes: [],
      myVotes: [],
      showInitiate: false,
    };
  },
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
  async mounted() {
    this.loading = true;
    await this.loadVotes();
    this.loading = false;
    EventBus.$on('reloadData', async (callback) => {
      await this.loadVotes();
      if (callback) callback();
    });
    setInterval(() => this.loadVotes(), 120 * 1000);
  },
  methods: {
    calculateVoteStatus(vote, height) {
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
        initialStakeAmount: stakeAmount,
        dateClose,
        dateTimeout,
      };
    },
    async loadVotes() {
      let votes = await Backend.getWordSaleVotesDetails(this.saleContractAddress);
      await this.$watchUntilTruly(() => this.$store.state.aeternity.sdk);
      const height = await this.$store.dispatch('aeternity/getHeight');
      votes = votes.map((vote) => this.calculateVoteStatus(vote, height));

      this.ongoingVotes = votes.filter((v) => v.statusOngoing);
      this.pastVotes = votes.filter((v) => v.statusPast);
      this.myVotes = votes.filter((v) => v.statusMy);
    },
    async createVote() {
      this.loading = true;
      this.progressMessage = this.$t('views.WordDetail.CreateVote.ProgressMessage[0]');
      try {
        const metadata = {
          subject: { VotePayout: [this.newVotePayout] },
          description: this.description,
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

        this.progressMessage = this.$t('views.WordDetail.CreateVote.ProgressMessage[1]');

        await this.$store.dispatch('aeternity/tokenSaleMethod',
          {
            contractAddress: this.saleContractAddress,
            method: 'add_vote',
            args: [address],
          });
        await Backend.invalidateWordSaleVotesCache(this.saleContractAddress);
        this.description = '';
        this.newVotePayout = '';
        this.showInitiate = false;
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Vote was not created!',
          hideIcon: true,
          primaryButtonText: 'OK',
        });
      } finally {
        EventBus.$emit('reloadData', () => {
          this.loading = false;
          this.progressMessage = '';
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.word-voting {
  ::v-deep .ae-button,
  .outlined-button {
    font-size: 16px;
    line-height: 18px;
    font-weight: 700;
    height: 40px;

    svg {
      height: 24px;
      margin-bottom: 2px;
    }

    .mobile {
      display: none;
    }

    @include desktop {
      .mobile {
        display: inline-block;
      }

      .desktop {
        display: none;
      }
    }
  }

  .initiate-vote {
    margin-bottom: 0.1rem;
    padding: 1.2rem;
    font-size: 15px;
    font-weight: 500;

    &.fade-enter-active,
    &.fade-leave-active {
      transition: 0.5s ease;
      transition-property: transform opacity;
    }

    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
      transform: scaleY(0);
    }

    .message-input {
      margin-bottom: 16px;
    }

    .initiate-vote-inputs {
      display: flex;
      flex-direction: row;
      margin-top: 0.4rem;

      .input {
        flex: 1;
        margin-right: 1.2rem;
        height: 40px;
      }

      .ae-button {
        svg,
        span {
          vertical-align: middle;
        }
      }
    }

    .loading {
      text-align: center;

      img {
        height: 56px;
      }
    }
  }

  ::v-deep .stake-label {
    color: $small_heading_color;
    font-weight: 500;
    font-size: 0.75rem;
    display: inline-block;
    margin-bottom: 0.5rem;
    padding-left: 0.1rem;
  }

  .no-content {
    display: flex;
    flex-direction: column;

    h3 {
      margin-top: 0;
      line-height: 1.2;
      color: $pure_white;
      font-size: 15px;
      font-weight: 500;
    }

    p {
      margin-top: 0;
    }

    .buttons {
      display: flex;
      justify-content: center;
      align-items: center;

      ::v-deep .modal-content {
        @include mobile {
          margin-left: 0;
        }
      }

      button {
        width: 154px;
        height: 40px;

        &.outlined-button {
          margin-right: 32px;

          svg {
            height: 24px;
          }

          @include above-desktop {
            &.wide {
              width: 186px;
            }
          }
        }

        svg,
        span {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
