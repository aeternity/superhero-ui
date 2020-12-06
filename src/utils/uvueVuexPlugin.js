import { Store } from 'vuex';

export default {
  beforeCreate(context, _, vueOptions) {
    if (!vueOptions.store || !(vueOptions.store instanceof Store)) {
      throw new Error('UVue Vuex plugin installed but no store found!');
    }
    // eslint-disable-next-line no-param-reassign
    context.store = vueOptions.store;
  },

  sendSSRData(context) {
    const { store, ssr, isServer } = context;
    if (!isServer) return;
    // Inject store data in __DATA__ on server side
    ssr.data.state = store.state;
  },
};
