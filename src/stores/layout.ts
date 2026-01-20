
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
        isShowProfileEditModal: false,
        isShowPageLoading: false
    }
  },
  actions: {
    setPageLoading(loading: boolean) {
      this.isShowPageLoading = loading
    }
  },
})
