<template>
  <div>
    <div v-if="!isLogged">
      <div class="video-background">
        <div class="video-foreground">
          <iframe src="https://www.youtube.com/embed/Zj4aha6EsnY?controls=0&showinfo=0&rel=0&autoplay=1&mute=1&loop=1&playlist=qghQ5eKGcyE" frameborder="0" allowfullscreen>
          </iframe>
        </div>
      </div>

      <div class="empty-div">
      </div>
      <md-card md-with-hover class="login-card unselectable">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">WY Vote - Admin</div>
            <br>
            <div class="md-subhead" v-if="!loginWarn">Please select an option & Login below!</div>
            <div class="md-subhead" v-if="loginWarn">
              <strong style="color:#f44336;">Please select an option & Login!</strong>
            </div>
          </md-card-header-text>
          <md-card-media md-medium>
            <img class="unselectable rotate-image" src="./assets/img/sun.png" alt="icon">
          </md-card-media>
        </md-card-header>

        <md-card-content>
          <div class="md-layout-item md-size-100">
            <strong style="color:#fff176;">Election Official</strong>
          </div>
          <md-radio v-model="role" value="eo1">
            <md-avatar class="role-icon">
              <img :src="getImgUrl('eo1')" alt="EO">
            </md-avatar>
            {{eo1.name}}
          </md-radio>
          <div class="md-layout-item md-size-100">
            <strong style="color:#fff176;">Candidates</strong>
          </div>
          <md-radio v-model="role" value="c1">
            <md-avatar class="role-icon">
              <img :src="getImgUrl('c1')" alt="C">
            </md-avatar>
            {{c1.name}}
          </md-radio>
          <md-radio v-model="role" value="c2">
            <md-avatar class="role-icon">
              <img :src="getImgUrl('c2')" alt="C">
            </md-avatar>
            {{c2.name}}
          </md-radio>
          <md-radio v-model="role" value="c3">
            <md-avatar class="role-icon">
              <img :src="getImgUrl('c1')" alt="C">
            </md-avatar>
            {{c3.name}}
          </md-radio>
          <md-radio v-model="role" value="c4">
            <md-avatar class="role-icon">
              <img :src="getImgUrl('c2')" alt="C">
            </md-avatar>
            {{c4.name}}
          </md-radio>
        </md-card-content>
        <md-card-actions>
          <router-link to="home">
            <md-button @click="login()">Login</md-button>
          </router-link>
        </md-card-actions>
      </md-card>
      <div class="empty-div">
      </div>
    </div>

    <div v-if="isLogged" class="page-container unselectable">
      <md-app>
        <md-app-toolbar class="md-primary">
          <md-button class="md-icon-button" @click="menuVisible = true" v-if="!menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
          <router-link to="home">
            <span class="md-title unselectable car" @click="menuVisible = false">
              <md-icon v-if="menuVisible" class="rotate-image">wb_sunny</md-icon>
                Welcome to Admin portal for WY Vote!
              </span>
            </router-link>
        </md-app-toolbar>

        <md-app-drawer :md-active.sync="menuVisible" md-persistent="full" >

          <md-dialog class="wallet" :md-click-outside-to-close=false :md-active.sync="isInfo">
            <md-toolbar class="md-accent md-dense">
              <h3 class="md-title" style="flex: 1">My Information</h3>
                <md-button class="md-icon-button"  @click="isInfo = false">
                  <md-icon>close</md-icon>
                </md-button>
            </md-toolbar>

            <div class="wallet-content">
              <div class="md-subheading">
                Name: {{currentUser.name}}
              </div>
              <div class="md-subheading">
                Role: {{currentUser.title}}
              </div>
              <br>

              <div class="md-layout-item md-size-90">
                <md-field>
                  <label>ID (Account Address)</label>
                  <md-textarea md-autogrow v-model="accountAddress" readonly></md-textarea>
                </md-field>
              </div>

              <div v-if="isRevealed">
                <div class="md-layout-item md-size-90">
                  <md-field>
                    <label>Private Key</label>
                    <md-textarea md-autogrow v-model="accountPk" readonly></md-textarea>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-90">
                  <md-field>
                    <label>Seed</label>
                    <md-textarea md-autogrow v-model="accountSeed" readonly></md-textarea>
                  </md-field>
                </div>
              </div>

              <md-dialog-actions v-if="!isRevealed" class="md-layout md-alignment-center-right">
                <md-button class="md-accent md-raised" @click="isRevealed = true">Details</md-button>
              </md-dialog-actions>
            </div>
          </md-dialog>

          <md-toolbar class="md-transparent" md-elevation="0">

            <md-menu md-align-trigger md-size="small">
              <md-button class="md-icon-button nav-role md-fab md-plain" md-menu-trigger>
                <md-avatar class="md-avatar-icon md-large">
                  <md-ripple>
                    <img :src="getImgUrl()" alt="P">
                  </md-ripple>
                </md-avatar>
              </md-button>

              <md-menu-content>
                <md-menu-item  @click="showInfo()">
                  <md-icon>account_box</md-icon>
                  <span>My Info</span>
                </md-menu-item>

                <md-menu-item @click="logout()">
                  <md-icon>exit_to_app</md-icon>
                  <span>Logout</span>
                </md-menu-item>

              </md-menu-content>
            </md-menu>

            <strong class="nav-name">
              Hi, {{currentUser.name}}
            </strong>

            <div class="md-toolbar-section-end">
              <md-button class="md-icon-button md-dense close-nav" @click="menuVisible = false">
                <md-icon>keyboard_arrow_left</md-icon>
              </md-button>
            </div>
          </md-toolbar>

          <md-list>
            <br>
            <router-link to="MyPanel">
              <md-list-item @click="menuVisible = false">
                <md-icon>dashboard</md-icon>
                <span class="md-list-item-text">My Panel</span>
              </md-list-item>
            </router-link>
            <md-divider></md-divider>
          <md-list-item href="https://simbachain.com/contact/" target="_blank" @click="menuVisible = false">
              <md-icon>contact_support</md-icon>
              <span class="md-list-item-text">Contact Us</span>
            </md-list-item>

          </md-list>
        </md-app-drawer>

        <md-app-content class="bg-color">
          <router-view class="conent">
          </router-view>
        </md-app-content>
      </md-app>

    </div>
  </div>
