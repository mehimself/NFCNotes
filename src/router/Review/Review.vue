<template>
  <v-container fluid fill-height class="page">
    <v-layout fluid fill-height grid-list-lg>
      <v-flex xs10 offset-xs1>
        <v-card class="glass dark">
          <v-card-text v-if="!recording" id=audioFrame>

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
      v-if="editableTagLoaded"
      v-model="activeTag">
      <v-card>
        <v-card-title
          class="blue-grey darken-4 py-4 title"
        >
         Rediger Notater (Lydklip varighed {{ durationString(activeTagEnd - activeTagStart, true) }})
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                prepend-icon="edit"
                placeholder="Notater"
                multi-line
                label="Skriv her:"
                :value="activeTagNote"
                @input="updateTagNote"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-layout row>
                <v-flex xs9>
                  <v-slider
                    label="Starttid"
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
                    label="Sluttid"
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
          <v-btn flat @click="closeEditor()">Luk</v-btn>
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

  function renderPlayer(source) {
    let audio = document.createElement('audio')
    let frame = document.querySelector('#audioFrame')
    frame.innerHTML = ''
    frame.appendChild(audio)
    audio.setAttribute('type', 'audio/wav')
    audio.setAttribute('controls', true)
    audio.setAttribute('src', source)
    return audio
  }
  export default {
    data() {
      return {
        size: 'sm',
        editableTagLoaded: false,
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
          this.$store.dispatch(types.PUT_ACTIVETAG, value)
          if (value) {
            this.playClipInALoop()
          }
        }
      },
      activeTagNote: {
        get() {
          return this.$store.state.activeTag.note
        },
        set(value) {
          this.$store.dispatch(types.PUT_ACTIVETAG, {note: value})
        }
      },
      activeTagEnd: {
        get() {
          return this.$store.state.activeTag.end
        },
        set(value) {
          this.$store.dispatch(types.PUT_ACTIVETAG, {end: value})
        }
      },
      activeTagStart: {
        get() {
          return this.$store.state.activeTag.start
        },
        set(value) {
          this.$store.dispatch(types.PUT_ACTIVETAG, {start: value})
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
        this.editableTagLoaded = true
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
        this.editableTagLoaded = false
        this.$store.commit(types.SET_ACTIVETAG, null)
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
      },
      playClipInALoop: function () {
        function playLoop() {
          const canPlayLoop = !this.recording && this.activeTag
          if (canPlayLoop) {
            const audio = document.querySelector('audio')
            const startSeconds = this.activeTag.start / 1000
            const endSeconds = this.activeTag.end / 1000
            if (audio.currentTime > endSeconds) {
              audio.currentTime = startSeconds
            }
          }
        }
        const canPlayLoop = !this.recording && this.activeTag
        if (canPlayLoop) {
          const audio = document.querySelector('audio')
          const startSeconds = this.activeTag.start / 1000
          audio.currentTime = startSeconds
          audio.ontimeupdate = playLoop
          audio.play()
        }
      }
    },
    mounted() {
      let that = this
      axios.get('/api/mostRecentRecordingName').then(res => {
        if (res.status === 200) {
          that.mostRecentRecordingName = res.data
          that.recordingStartMS = moment(that.mostRecentRecordingName, 'YYYY-MM-DD HH-mm-ss').valueOf()
          let player = renderPlayer('/recordings/' + that.mostRecentRecordingName)
          player.onloadeddata = function () {
            that.recordingDuration = Math.round(document.querySelector('audio').duration) * 1000
          }
          player.style.width = '100%'
          console.log(that.mostRecentRecordingName)
        }
      })
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
