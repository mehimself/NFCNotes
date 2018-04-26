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
                xs3
                v-for="tag in getTags()"
                :key="tag.id"
                @click="openEditor(tag)"
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
      v-model="editedTag">
      <v-card>
        <v-card-title
          class="blue-grey darken-4 py-4 title"
        >
          Edit Note (Clip duration {{ durationString(editedTag.end - editedTag.start, true) }})
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                prepend-icon="edit"
                placeholder="Notes"
                multi-line
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-layout row>
                <v-flex xs9>
                  <v-slider
                    label="start time"
                    :max="editedTag.end - 2000"
                    v-model="editedTag.start">
                  </v-slider>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    :value="editedTagStartOffset"
                    type="string"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row>
                <v-flex xs9>
                  <v-slider
                    label="end time"
                    :min="editedTag.start + 2000"
                    :max="recordingDuration"
                    v-model="editedTag.end">
                  </v-slider>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    :value="editedTagEndOffset"
                    type="string"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat @click="closeEditor()">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat @click="closeEditor(true)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import * as types from '../../store/mutation-types'
  import {mapState, mapGetters} from 'vuex'
  import moment from 'moment'
  import axios from 'axios'
  function copyObjectLiteral(obj) {
    let copy = {}
    for (let name in obj) {
      if (obj.hasOwnProperty(name)) {
        copy[name] = obj[name]
      }
    }
    return copy
  }
  export default {
    data() {
      return {
        size: 'sm',
        editedTag: null,
        editedTagBackup: null,
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
        return this.durationString(this.editedTag.start, true)
      },
      editedTagEndOffset: function () {
        return this.durationString(this.editedTag.end, true)
      }
    },
    methods: {
      ...mapGetters([
        'getTags'
      ]),
      clipStartOffset(tag) {
        return this.durationString(tag.start, true)
      },
      clipDuration(tag) {
        return this.durationString(tag.end - tag.start, true)
      },
      openEditor: function (tag) {
        this.editedTagBackup = copyObjectLiteral(tag)
        this.editedTag = tag
      },
      closeEditor: function (save) {
        this.$store.dispatch(types.PUT_TAG, save ? this.editedTag : this.editedTagBackup)
        if (!save) {
          for (let name in this.editedTagBackup) {
            if (this.editedTagBackup.hasOwnProperty(name)) {
              this.editedTag[name] = this.editedTagBackup[name]
            }
          }
        }
        this.editedTag = null
      },
      durationString: function (ms, twoUnitsOnly) {
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
