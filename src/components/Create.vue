<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark top fixed color="primary">
          <v-btn icon dark @click="goBack()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>New Transaction</v-toolbar-title>
          <div class="flex-grow-1"></div>

          <v-toolbar-items>
            <v-btn dark text :disabled="!valid || !address" @click="getFormByTab()">Post</v-btn>
          </v-toolbar-items>
          <template v-slot:extension>
            <v-tabs
              v-model="tab"
              show-arrows
            >
              <v-tabs-slider :color="tabMenuColor[tab]"></v-tabs-slider>
              <v-tab v-for="(item, index) in items" :key="item.value">
                <v-icon :color="index == tab ? tabMenuColor[index]: 'white'" left>{{ item.icon }}</v-icon>
                <small style="color: white;">{{ item.text }}</small>
              </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>

        <v-card     
          class="mx-auto"
          dark>
          <v-card-title>
            <v-btn
              @click="show = !show"
              text
              v-if="walletProgress == 100"
            >
              <v-icon left>mdi-wallet</v-icon> 
              <div>Wallet</div>
              <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            <div v-else> 
              <v-btn text disabled>
                <v-progress-circular
                  :value="walletProgress"
                  color="light-blue"
                  width="2"
                  size="24"
                  class="mr-2"
                >
                  <small><small> {{ walletProgress }}</small></small>
                </v-progress-circular>
                <small> {{walletStatus}} Wallet</small>
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <div>Network: {{simba ? simba.metadata.network : 'Checking...'}}</div>
            <div>Address: {{address ? address : 'Checking...'}}</div>
          </v-card-text>

          <v-expand-transition>
            <div v-show="show" class="mx-4 mb-2">
              <small>
                <div>Seed: <strong>{{seed}}</strong></div>
              </small>
            </div>
          </v-expand-transition>
          <v-divider></v-divider>
        </v-card>

        <v-progress-linear
          indeterminate
          color="white"
          v-if="createProductLoading || createPlatformLoading || createProductPlatformLoading"
        ></v-progress-linear>

        <v-tabs-items  
          v-model="tab">
          <v-tab-item
            v-for="item in items"
            :key="item.value"
          >
            <v-card flat>
              <v-card-text>
                <v-subheader>{{item.text}} Information</v-subheader>

                <v-form 
                  ref="form" 
                  v-model="valid" 
                >

                <v-container fluid>
                  <v-layout row>
                    <v-flex v-for="(param, index) in item.field" :key="index" mx-5 xs12 sm5 md-4 lg3 xl2 d-flex>
                      <v-text-field
                        v-if="param.type == 'text'"
                        prepend-icon="mdi-file-document-edit-outline"
                        v-model="param.value"
                        :label="param.name"
                        :color="tabMenuColor[tab]"
                        required
                        :rules="rules"
                      ></v-text-field>

                      <v-menu
                        v-if="param.type == 'date'"
                        v-model="param.menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        :color="tabMenuColor[tab]"
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="param.value"
                            :label="param.name"
                            :prepend-icon="param.disabled ? 'mdi-calendar' : 'mdi-calendar-edit'"
                            readonly
                            :color="tabMenuColor[tab]"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="param.value" :disabled="param.disabled" no-title @input="param.menu = false"></v-date-picker>
                      </v-menu>

                      <v-select
                        v-if="param.type == 'select'"
                        :prepend-icon="txnData[param.method].length ? 'mdi-pound' : 'mdi-cloud-question'"
                        :disabled="!txnData[param.method].length"
                        :items="txnData[param.method]"
                        :label="param.name"
                        :color="tabMenuColor[tab]"
                        v-model="param.value"
                        required
                        :rules="rules"
                      >
                      </v-select>
  
                      <v-switch 
                        v-if="param.type == 'boolean'"
                        :label="param.name" 
                        :color="tabMenuColor[tab]"
                        v-model="param.value">
                      </v-switch>

                    </v-flex>
                  </v-layout>
                </v-container>  

                </v-form>      
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
        
      </v-card>

    <v-overlay :value="postingTxn" color="black" opacity="0.8">
      <h1>
        <v-progress-circular class="mr-2 mb-2" indeterminate size="32"></v-progress-circular>
        Posting Transaction...
      </h1>
    </v-overlay>

    </v-dialog>
  </v-row>
</template>

