import { mount } from '@vue/test-utils';
import AeButton from '../AeButton.vue';

describe('AeButton', () => {
  it('is showing loader, if `loading` props is passed', () => {
    const wrapper = mount(AeButton, {
      propsData: { loading: true },
      mocks: {
        $t: () => 'locale-specific-text',
      },
    });
    expect(wrapper.find('.spinner').exists()).toBeTruthy();
  });
});
