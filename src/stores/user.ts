import { defineStore } from 'pinia'
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import { type UserInfo,getUserInfoByAddressByMs } from '@/api/metafs'
import { useConnectionStore } from '@/stores/connection'
import { toast } from '@/utils/toast'
import { useLayoutStore } from './layout'


export const useUserStore = defineStore('user', {
  state: () => {
    return {
      last: useLocalStorage('user-info', {
        address:'',
        avatar: '',
        avatarPinId: '',
        blockHeight: '',
        timestamp: 0,
        chainName: '',
        namePinId: '',
        metaId: '',
        globalMetaId:"",
        name: '',
        nameId: '',
        chatpubkey:'',
        chatPublicKeyPinId:''

        // address: '',
        // avatar: '',
        // avatarId: '',
        // background: '',
        // bio: '',
        // bioId: '',
        // blocked: false,
        // chainName: 'mvc',
        // fdv: 0,
        // followCount: 0,
        // isInit: false,
        // metaid: '',
        // name: '',
        // nameId: '',
        // nftAvatar: '',
        // nftAvatarId: '',
        // number: 0,
        // pdv: 0,
        // pinId: '',
        // soulbondToken: '',
        // unconfirmed: '',
        // chatpubkey:''
      } as UserInfo) as RemovableRef<UserInfo>,
    }
  },

  getters: {
    has: (state) => !!state.last,
    isAuthorized: (state) => {
      
      const connectedStore = useConnectionStore()
      
      return   !!(state.last.address && state.last.metaId && connectedStore.last.status == 'connected')
    },

  },

   actions: {
      async updateUserInfo(userInfo:Partial<UserInfo>){
        
        this.last={...this.last,...userInfo}
      },

      async setUserInfo(address: string) {
        
      const user: UserInfo = this.last
        ? (JSON.parse(JSON.stringify(this.last)) as UserInfo)
        : {
        address:'',
        avatar: '',
        avatarPinId: '',
        blockHeight: '',
        timestamp: 0,
        chainName: '',
        namePinId: '',
        metaId: '',
        globalMetaId:"",
        name: '',
        nameId: '',
        chatpubkey:'',
        chatPublicKeyPinId:''
            // address: '',
            // avatar: '',
            // avatarId: '',
            // background: '',
            // bio: '',
            // bioId: '',
            // blocked: false,
            // chatpubkey:'',
            // chainName: 'mvc',
            // fdv: 0,
            // followCount: 0,
            // isInit: false,
            // metaid: '',
            // name: '',
            // nameId: '',
            // nftAvatar: '',
            // nftAvatarId: '',
            // number: 0,
            // pdv: 0,
            // pinId: '',
            // soulbondToken: '',
            // unconfirmed: '',
          }

      if (!address) {
        return user
      }

      const userRes = await getUserInfoByAddressByMs(address)
      
      try {
        if (userRes) {
          this.last = userRes
          
          if (!this.last.name) {
            console.log(this.last, 'this.last')
            const layoutStore =useLayoutStore()
            layoutStore.isShowProfileEditModal = true
          }
          return this.last
        }
      } catch (e: any) {
        toast.error(e.message)
      }

      return this.last
    },

    clearUserInfo() {
      if (!this.last) return
      
      this.last = {
           address:'',
        avatar: '',
        avatarPinId: '',
        blockHeight: '',
        timestamp: 0,
        chainName: '',
        namePinId: '',
        metaId: '',
        globalMetaId:"",
        name: '',
        nameId: '',
        chatpubkey:'',
        chatPublicKeyPinId:''

        


        // address: '',
        // avatar: '',
        // avatarId: '',
        // background: '',
        // bio: '',
        // bioId: '',
        // blocked: false,
        // chainName: 'mvc',
        // fdv: 0,
        // followCount: 0,
        // isInit: false,
        // metaid: '',
        // name: '',
        // nameId: '',
        // nftAvatar: '',
        // nftAvatarId: '',
        // number: 0,
        // pdv: 0,
        // pinId: '',
        // soulbondToken: '',
        // unconfirmed: '',
        // chatpubkey: ''
      }
    }
   
  }
})