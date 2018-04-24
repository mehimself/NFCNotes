<template>
  <v-container fluid fill-height class="page">
    <v-layout fluid fill-height grid-list-lg>
      <v-flex xs10 offset-xs1>
        <v-card class="dark">
          <v-card-title primary-title>
            <h1>NFC Notes</h1>
          </v-card-title>
          <v-card-text>
            <h4>
              Place a note on the reader to replay its clip
            </h4>
            <p>
              adjust the time to loop the clip
            </p>
            <p>
              name and annotate the clip for later review
            </p>
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
      }
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