</template>

<style lang="scss" scoped>
  .bg-color {
    background-color: black;
  }
  .rotate-image {
    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;
  }
  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

  .login-card {
    max-width: 350px;
    margin: 0 auto;
  }
  .empty-div {
    height: 100px;
  }
  .role-icon {
    margin-top: -10px;
    margin-left: -10px;
    margin-right: 5px;
  }
  .nav-role {
    margin-top: 10px;
  }
  .nav-name {
    margin-left: 15px;
    margin-top: 50px;
  }
  .close-nav {
    margin-top: -10px;
  }
  .title {
    margin-left: 18px;
  }
  .zoom {
    color: #e25555;
    transition: transform .2s;
    margin-left:2px;
    margin-right:2px;
  }
  .zoom:hover {
    transform: scale(1.3);
  }
  .love {
    position: fixed;
    bottom: 20px;
    margin-left: 20px;
  }
  .avatar {
    margin-top:20px;
    margin-left:-60px;
  }
  .tool-bar {
    z-index: 100;
  }
  .md-app {
    height: 100vh;
  }
  .unselectable {
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
  .video-background {
    background: #000;
    position: fixed;
    top: 0; right: 0; bottom: 0; left: 0;
    z-index: 1;
  }
  .video-foreground,
  .video-background iframe {
    position: absolute;
    margin-top: -30px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: 2000px;
    min-height: 1125px;
    pointer-events: none;
  }

  @media all and (max-width: 600px) {
  .vid-info { width: 50%; padding: .5rem; }
  .vid-info h1 { margin-bottom: .2rem; }
  }
  @media all and (max-width: 500px) {
  .vid-info .acronym { display: none; }
  }
  .wallet {
    min-width: 320px;
  }
  .wallet-content {
    margin: 20px;
  }

</style>

<script>
import { localstorage } from './components/mixins/localstorage'
import ethers from 'ethers'

export default {
  name: 'App',
  mixins: [localstorage],
  data: () => ({
    isLogged: false,
    role: null,
    loginWarn: null,
    menuVisible: false,

    accountAddress: null,
    accountPk: null,
    accountSeed: null,

    isRevealed: false,
    isInfo: false,

    currentUser: {
      name: null,
      title: null,
      code: null,
      key: null,
      imgSrc: null
    },
    eo1: {
      name: 'Wyoming State Officer 1',
      title: 'Election Official',
      code: 'eo1',
      key: 'dwarf coyote unfold oxygen promote potato rate friend place dignity ribbon render',
      imgSrc: './assets/img/eo1.png'},
    c1: {
      name: 'Republican - Trump & Pence',
      title: 'Candidate',
      code: 'c1',
      key: 'impose state body frost drink cancel vacant annual vague green museum plug',
      imgSrc: './assets/img/c1.png'},
    c2: {
      name: 'Democratic - Biden & Harris',
      title: 'Candidate',
      code: 'c2',
      key: 'figure upset scare vicious horn among now wrap dad nominee plastic lunar',
      imgSrc: './assets/img/c2.png'},
    c3: {
      name: 'Libertarian - Jorgensen & Cohen',
      title: 'Candidate',
      code: 'c3',
      key: 'this forever upset scare vicious horn among now wrap dad major session',
      imgSrc: './assets/img/c2.png'},
    c4: {
      name: 'Independent - Pierce & Ballard',
      title: 'Candidate',
      code: 'c4',
      key: 'war fort six from among now wrap mom civil states battle ticket former',
      imgSrc: './assets/img/c2.png'}
  }),
  methods: {
    login () {
      if (this.role == null) {
        this.loginWarn = true
        return
      }
      let role = this.role
      this.checkUser(role)
    },
    getImgUrl (role) {
      if (role == null) {
        return require(`${this.currentUser.imgSrc}`)
      }
      return require(`${this[role].imgSrc}`)
    },
    checkUser (role) {
      this.isLogged = true
      this.currentUser.name = this[role].name
      this.currentUser.title = this[role].title
      this.currentUser.code = this[role].code
      this.currentUser.key = this[role].key
      this.currentUser.imgSrc = this[role].imgSrc
      this.setUser(this.currentUser)
    },
    logout () {
      this.menuVisible = false
      this.isLogged = false
      this.role = null
      this.currentUser.name = null
      this.currentUser.title = null
      this.currentUser.code = null
      this.currentUser.key = null
      this.currentUser.imgSrc = null
      this.clean()
    },
    showInfo () {
      this.isRevealed = false
      this.menuVisible = false
      this.isInfo = true
      this.setInfo()
    },
    setInfo () {
      let mnemonic = this.getUser().key
      let wallet = ethers.Wallet.fromMnemonic(mnemonic)
      this.accountAddress = wallet.address
      this.accountPk = wallet.privateKey
      this.accountSeed = mnemonic
    }
  },
  mounted () {
    if (!localStorage.getItem('currentUser')) {
      this.isLogged = false
      return
    }
    this.role = this.getUser().code
    this.checkUser(this.role)
  }
}
</script>
