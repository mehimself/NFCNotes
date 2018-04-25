<template>
  <v-container class="clear" fluid fill-height>
    <v-layout class="clear" row align-center justify-content-center>
      <v-flex xs12>
        <v-card class="glass">
          <v-card-title primary-title @click="animate=!animate"><!-- todo: remove @click -->
            <h1>
              Record Notes
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
                Begin
              </span>
              <span v-else class="pr-1">
                Stop
              </span>
              recording audio
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    data() {
      return {
        animate: false
      }
    },
    computed: {
      recording: function () {
        return this.$store.state.recording
      },
      buttonColor: function () {
        return this.recording ? 'red' : ''
      }
    },
    methods: {
      toggleRecording: function () {
        this.$store.dispatch('SET_RECORDING', !this.recording)
      }
    }
  }
</script>
