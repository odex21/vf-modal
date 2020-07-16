import { createVfModal, } from '/vf-modal/index'
import { ApiError } from './modals/ApiError'
import NetError from './modals/NetError.vue'
import '/vf-modal/index.css'

import { provideStore } from './modalShare'

const { VfModal, Controller } = createVfModal({
  modals: {
    test: {
      component: NetError
    },
    api: {
      component: ApiError
    }
  },
  provide: provideStore,
})


export {
  VfModal as ModalTest,
  Controller
}

