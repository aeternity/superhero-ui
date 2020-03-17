import { shallowMount } from '@vue/test-utils';
import Loading from '@/components/Loading.vue';

describe('Loading.vue', () => {
  it('have active class when showLoading is true', () => {
    const wrapper = shallowMount(Loading, {
      propsData: { showLoading: true },
    });
    expect(wrapper.element.className).toContain('active');
  });
});
