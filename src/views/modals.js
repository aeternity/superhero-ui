import { merge } from 'lodash-es';
import { registerModal } from '../store/plugins/modals';
import AlertModal from '../components/AlertModal.vue';
import ImageGallery from '../components/ImageGallery.vue';
import UserPopup from '../components/UserPopup.vue';
import FeedItemMenu from '../components/FeedItemMenu.vue';

export default () => {
  registerModal({ name: 'success', component: AlertModal });
  registerModal({
    name: 'failure',
    component: {
      functional: true,
      render: (h, context) => h(AlertModal, merge({}, context, { props: { failure: true } })),
    },
  });
  registerModal({
    name: 'image-gallery',
    component: ImageGallery,
  });
  registerModal({
    name: 'user-popup',
    component: UserPopup,
  });
  registerModal({
    name: 'feed-item-menu',
    component: FeedItemMenu,
  });
};
