<template>
  <v-container fluid fill-height class="page">
    <v-layout fluid fill-height grid-list-lg>
      <v-flex xs10 offset-xs1>
        <v-card class="dark">
          <v-card-title primary-title>
            <audio controls>
              <source :src="'/recordings/' + mostRecentRecordingName" type="audio/wav"><!-- todo: switch to recording.wav -->
              Your browser does not support the audio element.
            </audio>
          </v-card-title>
          <v-container fluid v-bind="{ [`grid-list-${size}`]: true }">
            <v-layout row wrap>
              <v-flex
                xs4
                v-for="n in 9"
                :key="n"
              >
                <v-card flat tile>
                  <v-card-text class="black--text">
                    {{n * Math.round(Math.random() * 60000)}} (
                    {{Math.round(Math.random() * 60)}}s )
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import moment from 'moment'
  import axios from 'axios'
  export default {
    data() {
      return {
        size: 'sm',
        mostRecentRecordingName: 'placeholder.wav'
      }
    },
    methods: {
      clipOffset(ms) {
        // let recordingLength = document.querySelector('audio').duration
        return moment
      }
    },
    mounted() {
      let that = this
      axios.get('/api/mostRecentRecordingName').then(res => {
        if (res.status === 200) {
          that.mostRecentRecordingName = res.data
        }
      })
    }
  }
</script>
<style scoped>
  .page {
    background-size: 100% 100%;
  }
  .dark {
    color: white;
    background-color: rgba(0,0,0,0.5);
    -webkit-border-radius: 1em;
    -moz-border-radius: 1em;
    border-radius: 0.2em;
    padding: 1em;
  }
</style>
