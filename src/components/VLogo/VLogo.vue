<template>
  <div class="logo"
       :id="id">
    <i
      aria-hidden="true"
      class="icon material-icons"
      :class="{'tumble': tumble, 'flat': flat}"
      :style="{fontSize: size + 'em'}">nfc</i>
  </div>
</template>
<script>
  export default {
    name: 'VLogo',
    computed: {
      height: function () {
        return Math.round(this.size || 32)
      },
      width: function () {
        return Math.round((this.size || 32) * 29 / 32)
      },
      id: function () {
        return Date.now()
      }
    },
    props: {
      'size': {
        'default': '2',
        type: String
      },
      'flat': {
        default: null,
        type: Boolean
      },
      'tumble': {
        default: null,
        type: String
      }
    }
  }
</script>
<style>
  @keyframes tumble {
    0%, 100% {
      transform: rotate3D(1, -1, 0, 0deg);
    }
    12% {
      transform: rotate3D(0, 1, 0, 1080deg);
    }
    25% {
      transform: rotate3D(0, 1, 1, 0deg);
    }
    37% {
      transform: rotate3D(1, 0, -1, 360deg);
    }
    50% {
      transform: rotate3D(-1, 1, 0, 0deg);
    }
    62% {
      transform: rotate3D(0.5, 0, 1, 720deg);
    }
    75% {
      transform: rotate3D(1, 1, 0, 0deg);
    }
    88% {
      transform: rotate3D(0, 1, -1, 360deg);
    }
  }

  .logo .tumble {
    animation-name: tumble;
    animation-duration: 72s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-timing-function: ease; /* or: ease, ease-in, ease-in-out, linear, cubic-bezier(x1, y1, x2, y2) */
    animation-fill-mode: none; /* or: backwards, both, none */
  }

  @keyframes rotate {
    0% {
      transform: rotate3D(0, 0, 1, 10deg);
      filter: invert(100%);
    }
    100% {
      transform: rotate3D(0, 0, 1, 1080deg);
    }
  }

  .logo .flat {
    animation-name: rotate;
    animation-duration: 2s;
    animation-direction: normal;
    animation-timing-function: ease-out; /* or: ease, ease-in, ease-in-out, linear, cubic-bezier(x1, y1, x2, y2) */
    animation-fill-mode: none; /* or: backwards, both, none */
  }
</style>
