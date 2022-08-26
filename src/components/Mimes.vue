<template>
  <div class="container mimes">
    <h1 class="title">Tour de {{currentPlayer.name}}</h1>

    <!--
    <div class="notification is-primary">
      <p><b>Manche terminée!</b><br/>L'équipe bleue gagne 🥳</p><br/>
      <button class="button is-primary is-light is-small">Manche suivante</button>
    </div>
  -->

    <div class="list">
      <ul>
        <li class="box" v-for="w in currentWordsList" :key="w.content"
        :class="{ 'found': w.guessedByLeft && w.guessedByRight }">
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

function randomInt(seed,max) { // min and max included
  return parseInt(seed%max)
  //return Math.floor(Math.random() * (max - min + 1) + min)
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
    },
    decideNewPlayer: function () {
      const haveNotPlayed = this.players.filter(p => !p.hasPlayed)
      this.currentPlayer = haveNotPlayed[randomInt(this.game.dateCreated/haveNotPlayed.length, haveNotPlayed.length)]
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
  .box.found{ /* to do : reduced (when found, auto reduce)*/
    font-size: 10px;
    .buttons { display: none; }
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
    margin-bottom: 0.5em;

    transition: height 0.2s;
    transition-timing-function: ease-out;

    button {
      flex-grow: 1;
    }
  }
}
</style>
