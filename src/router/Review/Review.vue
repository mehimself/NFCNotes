<template>
  <v-container fluid fill-height class="page">
    <v-layout fluid fill-height grid-list-lg>
      <v-flex xs10 offset-xs1>
        <v-card class="glass dark">
          <v-card-text v-if="!recording">
            <audio controls style="width: 100%">
              <source :src="'/recordings/' + mostRecentRecordingName" type="audio/wav">
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
                  :class="{
                    'disabled': recording,
                    'active': recording && activeTag === tag
                  }"
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
      v-if="edit"
      v-model="activeTag">
      <v-card>
        <v-card-title
          class="blue-grey darken-4 py-4 title"
        >
         Edit Note (Clip duration {{ durationString(activeTagEnd - activeTagStart, true) }})
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                prepend-icon="edit"
                placeholder="Notes"
                multi-line
                :value="activeTagNote"
                @input="updateTagNote"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-layout row>
                <v-flex xs9>
                  <v-slider
                    label="start time"
                    :max="activeTagEnd - 2000"
                    v-model="activeTagStart">
                  </v-slider>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    :value="durationString(activeTagStart, true)"
                    @input="updateTagStart"
                    type="string"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row>
                <v-flex xs9>
                  <v-slider
                    label="end time"
                    :min="activeTagStart + 2000"
                    :max="recordingDuration"
                    v-model="activeTagEnd">
                  </v-slider>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    :value="durationString(activeTagEnd, true)"
                    @input="updateTagEnd"
                    type="string"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="closeEditor()">Close</v-btn>
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
  export default {
    data() {
      return {
        size: 'sm',
        edit: false,
        recordingStartMS: Date.now(),
        recordingDuration: 10000,
        mostRecentRecordingName: 'placeholder.wav'
      }
    },
    computed: {
      ...mapState([
        'recording',
        'activeTag'
      ]),
      activeTag: {
        get() {
          return this.$store.state.activeTag
        },
        set(value) {
          this.$store.commit(types.PUT_ACTIVETAG, value)
        }
      },
      activeTagNote: {
        get() {
          return this.$store.state.activeTag.note
        },
        set(value) {
          this.$store.commit(types.PUT_ACTIVETAG, {note: value})
        }
      },
      activeTagEnd: {
        get() {
          return this.$store.state.activeTag.end
        },
        set(value) {
          this.$store.commit(types.PUT_ACTIVETAG, {end: value})
        }
      },
      activeTagStart: {
        get() {
          return this.$store.state.activeTag.start
        },
        set(value) {
          this.$store.commit(types.PUT_ACTIVETAG, {start: value})
        }
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
        this.$store.commit(types.SET_ACTIVETAG, tag)
        this.edit = true
      },
      updateTagNote: function (note) {
        this.activeTagNote = note
      },
      updateTagStart: function (value) {
        this.activeTagStart = value
      },
      updateTagEnd: function (value) {
        this.activeTagEnd = value
      },
      closeEditor: function () {
        this.edit = false
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
      if (!this.recording) {
        document.querySelector('audio').onloadeddata = function () {
          that.recordingDuration = Math.round(document.querySelector('audio').duration) * 1000
        }
      }
      this.$options.sockets.onmessage = function (msg) {
        const body = JSON.parse(msg.data)
        console.log(body)
        if (body.destination === 'review') {
          switch (body.subject) {
            case 'tagRead':
              this.$store.dispatch(types.HANDLE_WS_TAGREAD, body.payload)
              break
            case 'tagRemoved':
              this.$store.dispatch(types.HANDLE_WS_TAGREMOVED, body.payload)
          }
        }
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
  .active {
    filter: invert(100%);
  }
</style>
