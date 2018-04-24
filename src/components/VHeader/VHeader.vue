<template>
  <div>
    <v-toolbar
      dark
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      fixed
      :class="{recording: recording}"
    >
      <v-toolbar-title>
        <v-btn icon large>
          <v-logo />
        </v-btn>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn
          flat
          v-for="(item, index) in items"
          :class="{'active': $route.name === item.link}"
          :key="index"
          :title="item.lg || item.md || item.sm || item.xs"
          @click="$router.push({name: item.link})">
          <v-icon v-if="item.xs && $vuetify.breakpoint.xs">
            {{item.xs}}
          </v-icon>
          <span v-else-if="item.sm && $vuetify.breakpoint.smAndDown">
            {{item.sm}}
          </span>
          <span v-else-if="item.md && $vuetify.breakpoint.mdAndDown">
            {{item.md}}
          </span>
          <span v-else>
            {{item.lg || item.md || item.sm || item.xs}}
          </span>
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-tooltip left>
        <v-btn
          slot="activator"
          icon
          large
          @click="gotoDATAKUBEN"
        >
          <v-datakuben-logo/>
        </v-btn>
        <span>
          <v-icon class="white--text">link</v-icon>
          powered by DATAKUBEN
        </span>
      </v-tooltip>
    </v-toolbar>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import VDatakubenLogo from '../VDatakubenLogo'
  import VLogo from '../VLogo'

  export default {
    name: 'VHeader',
    data: () => ({
      user: null,
      drawer: false,
      dialog: false,
      items: [
        {link: 'record', xs: 'mic', sm: 'Record', md: 'Record Session'},
        {link: 'review', xs: 'rate_review', sm: 'Review', md: 'Review Notes'}
      ]
    }),
    computed: {
      ...mapState([
        'appColors',
        'pageColor'
      ]),
      recording: function () {
        return this.$store.state.recording
      }
    },
    methods: {
      gotoDATAKUBEN: function () {
        window.location.href = 'http://datakuben.sdu.dk'
      }
    },
    components: {
      VLogo,
      VDatakubenLogo
    }
  }
</script>

<style scoped>
  .cc {
    border: white 2px solid;
    border-radius: 1em;
    padding: 0.1em;
  }

  .toolbar .active {
    background-color: rgba(255, 255, 255, 0.4) !important;
  }

  a {
    font-size: 120%;
    color: white;
    text-decoration: none;
  }

  .list .list__group__items {
    background-color: #eee;
  }

  @keyframes recording {
    0%, 100% {
      background-color: red;
    }
    90% {
      background-color: #212121;
    }
  }

  .toolbar.recording {
    animation-name: recording;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-fill-mode: none; /* or: backwards, both, none */
  }
</style>
