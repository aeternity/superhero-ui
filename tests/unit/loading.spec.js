import { shallowMount } from '@vue/test-utils';
import Loading from '@/components/Loading.vue';

describe('Loading.vue', () => {
  it('is visible', () => {
    const wrapper = shallowMount(Loading, {
      mocks: {
        $t: () => {},
      },
    });
    expect(wrapper.find('.spinner__container').exists()).toBeTruthy();
  });
});
