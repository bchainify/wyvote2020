<template>
  <v-app id="app">
    <v-card class="overflow-hidden">
      <v-app-bar
        absolute
        dark
        shrink-on-scroll
        prominent
        src="https://source.unsplash.com/collection/1132326/1600x900"
        fade-img-on-scroll
        scroll-target="#scrolling"
        scroll-threshold="200"
        style="z-index:100;"
        v-show="$route.name !== 'Create'"
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(0,0,0,0.4), rgba(25,32,72,.7)"
          ></v-img>
        </template>
        <v-toolbar-title>
          AF Frame
        </v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-btn text icon depressed :color=colorValue href="https://app.simbachain.com/" target="_blank" @click="colorValue = 'pink'">
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-app-bar>
      <v-sheet
        id="scrolling"
        class="overflow-y-auto"
        max-height="100vh"
      >
        <v-container
          class="fill-height container"
          fluid
        >
          <router-view class="router-content">
          </router-view>
        </v-container>
      </v-sheet>
    </v-card>
  </v-app>
</template>

<script>

export default {
  name: 'app',
  created () {
    this.$vuetify.theme.dark = true
  },
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    colorValue: ''
  })
}
</script>

<style scoped>
html {
  overflow: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 0px; 
  background: transparent;  
}
.container {
  min-height: 100vh;
}
.router-content {
  margin-top: 100px;
}
</style>