<script>
import * as libsimba from '@simbachain/libsimba-js'

export default {
  data () {
    return {
      dialog: false,
      show: false,
      tab: null,
      createProductLoading: false,
      createPlatformLoading: false,
      createProductPlatformLoading: false,
      wallet: null,
      address: null,
      seed: null,
      walletProgress: 0,
      walletStatus: 'Checking ',
      simba: null,
      postingTxn: false,
      valid: false,

      rules: [
        v => !!v || 'Field is required',
      ],

      txnData: {
        createProduct: [],
        createPlatform: [],
        createProductPlatform: []
      },

      tabMenuColor: [
        'lime darken-2',
        'orange darken-1',
        'purple',
        'teal',
        'red'
      ],

      tabMethod: [ 
        'createProduct',
        'createPlatform',
        'createProductPlatform',
        'addMaintenanceWindow',
        'updateProductPlatformDetails'
      ],

      items: [{ 
        text:'Create Product', 
        value: 'createProduct', 
        icon: 'mdi-tools',
        field: {
          altName: {
            name: 'Alt Name',
            value: '',
            type: 'text',
            disabled: false
          },
          typeName: {
            name: 'Type Name',
            value: '',
            type: 'text',
            disabled: false
          },
          numberId: {
            name: 'Number ID',
            value: '',
            type: 'text',
            disabled: false
          },
          assetId: {
            name: 'Asset ID',
            value: '',
            type: 'text',
            disabled: false
          },
        }
      }, {
        text: 'Create Platform', 
        value: 'createPlatform', 
        icon: 'mdi-ferry',
        field: {
          beginLife: {
            name: 'Begin Life',
            value: new Date().toISOString().substr(0, 10),
            type: 'date',
            disabled: false,
            menu: false
          },
          endLife: {
            name: 'End Life',
            value: new Date().toISOString().substr(0, 10),
            type: 'date',
            disabled: false,
            menu: false
          },
          code: {
            name: 'Code',
            value: '',
            type: 'text',
            disabled: false
          },
          name: {
            name: 'Name',
            value: '',
            type: 'text',
            disabled: false
          },
          typeName: {
            name: 'Type Name',
            value: '',
            type: 'text',
            disabled: false              
          },
          notes: {
            name: 'Notes',
            value: '',
            type: 'text',
            disabled: false  
          },
          assetId: {
            name: 'Asset ID',
            value: '',
            type: 'text',
            disabled: false  
          },
        }
      }, {
        text: 'Create Product Platform', 
        value: 'createProductPlatform', 
        icon: 'mdi-airplane',
        field: {
          productTransactionId: {
            name: 'Product Transaction ID',
            value: '',
            type: 'select',
            method: 'createProduct',
            disabled: false
          },
          platformTransactionId: {
            name: 'Platform Transaction ID',
            value: '',
            type: 'select',
            method: 'createPlatform',
            disabled: false
          },
          assetId: {
            name: 'Asset ID',
            value: '',
            type: 'text',
            disabled: false
          },
        }
      }, {
        text: 'Add Maintenance Window', 
        value: 'addMaintenanceWindow', 
        icon: 'mdi-dock-window',
        field: {
          platformTransactionId: {
            name: 'Platform Transaction ID',
            value: '',
            type: 'select',
            method: 'createPlatform',
            disabled: false
          },
          beginDate: {
            name: 'Begin Date',
            value: new Date().toISOString().substr(0, 10),
            type: 'date',
            disabled: false,
            menu: false
          },
          endDate: {
            name: 'End Date',
            value: new Date().toISOString().substr(0, 10),
            type: 'date',
            disabled: false,
            menu: false
          },
          typeName: {
            name: 'Type Name',
            value: '',
            type: 'text',
            disabled: false
          },          
          assetId: {
            name: 'Asset ID',
            value: '',
            type: 'text',
            disabled: false
          },
        }
      }, {
        text: 'Update Product Platform Details',
        value: 'updateProductPlatformDetails', 
        icon: 'mdi-calendar-text',
        field: {
          productPlatformTransactionId: {
            name: 'Product Platform Transaction ID',
            value: '',
            type: 'select',
            method: 'createProductPlatform',
            disabled: false
          },
          startDate: {
            name: 'Start Date',
            value: new Date().toISOString().substr(0, 10),
            type: 'date',
            disabled: false,
            menu: false
          },
          endDate: {
            name: 'End Date',
            value: new Date().toISOString().substr(0, 10),
            type: 'date',
            disabled: false,
            menu: false
          },
          user: {
            name: 'User',
            value: '',
            type: 'text',
            disabled: false
          },    
          status: {
            name: 'Status',
            value: '',
            type: 'text',
            disabled: false
          },
          assetId: {
            name: 'Asset ID',
            value: '',
            type: 'text',
            disabled: false
          },
          dateAdded: {
            name: 'Date Added',
            value: new Date().toISOString().substr(0, 10),
            type: 'date',
            disabled: true,
            menu: false
          },
          funded: {
            name: 'Funded',
            value: false,
            type: 'boolean',
            disabled: false
          }   
        }
      }] 
    }
  },
  mounted () {
    this.initAll()
    this.initWallet()
    setTimeout(() => {
      this.dialog = true
    }, 1)
  },
  watch: {
    dialog: {
      handler(){
        if(!this.dialog) {
          setTimeout(() => {
            this.$router.push({ name: 'Timeline' })
          }, 200)
        }
      }
    }
  },
  methods: {
    initWallet(simba) {
      let wallet = new libsimba.LocalWallet(
        () => {
          return Promise.resolve(true)
        }
      );
      this.wallet = wallet

      if (wallet.walletExists()) {
        this.walletStatus = 'Unlocking '
        let lastProgress = 0;

        (async () => {
          await wallet.unlockWallet(
            'password',
            (progress) => {
              if (Math.floor(progress * 10) > lastProgress) {
                lastProgress = progress * 10;
                this.walletProgress = Math.floor(progress*100)
              }
            }
          );
          this.simba.setWallet(this.wallet)
          this.address = await wallet.getAddress();
          this.seed = await wallet.getMnemonic();
        })();
        return
      } 

      this.walletStatus = 'Creating '
      let lastProgress = 0;

      (async () => {
        await wallet.generateWallet(
          'password',
          (progress) => {
            if (Math.floor(progress * 10) > lastProgress) {
              lastProgress = progress * 10;
              this.walletProgress = Math.floor(progress*100)
            }
          });
        this.simba.setWallet(this.wallet)
        this.address = await wallet.getAddress();
        this.seed = await wallet.getMnemonic();
      })();
    },
    initAll() {
      ;(async () => {
        let simba = await libsimba.getSimbaInstance(
          'yourApiUrl',
          null,
          'yourApiKey');
        this.simba = simba

        this.getDataByMethod('createProduct')
        this.getDataByMethod('createPlatform')
        this.getDataByMethod('createProductPlatform')
      })();
    },
    getDataByMethod(methodName) {
      this[methodName + 'Loading'] = true
      let self = this

      ;(async () => {
        let response = await this.simba.getMethodTransactions(methodName, {})
          .then(async (ret) => {
            return ret.data()
          })
          .catch((error) => {
            self.overlay = false
            self.loadTimeline = false
            console.log(error)
          });

        self.txnData[methodName] = []
        response.forEach(function(txn) {
          if (txn.transaction_hash) {
            self.txnData[methodName].push(txn.transaction_hash)
          }
        })
        self[methodName + 'Loading'] = false
      })();
    },
    getFormByTab() {
      let form = this.items.find(o => o.value == this.tabMethod[this.tab]);    
      this.buildData(form.field)
    },
    buildData(field) {
      let obj = {}
      Object.keys(field).forEach(function(key,index) {
        if (field[key].type == 'date') {
          obj[key] = (new Date(field[key].value)).getTime()
        } else {
          obj[key] = field[key].value
        }
      })
      this.postTxn(obj)
    },
    postTxn(obj) {
      this.postingTxn = true
      ;(async () => {
        await this.simba.callMethod(this.tabMethod[this.tab], obj)
          .then(async (ret) => {
            this.goBack()
            const {
              future,
              cancel
            } = this.simba.waitForSuccessOrError(ret);

            return await future
            .then(txn => {
              console.log(txn)
            })
            .catch((error) => {
              this.postingTxn = false
              console.log(error)
            })
          })
          .catch((error) => {
            this.postingTxn = false
            console.log(error)
          });
      })();
    },
    goBack() {
      this.dialog = false
    }
  }
}
</script>
