<template>
  <v-app id="inspire">
    <v-header></v-header>
    <div style="position: absolute; top: 80px; left: 248px;" @click="createPulse"><!-- todo: remove click-->
      <v-logo size="32" :flat="animate"></v-logo>
    </div>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import VHeader from '../../components/VHeader'
  import VLogo from '../../components/VLogo'
  export default {
    computed: {
      animate: function () {
        return this.$store.state.tagReadPulse
      }
    },
    methods: {
      createPulse: function () { // todo: dispatch from websocket
        this.$store.dispatch('SET_TAGREADPULSE')
      }
    },
    components: {
      VHeader,
      VLogo
    }
  }
</script>
<style>
  body {
    background-image: url('/back.jpg');
    background-size: 100% 100%;
  }

  .card {
    -webkit-border-radius: 1em;
    -moz-border-radius: 1em;
    border-radius: 1em;
  }

  .clear, .application {
    background-color: transparent !important;
  }

  .glass {
    background-color: rgba(0, 24, 55, 0.2) !important;
    filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, .4));
    border-top: #c7c7c7 1px solid;
    border-left: #c7c7c7 1px solid;
    border-right: grey 1px solid;
  }

  .card.top {
    margin-top: 2em !important;
  }

  .card.bottom {
    position: absolute;
    bottom: 1em;
  }

  .stump {
    margin-top: 1em !important;
    height: 750px !important;
  }

  .card {
    color: white !important;
  }

  .white.card {
    color: black !important;
    background-color: rgba(255, 255, 255, 0.2) !important;
  }

  .bottom {
    position: absolute;
    bottom: 0;
    zIndex: 1;
  }

  .bottom4 {
    position: absolute;
    bottom: 4%;
    zIndex: 1;
  }

  .expansion-panel__header {
    padding: 0 24px 12px 24px !important;
  }

  .attribution {
    float: right;
  }

  .attribution a {
    text-decoration: none;
    color: inherit;
  }

  .avatar img {
    width: 100% !important;
    height: auto !important;
  }

  .label {
    border-radius: 0.5em;
    background-color: rgba(255, 255, 255, 0.5);
    margin: 1em;
    padding: 1em;
    min-width: 50%;
  }

  .pointer {
    cursor: pointer;
  }

  .frame {
    width: 100%;
  }

  .frame > img {
    width: 100%;
    height: auto;
  }
</style>
