import { mount } from '@vue/test-utils';
import AeAmount from '../AeAmount.vue';

describe('AeAmount', () => {
  [{
    name: 'rounds to 0',
    amount: '100.123123123123',
    round: 0,
    roundedAmount: '100',
  },
  {
    name: 'rounds to 7',
    amount: '100.123123123123',
    round: 7,
    roundedAmount: '100.1231231',
  },
  {
    name: 'rounds to large',
    amount: '100.009',
    round: 2,
    roundedAmount: '100.01',
  },
  {
    name: 'does not break if amount is empty',
    amount: '',
    round: 5,
    roundedAmount: '0',
  },
  ].forEach((test) => it(test.name, () => {
    const wrapper = mount(AeAmount, {
      propsData: {
        amount: test.amount,
        round: test.round,
      },
    });
    expect(wrapper.find('.ae-amount > span:first-child').element.textContent).toBe(test.roundedAmount);
  }));
});
