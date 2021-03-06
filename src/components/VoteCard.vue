<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div
    class="vote-card"
    :class="{ won: vote.showApplyPayout }"
  >
    <Loader
      v-if="loading"
      :progress-message="progressMessage"
      :message="$t('views.WordDetail.ConfirmMessage')"
    />
    <template v-else>
      <div class="vote-row">
        <div class="vote-row-start" />
        <div class="vote-row-end">
          <IconHourglass />
          <span v-if="!vote.isClosed">{{ $t('components.VoteCard.ClosingIn') }}</span>
          <span v-if="vote.statusPast">{{ $t('components.VoteCard.Closed') }}</span>

          <Timeago
            :datetime="vote.statusTimeouting ? vote.dateTimeout : vote.dateClose"
            auto-update
          />
          <span v-if="vote.statusPast">{{ $t('components.VoteCard.Ago') }}</span>
          <span v-if="vote.statusTimeouting">{{ $t('components.VoteCard.Left') }}</span>
        </div>
      </div>
      <div class="vote-row">
        <Avatar :address="vote.subject.VotePayout[0]" />
        <div class="arrow" />
        <div class="text-box">
          <p>{{ description }}</p>
        </div>
      </div>
      <div class="vote-row">
        <div class="vote-row-start">
          <AeAmount
            :amount="data.spread"
            aettos
          />
          <span v-if="vote.statusTimeouting">{{ $t('components.VoteCard.ReleasedTo') }}</span>
          <span v-if="vote.statusApplied">{{ $t('components.VoteCard.SpreadTo') }}</span>
          <span v-if="!vote.isClosed">{{ $t('components.VoteCard.ToBeReleasedTo') }}</span>
          <span
            v-if="vote.statusTimeouted || vote.statusClosedAndUnsuccessful"
          >{{ $t('components.VoteCard.NotTransferred') }}</span>
          <div class="payout-address">
            {{ vote.subject.VotePayout[0] }}
          </div>
        </div>
        <OutlinedButton
          v-if="vote.showApplyPayout"
          class="vote-row-end green unpadded send"
          @click="applyPayout(vote.id)"
        >
          <IconCheckmarkCircle />
          {{ $t('components.VoteCard.Send') }}
        </OutlinedButton>
      </div>

      <label class="stake-label">
        {{
          vote.showVoteOption && $t('components.VoteCard.Amount')
            || vote.accountHasVoted && $t('components.VoteCard.Staked')
            || $t('components.VoteCard.NotParticipate')
        }}
      </label>

      <div class="input-bar">
        <AeInputAmount
          v-if="vote.showVoteOption || vote.accountHasVoted"
          v-model="stakeAmount"
          :disabled="!vote.showVoteOption || isZero(vote.initialStakeAmount)"
          :token="data.tokenAddress"
          no-dropdown
          no-fiatvalue
        />

        <AeButton
          v-if="vote.showRevoke"
          @click="revokeVote(vote.voteAddress)"
        >
          <IconClose />
          {{ $t('components.VoteCard.Revoke') }}
        </AeButton>

        <AeButton
          v-if="vote.showVoteOption"
          :disabled="isZero(vote.initialStakeAmount) || !stakeAmount || isZero(stakeAmount)"
          @click="voteOption(vote.voteAddress, true, stakeAmount)"
        >
          <IconCheckmarkCircle />
          {{ $t('components.VoteCard.Vote') }}
        </AeButton>

        <AeButton
          v-if="vote.showWithdraw"
          @click="withdraw(vote.voteAddress)"
        >
          <IconClaimBack />
          {{ $t('components.VoteCard.ClaimBack') }}
        </AeButton>

        <div class="vote-progress-bar">
          <div
            class="vote-progress"
            :class="{
              timeouted: vote.statusTimeouted || vote.statusClosedAndUnsuccessful,
              applied: vote.statusApplied,
              ongoing: vote.statusOngoing,
            }"
            :style="{ width: vote.statusOngoing ? `${vote.stakePercent}%` : '100%' }"
          >
            <span v-if="vote.statusOngoing">
              {{ `${vote.stakePercent}%${vote.showApplyPayout ? ' 🎉' : ''}` }}
            </span>
            <span v-if="vote.statusTimeouted">{{ $t('components.VoteCard.TimedOut') }}</span>
            <span v-if="vote.statusClosedAndUnsuccessful">
              {{ $t('components.VoteCard.Unsuccessful') }}
            </span>
            <span v-if="vote.statusApplied">{{ $t('components.VoteCard.Transfered') }}</span>
          </div>
        </div>
      </div>
      <br>
    </template>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { EventBus } from '../utils/eventBus';
