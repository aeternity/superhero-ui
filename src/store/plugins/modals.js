/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */

const modals = {};
let modalCounter = 0;

export const registerModal = ({ name, ...options }) => {
  if (modals[name]) throw new Error(`Modal with name "${name}" already registered`);
  modals[name] = options;
};

export default (store) => {
  store.registerModule('modals', {
    namespaced: true,
    state: { opened: [] },
    mutations: {
      open(state, modal) {
        state.opened.push(modal);
      },
      closeByKey(state, key) {
        const idx = state.opened.findIndex((modal) => modal.key === key);
        state.opened.splice(idx, 1);
      },
    },
    getters: {
      opened: ({ opened }) => opened
        .map(({ name, ...other }) => ({ ...modals[name], ...other })),
    },
    actions: {
      open({ commit }, { name, allowRedirect, ...props }) {
        if (!modals[name]) return Promise.reject(new Error(`Modal with name "${name}" not registered`));
        const key = modalCounter;
        modalCounter += 1;
        return new Promise(
          (resolve, reject) => commit('open', {
            name, key, allowRedirect, props: { ...props, resolve, reject },
          }),
        )
          .finally(() => commit('closeByKey', key));
      },
    },
  });

  store.watch(
    ({ route }) => route,
    () => store.state.modals.opened
      .filter(({ name, allowRedirect }) => !modals[name].allowRedirect && !allowRedirect)
      .forEach(({ props: { reject } }) => reject(new Error('User navigated outside'))),
  );
};
