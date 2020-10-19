<template>
  <div>
    <md-card class="md-alignment-center-center my-card" md-with-hover>
      <md-card-header>
        <div class="md-title">Hey, {{getUser().name}}</div>
        <div class="md-subhead">
          You have logged in as:
          <br>
          <strong style="color:#64dd17;">{{getUser().title}}</strong>
        </div>
      </md-card-header>

      <md-card-content>

        <div v-if="getUser().title == 'Candidate'">
          <small class="md-caption">
            Candidate stands for an election.
          </small>
          <br>
          <strong>
            You can do following:
          </strong>
          <br>
          <small class="margin-txt">
            1. View all the votes
          </small>
          <br>
          <small class="margin-txt">
            2. Logout
          </small>
          <br>
        </div>

        <div v-if="getUser().title == 'Voter'">
          <small class="md-caption">
            Voter votes for a candidate in election.
          </small>
          <br>
          <strong>
            You can do following:
          </strong>
          <br>
          <small class="margin-txt">
            1. Vote for a candidate on ballot.
          </small>
          <br>
          <small class="margin-txt">
            2. #todo for voter
          </small>
          <br>
          <br>
        </div>

        <div v-if="getUser().title == 'Election Official'">
          <small class="md-caption">
            Election official monitors all voting transactions.
          </small>
          <br>
          <strong>
            You can do following:
          </strong>
          <br>
          <small class="margin-txt">
            1. Check out all transactions
          </small>
          <br>
          <br>
          <br>
        </div>

      </md-card-content>

      <md-card-actions>
        <router-link to="MyPanel">
          <md-button class="md-accent">
            <md-icon>dashboard</md-icon> my Panel
          </md-button>
        </router-link>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
import { localstorage } from './mixins/localstorage'

export default {
  name: 'Home',
  mixins: [localstorage]
}
</script>

<style lang="scss" scoped>
  .my-card {
    margin-top: 40px;
    width: 250px;
    display: inline-block;
    vertical-align: top;
    margin-bottom: 20px;
  }
  .margin-txt {
    margin-left: 10px;
  }
</style>
