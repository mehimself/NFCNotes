<template>
  <v-container fluid fill-height class="page">
    <v-layout fluid fill-height grid-list-lg>
      <v-flex xs10 offset-xs1>
        <v-card class="glass dark">
          <v-card-text v-if="!recording">
            <audio controls style="width: 100%">
              <source :src="'/recordings/' + mostRecentRecordingName" type="audio/wav"><!-- todo: switch to recording.wav -->
              Your browser does not support the audio element.
            </audio>
          </v-card-text>
          <v-container fluid v-bind="{ [`grid-list-${size}`]: true }">
            <v-layout row wrap>
              <v-flex
                v-for="tag in getTags()"
                :key="tag.id"
                @click="editedTag = editedTag === tag ? null : tag"
                :class="{
                  xs12: editedTag === tag,
                  xs3: editedTag !== tag
                }"
              >
                <v-card
                    flat
                    tile
                    class="tag"
                    :class="{'disabled': recording}"
                >
                  <v-card-text>
                    <v-icon>alarm</v-icon>
                    {{ clipStartOffset(tag) }}
                    ( {{ clipDuration(tag) }} )
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-if="editedTag"
      v-model="editedTag"
      width="700px">
      <v-card>
        <v-card-title
          class="blue-grey darken-4 py-4 title"
        >
          Edit Note
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                prepend-icon="edit"
                placeholder="Notes"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <p class="black--text">{{editedTag.start}}</p>
              <v-layout row>
                <v-flex xs9>
                  <v-slider
                    label="start time"
                    :max="Math.min(recordingDuration, editedTag.end) - 2000"
                    v-model="editedTag.start">
                  </v-slider>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    v-model="editedTagStartOffset"
                    type="string"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <p class="black--text">{{editedTag.end}}</p>
              <v-layout row>
                <v-flex xs9>
                  <v-slider
                    label="start time"
                    :min="editedTag.start + 2000"
                    :max="recordingDuration"
                    v-model="editedTag.end">
                  </v-slider>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    v-model="editedTagEndOffset"
                    type="string"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import {mapState, mapGetters} from 'vuex'
  import moment from 'moment'
  import axios from 'axios'
  function durationString(ms, twoUnitsOnly) {
    const duration = moment.duration(ms)
    let formatted = ''
    let units = 0
    if (duration.hours()) {
      formatted += duration.hours() + 'h '
      units++
    }
    if (duration.hours() || duration.minutes()) {
      formatted += duration.minutes() + 'm '
      units++
    }
    if (!twoUnitsOnly || units < 2) {
      formatted += duration.seconds() + 's'
    }
    return formatted
  }
  export default {
    data() {
      return {
        size: 'sm',
        tags: [],
        editedTag: null,
        recordingStartMS: Date.now(),
        recordingDuration: 10000,
        mostRecentRecordingName: 'placeholder.wav'
      }
    },
    computed: {
      ...mapState([
        'recording'
      ]),
      editedTagStartOffset: function () {
        return durationString(this.editedTag.start, true)
      },
      editedTagEndOffset: function () {
        return durationString(this.editedTag.end, true)
      }
    },
    methods: {
      ...mapGetters([
        'getTags'
      ]),
      clipStartOffset(tag) {
        return durationString(tag.start - this.recordingStartMS, true)
      },
      clipDuration(tag) {
        return durationString(tag.end - tag.start, true)
      }
    },
    mounted() {
      let that = this
      axios.get('/api/mostRecentRecordingName').then(res => {
        if (res.status === 200) {
          that.mostRecentRecordingName = res.data
          that.recordingStartMS = moment(that.mostRecentRecordingName, 'YYYY/MM/DD HH-mm-ss').valueOf()
        }
      })
      document.querySelector('audio').onloadeddata = function () {
        console.log('duration', document.querySelector('audio').duration)
        that.recordingDuration = Math.round(document.querySelector('audio').duration) * 1000
      }
    }
  }
</script>
<style scoped>
  .dark {
    color: white;
    background-color: rgba(0,0,0,0.5);
    -webkit-border-radius: 1em;
    -moz-border-radius: 1em;
    border-radius: 0.2em;
    padding: 1em;
  }
  .tag {
    color: black!important;
  }
  .tag.disabled {
    opacity: 0.7;
  }
</style>
