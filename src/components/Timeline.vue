<template>
  <v-container>
    <v-timeline dense clipped style="margin-left: -30px;">
      <v-timeline-item hide-dot></v-timeline-item>
      <v-timeline-item
        id="addNewButton"
        class="mb-3"
        fill-dot
        color="primary"
        :icon="!loadTimeline ? 'mdi-cloud' : 'mdi-cloud-download'"
      >
        <v-btn depressed color="primary" :to="{ name: 'Create'}">
          <v-icon left>mdi-plus</v-icon>
          New
        </v-btn>
      </v-timeline-item>

      <v-slide-x-reverse-transition
        group
      >
        <v-timeline-item
          transition="scroll-y-transition"
          :id="'hash' + item.data.txnHash"
          :ref="'hash' + item.data.txnHash"
          v-for="(item, i) in items"
          :key="i"
          :color="item.data.status == 'DEPLOYED' ? item.color : 'grey'"
          :icon="item.data.status == 'DEPLOYED' ? 'mdi-check' : 'mdi-help'"
          fill-dot
          v-show="!(item.data.status == 'ERRORED' && hideErrored)"
        >
          <v-row>
            <div class="flex-grow-1"></div>
            <div class="mr-4">
              <small>
                {{(new Date(item.data.timestamp)).toLocaleString()}}
              </small>
            </div>
          </v-row>
          <v-alert
            :value="true"
            :color="item.data.status == 'DEPLOYED' ? item.color : 'grey'"
            :icon="item.data.status == 'ERRORED' ? 'mdi-emoticon-dead-outline' : item.icon"
            class="white--text break-all"
            :id="'selected' + item.data.txnHash"
          >
            <h3 style="margin-top: -4px;">
              <strong>
                <span v-if="item.data.method">
                  {{item.data.method}}
                </span>
                <span v-else>
                  <v-icon left>mdi-buffer</v-icon> Contract Created
                </span>
              </strong>
            </h3>
            <div class="mb-2">
              <small>Txn Hash: {{item.data.status == 'ERRORED' ? "Errored" : item.data.txnHash}}</small>
            </div>
            
            <div style="margin-left: -15px;">
              <div v-for="(input,key,index) in item.data.inputs" :key="index">
                <small>
                  <span>{{key}}</span>:
                  <span v-if="(new RegExp(/DATE/ig)).test(key) || (new RegExp(/LIFE/ig)).test(key)">
                    <span v-if="(new Date(parseInt(input))).toLocaleDateString() != 'Invalid Date'">
                      {{(new Date(parseInt(input))).toLocaleDateString()}} 
                      <span class="black--text">
                        (<span v-if="parseInt(input) - new Date().getTime() >= 0">
                        due in {{Math.round((parseInt(input) - new Date().getTime()) / (1000 * 3600 * 24))}} days
                        </span>
                        <span v-else>
                          {{Math.round((parseInt(input) - new Date().getTime()) / (-1000 * 3600 * 24))}} days passed
                        </span>)
                      </span>
                    </span>
                    <span v-else>
                      {{input}}
                    </span>
                  </span>
                  <span v-else-if="(new RegExp(/TRANSACTION/ig)).test(key)" >
                    <a @click="scrollIntoView(input)"><span class="no-decor white--text">{{input}}</span><span class="black--text"> <v-icon small style="margin-top:-4px;">mdi-file-find</v-icon></span></a>
                  </span>
                  <span v-else>
                    {{input}}
                  </span>
                </small>
              </div>
            </div>
          </v-alert>

        </v-timeline-item>
      </v-slide-x-reverse-transition>
    </v-timeline>

    <v-btn
      color="primary"
      dark
      fixed
      bottom
      right
      fab
      small
      @click="scrollToTop()"
    >
      <v-icon>mdi-arrow-up-bold</v-icon>
    </v-btn>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

  </v-container>
</template>

<script>
import * as libsimba from '@simbachain/libsimba-js'

  export default {
    data: () => ({
      model: null,
      overlay: true,
      loadTimeline: false,
      polling: null,
      hideErrored: false,

      items: [],
      colors: {
        createProduct: 'lime darken-2',
        createPlatform: 'orange darken-1',
        createProductPlatform: 'purple',
        addMaintenanceWindow: 'teal',
        updateProductPlatformDetails: 'red'
      },
      icons: {
        createProduct: 'mdi-tools',
        createPlatform: 'mdi-ferry',
        createProductPlatform: 'mdi-airplane',
        addMaintenanceWindow: 'mdi-dock-window',
        updateProductPlatformDetails: 'mdi-calendar-text'
      }
    }),
    mounted () {
      this.getTimelines()
    },
    beforeDestroy () {
      clearInterval(this.polling)
    },
    created () {
      this.pollData()
    },
    methods: {
      pollData () {
        this.polling = setInterval(() => {
          this.getTimelines()
        }, 5000)
      },
      scrollToTop() {
        document.getElementById('addNewButton').scrollIntoView({ behavior: 'smooth', block: 'center'})
      },
      scrollIntoView(id) {
        let element = document.getElementById('hash' + id)
        if (element == null) {
          return 
        }
        element.scrollIntoView({ behavior: 'smooth', block: 'center'})
        let selected = document.getElementById('selected' + id)
        selected.classList.add("selected")
        setTimeout(() => {
          selected.classList.remove('selected')
        }, 2000)
      },
      getTimelines () {
        this.loadTimeline = true
        let self = this

        ;(async () => {
          let simba = await libsimba.getSimbaInstance(
            'yourApiUrl',
            null,
            'yourApiKey');

          let response = await simba.getTransactions({})
            .then(async (ret) => {
              return ret.data()
            })
            .catch((error) => {
              self.overlay = false
              self.loadTimeline = false
              console.error(`Failure!  ${JSON.stringify(error)}`)
            });

          self.items = []

          response.forEach(function(txn) {
            self.items.push({
              color: self.colors[txn.payload.method],
              icon: self.icons[txn.payload.method],
              data: {
                status: txn.status,
                txnHash: txn.transaction_hash,
                timestamp: txn.timestamp,
                method: txn.payload.method,
                inputs: txn.payload.inputs
              }
            })
          })
          self.overlay = false
          self.loadTimeline = false
        })();
      }
    }
  }
</script>

<style>
.break-all {
  word-break: break-all; 
}
.no-decor {
  text-decoration: none;
}
.selected {
  box-shadow: #FFF 0px 0px 8px, #FFF 0px 0px 16px, #FFF 0px 0px 24px;
}
</style>