import Backend from '../utils/backend';
import { shiftDecimalPlaces } from '../utils';
import IconClaimBack from '../assets/iconClaimBack.svg?icon-component';
import IconClose from '../assets/iconClose.svg?icon-component';
import IconCheckmarkCircle from '../assets/iconCheckmarkCircle.svg?icon-component';
import IconHourglass from '../assets/iconHourglass.svg?icon-component';
import AeInputAmount from './AeInputAmount.vue';
import AeAmount from './AeAmount.vue';
import AeButton from './AeButton.vue';
import Loader from './Loader.vue';
import OutlinedButton from './OutlinedButton.vue';
import Avatar from './Avatar.vue';

export default {
  components: {
    IconClaimBack,
    IconClose,
    IconCheckmarkCircle,
    IconHourglass,
    AeInputAmount,
    AeAmount,
    AeButton,
    Loader,
    OutlinedButton,
    Avatar,
  },
  props: {
    vote: { type: Object, required: true },
    data: { type: Object, required: true },
    info: { type: Object, required: true },
    contractAddress: { type: String, required: true },
  },
  data: () => ({
    loading: false,
    progressMessage: '',
    description: '',
    stakeAmount: '',
  }),
  computed: {
    ...mapState(['tokenInfo']),
  },
  async mounted() {
    this.stakeAmount = this.vote.stakeAmount;
    const metadata = await this.$store.dispatch('aeternity/tokenVotingMethod', {
      contractAddress: this.vote.voteAddress, method: 'metadata',
    });
    this.description = metadata.description;
  },
  methods: {
    isZero(number) {
      return new BigNumber(number).isZero();
    },
    async revokeVote(address) {
      this.loading = true;
      this.progressMessage = this.$t('components.VoteCard.RevokeVote');
      try {
        await this.$store.dispatch('aeternity/tokenVotingMethod', {
          contractAddress: address, method: 'revoke_vote',
        });
        await Backend.invalidateWordSaleVoteStateCache(address);
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Vote revoke failed!',
          primaryButtonText: 'OK',
        });
      } finally {
        EventBus.$emit('reloadData', () => {
          this.loading = false;
          this.progressMessage = '';
        });
      }
    },
    async applyPayout(id) {
      this.loading = true;
      this.progressMessage = this.$t('components.VoteCard.Payout');
      try {
        await this.$store.dispatch('aeternity/tokenSaleMethod',
          {
            contractAddress: this.contractAddress,
            method: 'apply_vote_subject',
            args: [id],
          });
        await Backend.invalidateWordSaleVotesCache(this.contractAddress);
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Payout failed!',
          primaryButtonText: 'OK',
        });
      } finally {
        EventBus.$emit('reloadData', () => {
          this.loading = false;
          this.progressMessage = '';
        });
      }
    },
    async withdraw(address) {
      this.loading = true;
      this.progressMessage = this.$t('components.VoteCard.Withdraw');
      try {
        await this.$store.dispatch('aeternity/tokenVotingMethod', {
          contractAddress: address, method: 'withdraw',
        });
        await Backend.invalidateWordSaleVoteStateCache(address);
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Withdraw failed!',
          primaryButtonText: 'OK',
        });
      } finally {
        EventBus.$emit('reloadData', () => {
          this.loading = false;
          this.progressMessage = '';
        });
      }
    },
    async voteOption(address, option, amount) {
      this.loading = true;
      this.progressMessage = this.$t('components.VoteCard.VoteOption[0]');
      try {
        const shiftedAmount = shiftDecimalPlaces(amount,
          this.tokenInfo[this.data.tokenAddress].decimals).toFixed();

        await this.$store.dispatch('aeternity/createOrChangeAllowance', {
          contractAddress: this.data.tokenAddress,
          amount: shiftedAmount,
          forAccount: address.replace('ct_', 'ak_'),
        });

        this.progressMessage = this.$t('components.VoteCard.VoteOption[1]');
        await this.$store.dispatch('aeternity/tokenVotingMethod', {
          contractAddress: address, method: 'vote', args: [option, shiftedAmount],
        });

        await Backend.invalidateWordSaleVoteStateCache(address);
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Vote failed!',
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
.vote-card {
  box-sizing: border-box;
  box-shadow: 0.1rem 0.2rem 0.4rem rgba($background_color, 0.2);
  border-radius: 0.3rem;
  background-color: $thumbnail_background_color;
  padding: 0.8rem;
  border: 1px solid $thumbnail_background_color;
  margin-bottom: 1.2rem;
  color: $small_heading_color;
  transition: background-color 0.3s;

  .vote-row {
    display: flex;
    margin-bottom: 0.6rem;

    .arrow {
      flex-shrink: 0;
      height: 16px;
      width: 16px;
      background-color: $buttons_background;
      transform: rotate(45deg);
      margin-top: 12px;
      margin-left: 12px;
      margin-right: -8px;
    }

    .text-box {
      flex-grow: 1;
      background-color: $buttons_background;
      display: flex;
      border: 1px solid transparent;
      border-radius: 6px;

      p {
        word-break: break-word;
        padding: 8.5px 16px;
        margin: 0;
        color: $tip_note_color;
        font-weight: 400;
      }
    }

    .vote-row-start {
      flex: 1;
    }

    .vote-row-end {
      font-weight: normal;
      justify-content: end;

      svg {
        height: 16px;
        width: auto;
        vertical-align: middle;
      }

      time {
        color: $tip_note_color;
      }

      &.send {
        font-weight: 700;
        height: 40px;
        width: 100px;
        font-size: 16px;
        line-height: 18px;

        svg {
          height: 20px;
          width: auto;
        }
      }
    }
  }

  .payout-address {
    color: $tip_note_color;
    font-weight: normal;
    font-size: 0.7rem;
    word-break: break-word;
  }

  &:active,
  &:hover {
    background-color: $card_hover_color;
  }

  .vote-progress-bar {
    background-color: $buttons_background;
    width: 100%;
    margin-top: 8px;
    border-radius: 6px;
    overflow: hidden;
    height: 40px;
    font-size: 20px;
  }

  .vote-progress {
    font-weight: normal;
    height: 40px;
    color: $pure_white;
    line-height: 19px;
    font-size: 16px;
    padding-left: 0.7rem;
    vertical-align: middle;

    &.ongoing {
      background-color: rgba($custom_links_color, 0.5);
      font-size: 20px;
      padding: 10px 0;

      span {
        margin-left: 14px;
      }
    }

    &.timeouted {
      width: 100%;
      text-align: center;
      color: $red_color;
      padding: 9px 0;
    }

    &.applied {
      width: 100%;
      text-align: center;
      color: $custom_links_color;
      padding: 9px 0;
    }
  }

  .input-bar {
    margin-top: -0.4rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;

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

    @include mobile {
      height: 100%;
    }
  }

  ::v-deep .ae-button {
    font-weight: bold;
    font-size: 0.8rem;

    svg {
      height: 24px;
      width: auto;
    }

    @include mobile {
      width: 100%;
      margin-left: 0;
      margin-top: 8px;
    }
  }

  &.won {
    border: 1px solid $custom_links_color;
  }
}
</style>
