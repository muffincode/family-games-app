<template>
  <div class="container mimes">
    <h1 class="title">Tour de {{currentPlayer.name}}</h1>

    <div class="content" v-if="!playing">
      <div class="notification is-info">
        <p><b>L'équipe bleue</b> est composée<br/>des personnes suivantes:</p>
        <div class="tags">
          <span class="tag is-info is-light is-small">Camille</span>
          <span class="tag is-info is-light is-small">Constan</span>
          <span class="tag is-info is-light is-small">Léo</span>
        </div>
      </div>

      <div class="notification is-danger">
        <p><b>L'équipe rouge</b> est composée<br/>des personnes suivantes:</p>
        <div class="tags">
          <span class="tag is-danger is-light is-small">Annick</span>
          <span class="tag is-danger is-light is-small">Mary</span>
        </div>
      </div>

      <button class="button is-primary" @click="playing = true">Tout le monde est en place !</button>

    </div>

    <div class="block list" v-if="playing">
      <ul>
        <li class="box" v-for="w in currentWordsList" :key="w.id"
        :class="{ 'small': (w.guessedByLeft && w.guessedByRight) || w.blurred }">
          <p
            class="word title"
            :class="{ blurred: w.blurred || !admin}"
            @click="w.blurred = !w.blurred">{{ w.content }}
          </p>
          <div class="buttons">
            <button
              class="button is-info"
              :class="{ 'is-light' : !w.guessedByLeft, 'is-small' : w.guessedByLeft && w.guessedByRight }"
              @click="wordFoundBy(w, 0)"
              :disabled="w.disabled || !admin"
              >
              {{ w.guessedByLeft ? 'Trouvé !' : 'Valider' }}
            </button>
            <button
              class="button is-danger"
              :class="{ 'is-light' : !w.guessedByRight, 'is-small' : w.guessedByLeft && w.guessedByRight }"
              @click="wordFoundBy(w, 1)"
              :disabled="w.disabled || !admin"
              >
              {{ w.guessedByRight ? 'Trouvé !' : 'Valider' }}
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div class="notification is-primary" v-if="roundDone">
      <p><b>Manche terminée!</b><br/>L'équipe {{ winner }} gagne 🥳</p><br/>
      <button class="button is-primary is-light is-small">Manche suivante</button>
    </div>

  </div>
</template>

<script>
import axios from "axios";

function randomInt(seed,max) { // min and max included
  return parseInt(seed%max)
  //return Math.floor(Math.random() * (max - min + 1) + min)
}

export default {
  name: 'MimesGame',
  data: function () {
    return {
      playing: false,
      players: [],
      game: null,
      currentPlayer: {name: "?"},
      currentWordsList: [],
      admin: this.$route.query.admin
    }
  },
  computed: {
    roundDone: function () {
      return this.currentWordsList.at(-1).guessedByLeft || this.currentWordsList.at(-1).guessedByRight
    },
    winner: function () {
      return this.currentWordsList.at(-1).guessedByLeft ? 'bleue' : 'rouge'
    }
  },
  props: {
    gameCode: null
  },
  beforeCreate: function () {
    Promise.all([
      axios.get('http://localhost:3000' + '/players?gameCode=' + this.gameCode),
      axios.get('http://localhost:3000' + '/games?code=' + this.gameCode)
    ]).then(async([players, games]) => {
      this.players = players.data.filter(p => p.gameCode)
      this.game = games.data[0]
      this.decideNewPlayer()
    }).catch(error => {
      console.log(error);
    });
  },
  methods: {
    wordFoundBy: function(word, leftOrRight){
      console.log(word, leftOrRight)
      if (!leftOrRight)
        word.guessedByLeft = true
      else word.guessedByRight = true

      this.currentWordsList[word.id + 1].disabled = false;
      this.currentWordsList[word.id + 1].blurred = false;
    },
    decideNewPlayer: function () {
      const haveNotPlayed = this.players.filter(p => !p.hasPlayed)
      this.currentPlayer = haveNotPlayed[randomInt(this.game.dateCreated/haveNotPlayed.length, haveNotPlayed.length)]
      this.currentWordsList = this.currentPlayer.wordsList.map((w, i) => {
        return {
          content: w,
          id: i,
          blurred: true,
          guessedByLeft: false,
          guessedByRight: false,
          disabled: true
        }
      })
      this.currentWordsList[0].disabled = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list {
  .box.small{ /* to do : reduced (when found, auto reduce)*/
    font-size: 10px;
    display: flex;
    justify-content: space-between;
    p { margin: 0;}
  }
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

    transition: height 0.2s;
    transition-timing-function: ease-out;

    button {
      flex-grow: 1;
    }
  }
}
</style>
