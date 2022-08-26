<template>
  <div class="container mimes">
    <h1 class="title">Tour de {{currentPlayer.name}}</h1>

    <!-- Before the game -->
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

    <!-- Done ! -->
    <div class="notification is-primary" v-if="roundDone">
      <p><b>Manche terminée!</b><br/>L'équipe {{ winner }} gagne 🥳</p><br/>
      <button class="button is-primary is-light is-small">Manche suivante</button>
    </div>

    <!-- Currently playing -->
    <div class="block list" v-if="playing">
      <CardItem colour="blue" :words="currentWordsList" :index="status.left" @next="status.left++"/>
      <CardItem colour="red" :words="currentWordsList" :index="status.right" @next="status.right++"/>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import CardItem from '@/components/CardItem.vue'

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
      status: { left: 0, right: 0 },
      admin: this.$route.query.admin
    }
  },
  components: {
    CardItem
  },
  computed: {
    roundDone: function () {
      return this.status.left == this.currentWordsList.length || this.status.right == this.currentWordsList.length
    },
    winner: function () {
      return this.status.left == this.currentWordsList.length ? 'bleue' : 'rouge'
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
    decideNewPlayer: function () {
      /* delete this vvv */
      const haveNotPlayed = this.players.filter(p => !p.hasPlayed)
      this.currentPlayer = haveNotPlayed[randomInt(this.game.dateCreated/haveNotPlayed.length, haveNotPlayed.length)]
      /* delete this ^^^ */
      this.currentWordsList = this.currentPlayer.wordsList
      /*this.currentWordsList = this.currentPlayer.wordsList.map((w, i) => {
        return {
          content: w,
          id: i,
        }
      })*/
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
