<template>
  <div class="block card">
    <div class="card-content" :class="colour">
      <span
        class="tag is-small is-light is-rounded"
        :class="{ 'is-info': colour=='blue', 'is-danger': colour=='red' }"
      >
        {{ index }} / {{ words.length }}
      </span>

      <h1 class="title is-1"
        :class="{'blurred': blurred}"
        @click="blurred = !blurred">
        {{ word }}
      </h1>

      <div class="buttons">
        <button class="button is-rounded"
          :class="{ 'is-info': colour=='blue', 'is-danger': colour=='red' }"
          @click="blurred = !blurred">
          {{ blurred ? "Afficher" : "Masquer" }}
        </button>

        <button class="button is-rounded is-light"
          :class="{ 'is-info': colour=='blue', 'is-danger': colour=='red' }"
          @click="$emit('next')"
          :disabled="index == words.length">
          {{ index == words.length ? "Terminé 🥳" : "Suivant" }}
        </button>

      </div>
    </div>
  </div>
</template>

<script>
//import axios from "axios";

export default {
  name: 'CardItem',
  data: function () {
    return {
      blurred: false
    }
  },
  components: {
  },
  computed: {
    word: function() {
      if (this.index == this.words.length) return this.words[this.index-1]
      return this.words[this.index]
    }
  },
  props: {
    colour: {
      type: String,
      default: 'primary'
    },
    words: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    }
  },
  beforeCreate: function () {

  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.card {
  h1 {
    color: white;
    transition: color 0.2s, text-shadow 0.2s;
    transition-timing-function: ease-out;
    font-size: 12vw;
    margin: 0.5em 0;
  }
  h1.blurred {
    text-shadow: 0 0 20px white;
    color: transparent;
  }
  .blue{
    background: #3e8ed0;
  }
  .red {
    background: #f14668;
  }
  .buttons {
    justify-content: flex-end;
  }
}

</style>
