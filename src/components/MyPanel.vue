<template>
  <div style="overflow-x: hidden;">
     <div v-if="getUser().title == 'Candidate'">
      <div class="md-layout-item md-xlarge-size-60 md-large-size-60 md-medium-size-80 md-small-size-100 md-xsmall-size-100">
        <md-table class="table" v-model="searched" md-sort="timestamp" md-sort-order="asc" md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h2 class="md-title get-title">List of Votes Casted</h2>
            </div>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" v-for="(se, i) in searched" v-if="se.payload.method=='candidates'" :key="i" @click="queryTxn(se.id)">
            <md-table-cell md-label="Voter Address" md-sort-by="receipt.from">{{ se.payload.raw.from}}</md-table-cell>
            <md-table-cell md-label="Candidate ID" md-sort-by="payload.inputs._name">{{ se.payload.inputs[''] }}</md-table-cell>
            <md-table-cell md-label="Deployed Timestamp" md-sort-by="timestamp">{{ (new Date(se.timestamp)).toLocaleString() }}</md-table-cell>
          </md-table-row>

          <h2 class="loading" v-if="loadingBar">Loading Records...</h2>
          <md-progress-bar class="md-accent loading-bar" md-mode="indeterminate" v-if="loadingBar"></md-progress-bar>

          <div v-if="searched.length === 0">
            <h2 class="loading" v-if="loadingBar === false">We cannot find any records : (</h2>
          </div>
        </md-table>

        <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
          <md-tabs md-dynamic-height class="md-accent">
            <md-tab md-label="Transaction">
              <div class="txn-details" v-if="showTxn">
                <md-field>
                  <label>Transaction Hash</label>
                  <md-input v-model="txnHash" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction From</label>
                  <md-input v-model="txnFrom" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction To</label>
                  <md-input v-model="txnTo" readonly></md-input>
                </md-field>
                <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
                <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
              </div>
              <div class="txn-details" v-else>
                <div class="md-caption">Please come back later</div>
                <br>
                <div class="md-caption">You should see the details then, if the transaction has been completed</div>
              </div>
            </md-tab>
          </md-tabs>

          <md-dialog-actions class="md-layout md-alignment-center-left">
            <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
          </md-dialog-actions>
        </md-dialog>

      </div>
    </div>

    <div v-if="getUser().title == 'Election Official'">
            <div class="md-layout-item md-xlarge-size-60 md-large-size-60 md-medium-size-80 md-small-size-100 md-xsmall-size-100">
        <md-table class="table" v-model="searched" md-sort="timestamp" md-sort-order="asc" md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h2 class="md-title get-title">Smart Contract Address</h2>
            </div>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" v-for="(se, i) in searched" v-if="se.payload.method==null" :key="i" @click="queryTxn(se.id)">
            <md-table-cell md-label="Smart Contract Address" md-sort-by="receipt.contractAddress">{{ se.receipt.contractAddress}}</md-table-cell>
            <md-table-cell md-label="Owner Address" md-sort-by="receipt.from">{{ se.receipt.from}}</md-table-cell>
            <md-table-cell md-label="Deployed Timestamp" md-sort-by="timestamp">{{ (new Date(se.timestamp)).toLocaleString() }}</md-table-cell>
          </md-table-row>

          <h2 class="loading" v-if="loadingBar">Loading Records...</h2>
          <md-progress-bar class="md-accent loading-bar" md-mode="indeterminate" v-if="loadingBar"></md-progress-bar>

          <div v-if="searched.length === 0">
            <h2 class="loading" v-if="loadingBar === false">We cannot find any records : (</h2>
          </div>
        </md-table>

        <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
          <md-tabs md-dynamic-height class="md-accent">
            <md-tab md-label="Transaction">
              <div class="txn-details" v-if="showTxn">
                <md-field>
                  <label>Transaction Hash</label>
                  <md-input v-model="txnHash" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction From</label>
                  <md-input v-model="txnFrom" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction To</label>
                  <md-input v-model="txnTo" readonly></md-input>
                </md-field>
                <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
                <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
              </div>
              <div class="txn-details" v-else>
                <div class="md-caption">Please come back later</div>
                <br>
                <div class="md-caption">You should see the details then, if the transaction has been completed</div>
              </div>
            </md-tab>
          </md-tabs>

          <md-dialog-actions class="md-layout md-alignment-center-left">
            <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
          </md-dialog-actions>
        </md-dialog>

      </div>
            <div class="md-layout-item md-xlarge-size-60 md-large-size-60 md-medium-size-80 md-small-size-100 md-xsmall-size-100">
        <md-table class="table" v-model="searched" md-sort="timestamp" md-sort-order="asc" md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h2 class="md-title get-title">Ballot Details</h2>
            </div>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" v-for="(se, i) in searched" v-if="se.payload.method=='Election2020'" :key="i" @click="queryTxn(se.id)">
            <md-table-cell md-label="Ballot Name" md-sort-by="payload.inputs._name">{{ se.payload.inputs._name}}</md-table-cell>
            <md-table-cell md-label="Owner Address" md-sort-by="receipt.from">{{ se.receipt.from}}</md-table-cell>
            <md-table-cell md-label="Deployed Timestamp" md-sort-by="timestamp">{{ (new Date(se.timestamp)).toLocaleString() }}</md-table-cell>
          </md-table-row>

          <h2 class="loading" v-if="loadingBar">Loading Records...</h2>
          <md-progress-bar class="md-accent loading-bar" md-mode="indeterminate" v-if="loadingBar"></md-progress-bar>

          <div v-if="searched.length === 0">
            <h2 class="loading" v-if="loadingBar === false">We cannot find any records : (</h2>
          </div>
        </md-table>

        <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
          <md-tabs md-dynamic-height class="md-accent">
            <md-tab md-label="Transaction">
              <div class="txn-details" v-if="showTxn">
                <md-field>
                  <label>Transaction Hash</label>
                  <md-input v-model="txnHash" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction From</label>
                  <md-input v-model="txnFrom" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction To</label>
                  <md-input v-model="txnTo" readonly></md-input>
                </md-field>
                <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
                <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
              </div>
              <div class="txn-details" v-else>
                <div class="md-caption">Please come back later</div>
                <br>
                <div class="md-caption">You should see the details then, if the transaction has been completed</div>
              </div>
            </md-tab>
          </md-tabs>

          <md-dialog-actions class="md-layout md-alignment-center-left">
            <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
          </md-dialog-actions>
        </md-dialog>

      </div>
            <div class="md-layout-item md-xlarge-size-60 md-large-size-60 md-medium-size-80 md-small-size-100 md-xsmall-size-100">
        <md-table class="table" v-model="searched" md-sort="timestamp" md-sort-order="asc" md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h2 class="md-title get-title">Candidates on the Ballot</h2>
            </div>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" v-for="(se, i) in searched" v-if="se.payload.method=='addCandidate'" :key="i" @click="queryTxn(se.id)">
            <md-table-cell md-label="Candidate Name" md-sort-by="payload.inputs._name">{{ se.payload.inputs._name}}</md-table-cell>
            <md-table-cell md-label="Deployed Timestamp" md-sort-by="timestamp">{{ (new Date(se.timestamp)).toLocaleString() }}</md-table-cell>
          </md-table-row>

          <h2 class="loading" v-if="loadingBar">Loading Records...</h2>
          <md-progress-bar class="md-accent loading-bar" md-mode="indeterminate" v-if="loadingBar"></md-progress-bar>

          <div v-if="searched.length === 0">
            <h2 class="loading" v-if="loadingBar === false">We cannot find any records : (</h2>
          </div>
        </md-table>

        <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
          <md-tabs md-dynamic-height class="md-accent">
            <md-tab md-label="Transaction">
              <div class="txn-details" v-if="showTxn">
                <md-field>
                  <label>Transaction Hash</label>
                  <md-input v-model="txnHash" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction From</label>
                  <md-input v-model="txnFrom" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction To</label>
                  <md-input v-model="txnTo" readonly></md-input>
                </md-field>
                <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
                <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
              </div>
              <div class="txn-details" v-else>
                <div class="md-caption">Please come back later</div>
                <br>
                <div class="md-caption">You should see the details then, if the transaction has been completed</div>
              </div>
            </md-tab>
          </md-tabs>

          <md-dialog-actions class="md-layout md-alignment-center-left">
            <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
          </md-dialog-actions>
        </md-dialog>

      </div>
      <div class="md-layout-item md-xlarge-size-60 md-large-size-60 md-medium-size-80 md-small-size-100 md-xsmall-size-100">
        <md-table class="table" v-model="searched" md-sort="timestamp" md-sort-order="asc" md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h2 class="md-title get-title">List of Votes Casted</h2>
            </div>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" v-for="(se, i) in searched" v-if="se.payload.method=='candidates'" :key="i" @click="queryTxn(se.id)">
            <md-table-cell md-label="Voter Address" md-sort-by="receipt.from">{{ se.payload.raw.from}}</md-table-cell>
            <md-table-cell md-label="Candidate ID" md-sort-by="payload.inputs._name">{{ se.payload.inputs[''] }}</md-table-cell>
            <md-table-cell md-label="Deployed Timestamp" md-sort-by="timestamp">{{ (new Date(se.timestamp)).toLocaleString() }}</md-table-cell>
          </md-table-row>

          <h2 class="loading" v-if="loadingBar">Loading Records...</h2>
          <md-progress-bar class="md-accent loading-bar" md-mode="indeterminate" v-if="loadingBar"></md-progress-bar>

          <div v-if="searched.length === 0">
            <h2 class="loading" v-if="loadingBar === false">We cannot find any records : (</h2>
          </div>
        </md-table>

        <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
          <md-tabs md-dynamic-height class="md-accent">
            <md-tab md-label="Transaction">
              <div class="txn-details" v-if="showTxn">
                <md-field>
                  <label>Transaction Hash</label>
                  <md-input v-model="txnHash" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction From</label>
                  <md-input v-model="txnFrom" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction To</label>
                  <md-input v-model="txnTo" readonly></md-input>
                </md-field>
                <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
                <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
              </div>
              <div class="txn-details" v-else>
                <div class="md-caption">Please come back later</div>
                <br>
                <div class="md-caption">You should see the details then, if the transaction has been completed</div>
              </div>
            </md-tab>
          </md-tabs>

          <md-dialog-actions class="md-layout md-alignment-center-left">
            <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
          </md-dialog-actions>
        </md-dialog>

      </div>
      <div class="md-layout-item md-xlarge-size-60 md-large-size-60 md-medium-size-80 md-small-size-100 md-xsmall-size-100">
        <md-table class="table" v-model="searched" md-sort="timestamp" md-sort-order="asc" md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h2 class="md-title get-title">Ballot Tabulation</h2>
            </div>
          </md-table-toolbar>

          <h2 class="loading" v-if="loadingBar">Loading Records...</h2>
          <md-progress-bar class="md-accent loading-bar" md-mode="indeterminate" v-if="loadingBar"></md-progress-bar>

          <div v-if="searched.length === 0">
            <h2 class="loading" v-if="loadingBar === false">We cannot find any records : (</h2>
          </div>
        </md-table>

        <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
          <md-tabs md-dynamic-height class="md-accent">
<!--             <md-tab md-label="Basic">
              <strong style="color:#64dd17;">This Transcation is made by: {{checkedTxn.userRole}}</strong>

              <div>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label for="userID">User ID</label>
                      <md-input name="userID" id="userID" v-model="checkedTxn.userID" readonly/>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-40">
                    <md-field>
                      <label for="userName">User Name</label>
                      <md-input name="userName" id="userName" v-model="checkedTxn.userName" readonly/>
                    </md-field>
                  </div>
                </div>
              </div>

              <div>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-size-40">
                    <md-field>
                      <label for="txnType">Transaction Type</label>
                      <md-input name="txnType" id="txnType" v-model="checkedTxn.txnType" readonly/>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-40">
                    <md-field>
                      <label for="txnAmount">Amount</label>
                      <md-input name="txnAmount" id="txnAmount" v-model="checkedTxn.txnAmount" readonly/>
                    </md-field>
                  </div>
                </div>
              </div>

              <div>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-size-40">
                    <md-field>
                      <label for="inReading">In Reading</label>
                      <md-input name="inReading" id="inReading" v-model="checkedTxn.inReading" readonly/>
                    </md-field>
                  </div>
                  <div v-if="checkedTxn.userRole == 'Candidate'" class="md-layout-item md-size-40">
                    <md-field>
                      <label for="outReading">Out Reading</label>
                      <md-input name="outReading" id="outReading" v-model="checkedTxn.outReading" readonly/>
                    </md-field>
                  </div>
                </div>
              </div>

              <div v-if="checkedTxn.userRole == 'Candidate'">
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-size-40">
                    <md-field>
                      <label for="creditRate">Credit Rate</label>
                      <md-input name="creditRate" id="creditRate" v-model="checkedTxn.creditRate" readonly/>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-40">
                    <md-field>
                      <label for="txnCredit">Credit Earned(+)/Used(-)</label>
                      <md-input name="txnCredit" id="txnCredit" v-model="checkedTxn.txnCredit" readonly/>
                    </md-field>
                  </div>
                </div>
              </div>

            </md-tab> -->

            <md-tab md-label="Transaction">
              <div class="txn-details" v-if="showTxn">
                <md-field>
                  <label>Transaction Hash</label>
                  <md-input v-model="txnHash" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction From</label>
                  <md-input v-model="txnFrom" readonly></md-input>
                </md-field>
                <md-field>
                  <label>Transaction To</label>
                  <md-input v-model="txnTo" readonly></md-input>
                </md-field>
                <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
                <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
              </div>
              <div class="txn-details" v-else>
                <div class="md-caption">Please come back later</div>
                <br>
                <div class="md-caption">You should see the details then, if the transaction has been completed</div>
              </div>
            </md-tab>
          </md-tabs>

          <md-dialog-actions class="md-layout md-alignment-center-left">
            <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
          </md-dialog-actions>
        </md-dialog>

      </div>
    </div>
  </div>
</template>

<script>
import simbaApi from './gateways/simba-api'
import { localstorage } from './mixins/localstorage'
import ethers from 'ethers'
import Odometer from 'odometer'
import 'odometer/themes/odometer-theme-car.css'

export default {
  name: 'MyPanel',
  mixins: [localstorage],
  data: () => ({
    searched: [],
    loadingBar: null,

    isRunning: 'off',

    meterInterval: null,
    getInterval: null,
    urInterval: null,

    inReading: 0,
    outReading: 0,

    showDetailsDialog: false,
    showTxn: false,

    availableCredit: 0,

    latestTxn: {
      txnAmount: 0,
      txnCredit: 0,
      txnType: null
    },

    txnFrom: null,
    txnTo: null,
    txnHash: null,
    txnStatus: null,
    gasUsed: null,

    checkedTxn: {
      creditRate: 0,
      inReading: 0,
      outReading: 0,
      txnAmount: 0,
      txnCredit: 0,
      txnType: null,
      userID: null,
      userName: null,
      userRole: null
    }
  }),
  mounted () {
    this.stopAll()
    this.cleanAll()
    this.loadingBar = true
    // if (this.getUser().title !== 'Election Official') {
    //  this.getUserTxns()
    // } else {
    this.getAllTxns()
    let self = this
    this.urInterval = setInterval(function () {
      self.getAllTxns()
    }, 5000)
    // }
  },
  methods: {
    cleanAll () {
      this.searched = []
      this.latestTxn.txnAmount = 0
      this.latestTxn.txnCredit = 0
      this.inReading = 0
      this.outReading = 0
      this.latestTxn.txnType = null
      this.meterInterval = null
      this.getInterval = null
      this.urInterval = null
      this.showDetailsDialog = false
      this.showTxn = false
      this.txnFrom = null
      this.txnTo = null
      this.txnHash = null
      this.txnStatus = null
      this.gasUsed = null
    },
    getUserTxns () {
      let self = this
      let wallet = ethers.Wallet.fromMnemonic(this.getUser().key)
      let userId = wallet.address
      try {
        simbaApi.getData('makeTxn/?userID_contains=' + userId)
          .then(function (response) {
            self.loadingBar = false
            self.searched = response.data.results
            self.sumUpCredit(response.data.results)
            self.getLatestTxn(response.data.results[0].payload.inputs)
          })
      } catch (e) {
        this.errors.push(e)
      }
    },
    sumUpCredit (res) {
      let availableCredit = 0
      let inReading = 0
      let outReading = 0

      for (let i = 0; i < res.length; i++) {
        availableCredit += res[i].payload.inputs.txnCredit
        if (res[i].payload.inputs.txnType === 'buy') {
          inReading += res[i].payload.inputs.txnAmount
        } else {
          outReading += res[i].payload.inputs.txnAmount
        }
      }
      this.inReading = inReading
      this.outReading = outReading
      this.availableCredit = availableCredit
      // This calculation is incorrect,
      // it should not use the most recent 100 transactions to do the calculation
      // but its ok for a demo
    },
    getAllTxns () {
      let self = this
      try {
        simbaApi.getData('transaction/?noContractTxn')
          .then(function (response) {
            self.loadingBar = false
            self.searched = response.data.results
          })
      } catch (e) {
        this.errors.push(e)
      }
    },
    queryTxn (id) {
      this.showDetailsDialog = true
      let self = this
      try {
        simbaApi.getData('transaction/' + id + '/')
          .then(function (res) {
            self.queryMethodName = res.data.payload.method
            self.setBasic(res.data.payload.inputs)
            if (res.data.receipt == null) {
              self.showTxn = false
            } else {
              self.setTxn(res)
            }
          })
      } catch (e) {
        this.errors.push(e)
      }
    },
    setTxn (res) {
      this.showTxn = true
      this.txnFrom = res.data.receipt.from
      this.txnTo = res.data.receipt.to
      this.txnHash = res.data.receipt.transactionHash
      this.txnStatus = res.data.receipt.status
      this.gasUsed = res.data.receipt.gasUsed
    },
    setBasic (res) {
      this.checkedTxn.creditRate = res.creditRate
      this.checkedTxn.inReading = res.inReading
      this.checkedTxn.outReading = res.outReading
      this.checkedTxn.txnAmount = res.txnAmount
      this.checkedTxn.txnCredit = res.txnCredit
      this.checkedTxn.txnType = res.txnType
      this.checkedTxn.userID = res.userID
      this.checkedTxn.userName = res.userName
      this.checkedTxn.userRole = res.userRole
    },
    getLatestTxn (lastestTxn) {
      this.latestTxn.txnCredit = lastestTxn.txnCredit
      this.latestTxn.txnType = lastestTxn.txnType
      this.latestTxn.txnAmount = lastestTxn.txnAmount
    },
    stopAll () {
      let highestTimeoutId = setTimeout(function () { ; })
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i)
      }
    },
    randomNum () {
      let el = document.querySelector('.odometer')
      let od = new Odometer({
        el: el
      })
      let num = Math.floor(Math.random() * 100) + 100
      od.update(num)
      this.makeTxn(num)
    },
    makeTxn (num) {
      if (this.isRunning === 'off') {
        return
      }
      let wallet = ethers.Wallet.fromMnemonic(this.getUser().key)
      let address = wallet.address

      let rate = Math.floor(Math.random() * 3 + 1)
      let credit = rate * num
      let inReading = this.inReading
      let outReading = this.outReading

      if (this.isRunning === 'buy') {
        credit = credit * (-1)
        inReading += num
      } else {
        outReading += num
      }
      // This calculation might be incorrect

      let bodyFormData = new FormData()
      bodyFormData.append('from', address)
      bodyFormData.append('userID', address)
      bodyFormData.append('userRole', this.getUser().title)
      bodyFormData.append('userName', this.getUser().name)
      bodyFormData.append('txnType', this.isRunning)
      bodyFormData.append('inReading', inReading)
      bodyFormData.append('outReading', outReading)
      bodyFormData.append('txnAmount', num)
      bodyFormData.append('txnCredit', credit)
      bodyFormData.append('creditRate', rate)
      bodyFormData.append('assetId', 'usedToGenerateGraph,butYouCanIgnoreItAndFillWithAnything')

      let self = this
      try {
        simbaApi.postData('makeTxn/', bodyFormData).then(function (res) {
          self.sendTxn(res.data.id, res.data.payload.raw)
        })
      } catch (e) {
        console.log(e)
      }
    },
    sendTxn (txnId, unsignedTxn) {
      let wallet = ethers.Wallet.fromMnemonic(this.getUser().key)
      let signedTxn = wallet.sign(unsignedTxn)
      let payload = {
        'payload': signedTxn
      }
      try {
        simbaApi.signTxn('transaction/' + txnId + '/', payload).then(function () {
        })
      } catch (e) {
        console.log(e)
      }
    },
    changeStatus () {
      this.stopInterval()
      if (this.isRunning === 'off') {
        return
      }
      this.randomNum()
      let self = this

      this.getInterval = setInterval(function () {
        self.getUserTxns()
      }, 3000)

      this.meterInterval = setInterval(function () {
        self.randomNum()
      }, 10000)
      // Notice that the second transaction might fail if the first transcation is not confirmed by the network.
      // This applies to the transactions made with the same Ethereum Account(address)
      // But its ok for a demo.
    },
    stopInterval () {
      this.meterInterval = null
      this.getInterval = null
      this.stopAll()
      let el = document.querySelector('.odometer')
      let od = new Odometer({
        el: el
      })
      od.update(0)
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-card {
    margin-top: 20px;
    height: 180px;
  }
  .table {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .odometer {
    font-size: 30px;
    margin: 0;
  }
  .odometer-container {
    margin-top: 40px;
    margin-left: -20px;
  }
  .statistics {
    margin-top: 8px;
  }
  .loading {
    margin-left: 10px;
    text-align: center;
  }
  .loading-bar {
    margin-top: -10px;
  }
  .loading-circle {
    text-align: center;
  }
  .rotate-image {
    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;
  }
  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

</style>
