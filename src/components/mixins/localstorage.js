import SecureLS from 'secure-ls'

export const localstorage = {
  methods: {
    setUser (user) {
      let ls = new SecureLS({
        encodingType: 'aes',
        isCompression: true
      })
      ls.set('currentUser', {data: user})
    },
    getUser () {
      let ls = new SecureLS({
        encodingType: 'aes',
        isCompression: true
      })
      return ls.get('currentUser').data
    },
    clean () {
      let ls = new SecureLS({})
      ls.removeAll()
    }
  }
}
