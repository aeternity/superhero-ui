import { registerModal } from '../store/plugins/modals';
import SuccessModal from '../components/SuccessModal.vue';

export default () => {
  registerModal({ name: 'success', component: SuccessModal });
};
