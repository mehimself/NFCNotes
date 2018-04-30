<template>
  <v-container class="clear" fluid fill-height>
    <v-layout class="clear" row align-center justify-content-center>
      <v-flex xs12>
        <v-card class="glass">
          <v-card-title primary-title>
            <h1>
              Optag Møde
            </h1>
          </v-card-title>
          <v-card-text>
            <v-btn
              block
              :color="buttonColor"
              @click="toggleRecording"
            >
              <v-icon>mic</v-icon>
              <span v-if="!recording" class="pr-1">
                Start
              </span>
              <span v-else class="pr-1">
                Slut
              </span>
              optagelse
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState([
        'recording'
      ]),
      buttonColor: function () {
        return this.recording ? 'red' : ''
      }
    },
    methods: {
      toggleRecording: function () {
        if (this.recording) {
          this.$store.dispatch('STOP_RECORDING')
        } else {
          this.$store.dispatch('START_RECORDING')
        }
      }
    }
  }
</script>
