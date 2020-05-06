import { mount, shallowMount } from '@vue/test-utils';
import AeButton from '../AeButton.vue';

describe('AeButton', () => {
  it('is showing loader, if `loading` props is passed', () => {
    const wrapper = mount(AeButton, {
      propsData: { loading: true },
      mocks: {
        $t: () => 'locale-specific-text',
      },
    });
    expect(wrapper.find('.spinner__container').exists()).toBeTruthy();
  });

  it('is showing img, if `src` props is passed', () => {
    const wrapper = shallowMount(AeButton, {
      propsData: { src: 'test/path' },
    });
    expect(wrapper.find('img').exists()).toBeTruthy();
  });
});
