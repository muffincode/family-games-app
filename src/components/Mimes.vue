<template>
  <div class="mimes">
    <h1 class="title">Tour de {{currentPlayer.name}}</h1>

    <div class="list">
      <ul>
        <li class="box" v-for="w in currentWordsList" :key="w.content">
          <p
            class="word title"
            :class="{ blurred: w.blurred}"
            @click="w.blurred = !w.blurred">{{ w.content }}
          </p>
          <div class="buttons" v-if="!w.bothFound && !w.blurred">
            <button
              class="button"
              :class="{ 'is-info': !w.guessedByLeft, 'is-light' : w.guessedByLeft }"
              @click="wordFoundBy(w, 0)"
              >
              {{ w.guessedByLeft ? 'Trouvé !' : 'Valider' }}
            </button>
            <button
              class="button"
              :class="{ 'is-danger': !w.guessedByRight, 'is-light' : w.guessedByRight }"
              @click="wordFoundBy(w, 1)"
              >
              {{ w.guessedByRight ? 'Trouvé !' : 'Valider' }}
            </button>
          </div>
        </li>
      </ul>
    </div>

<hr/>

    <pre style="text-align: left;">{{ players }}</pre>
    <hr/>
    <pre style="text-align: left;">{{ game }}</pre>

  </div>
</template>

<script>
import axios from "axios";

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default {
  name: 'MimesGame',
  data: function () {
    return {
      players: [],
      game: null,
      currentPlayer: {name: "?"},
      currentWordsList: []
    }
  },
  props: {
    gameCode: null
  },
  beforeCreate: function () {
    axios.get('http://localhost:3000' + '/players?gameCode=' + this.gameCode)
      .then(res => {
        this.players = res.data.filter(p => p.gameCode)
        this.decideNewPlayer()
      })
      .catch(err => console.log(err))
    axios.get('http://localhost:3000' + '/games?code=' + this.gameCode)
      .then(res => this.game = res.data)
      .catch(err => console.log(err))
  },
  methods: {
    wordFoundBy: function(word, leftOrRight){
      console.log(word, leftOrRight)
      if (!leftOrRight)
        word.guessedByLeft = true
      else word.guessedByRight = true
    },
    decideNewPlayer: function () {
      const haveNotPlayed = this.players.filter(p => !p.hasPlayed)
      this.currentPlayer = haveNotPlayed[randomIntFromInterval(0,haveNotPlayed.length-1)]
      this.currentWordsList = this.currentPlayer.wordsList.map(w => {
        return {
          content: w,
          blurred: false,
          guessedByLeft: false,
          guessedByRight: false,
          bothFound: false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list {
  .word {
    font-size: 300%;
    text-align: left;

    transition: color 0.2s, text-shadow 0.2s;
    transition-timing-function: ease-out;
  }
  .blurred {
    text-shadow: 0 0 25px black;
    color: transparent;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5em;

    transition: height 0.2s;
    transition-timing-function: ease-out;

    button {
      flex-grow: 1;
    }
  }
}
</style>
