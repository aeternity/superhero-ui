import { shallowMount } from '@vue/test-utils';
import Loading from '@/components/Loading.vue';

describe('Loading', () => {
  it('is visible', () => {
    const wrapper = shallowMount(Loading, {
      mocks: {
        $t: () => 'locale-specific-text',
      },
    });
    expect(wrapper.find('.spinner__container').exists()).toBeTruthy();
  });
});
