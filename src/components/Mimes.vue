<template>
  <div class="container mimes">
    <h1 class="title" v-if="!displayScoreboard">Tour de {{currentPlayer.name}}</h1>

    <!-- Before the game -->
    <div class="content" v-if="!playing && !displayScoreboard">
      <div class="notification is-info">
        <p><b>L'équipe bleue</b> est composée<br/>des personnes suivantes:</p>
        <div class="tags">
          <span v-for="p in team1" :key="p.id" class="tag is-info is-light is-small">{{p.name}}</span>
        </div>
      </div>

      <div class="notification is-danger">
        <p><b>L'équipe rouge</b> est composée<br/>des personnes suivantes:</p>
        <div class="tags">
          <span v-for="p in team2" :key="p.id" class="tag is-danger is-light is-small">{{p.name}}</span>
        </div>
      </div>

      <button class="button is-primary" @click="playing = true">Tout le monde est en place !</button>

    </div>

    <!-- Done ! -->
    <div class="notification is-primary" v-if="roundDone">
      <p><b>{{ lastRound ? 'Partie' : 'Manche' }} terminée!</b><br/>L'équipe {{ winner }} gagne 🥳</p><br/>
      <button class="button is-primary is-light is-small" @click="done">
        {{ lastRound ? 'Voir les scores' : 'Manche suivante' }}
      </button>
    </div>

    <!-- Currently playing -->
    <div class="block list" v-if="playing && !displayScoreboard">
      <CardItem colour="blue" :words="currentWordsList" :index="status.left" @next="status.left++"/>
      <CardItem colour="red" :words="currentWordsList" :index="status.right" @next="status.right++"/>
    </div>

    <div class="block" v-if="displayScoreboard">
      <h1 class="title is-1">Scores</h1>
      <ul>
        <li v-for="(p, index) in players" :key="p.id"
          class="notification"
          :class="{ 'is-warning': index === 0, 'is-danger': index===players.length-1 }"
          style="display:flex; justify-content:space-between;">
          <b>{{ index===0? '🏆' : ''}} {{p.name}}</b><span>{{p.score}} points</span>
        </li>
      </ul>
      <hr/>
      <a href="/">
        <button class="button is-light">Retour</button>
      </a>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import CardItem from '@/components/CardItem.vue'

function randomInt(seed,max) {
  return parseInt(seed%max)
  //return Math.floor(Math.random() * (max - min + 1) + min) // min and max included
}

export default {
  name: 'MimesGame',
  data: function () {
    return {
      playing: false,
      lastRound: false,
      displayScoreboard: false,
      players: [],
      game: null,
      currentPlayer: {name: "?"},
      currentWordsList: [],
      team1: [],
      team2: [],
      status: { left: 0, right: 0 },
      admin: this.$route.query.admin,
    }
  },
  components: {
    CardItem
  },
  computed: {
    roundDone: function () {
      return !this.displayScoreboard &&
        (this.status.left == this.currentWordsList.length || this.status.right == this.currentWordsList.length)
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
    done: function () {
      this.currentPlayer.hasPlayed = true
      this.updateScoreboard()
      axios.put('http://localhost:3000' + `/players/${this.currentPlayer.id}`, this.currentPlayer)
      .then(res => {
        this.$router.go() // reload page to trigger player update
        console.log(res)
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    decideNewPlayer: function () {
      const haveNotPlayed = this.players.filter(p => !p.hasPlayed)
      if(haveNotPlayed.length == 1) {
        this.lastRound = true
      }
      if(haveNotPlayed.length == 0) {
        this.displayScoreboard = true
        return
      }

      this.currentPlayer = haveNotPlayed[randomInt(this.game.dateCreated/haveNotPlayed.length, haveNotPlayed.length)]
      this.currentWordsList = this.currentPlayer.wordsList

      this.decideTeams()
    },
    decideTeams: function() {
      this.team1 = []
      this.team2 = []

      let players = [...this.players]
      let indexOfCurrentPlayer = this.players.findIndex(p => p.id == this.currentPlayer.id)
      players.splice(indexOfCurrentPlayer, 1)

      while(players.length > parseInt(this.players.length/2)) {
        // shuffle array
        for(let i = players.length - 1; i >= 1; i--) {
          let j = Math.floor(Math.random() * (i + 1)); // 0 <= j <= i
          let temp = players[j];
          players[j] = players[i];
          players[i] = temp;
        }
        // add one to team
        this.team1.push(players.pop())
      }
      this.team2 = players
    },
    updateScoreboard: function() {
      if (this.status.left == this.currentWordsList.length) {
        this.team1.forEach(winner => {
          let w = this.players.find(p => winner.id == p.id)
          axios.patch('http://localhost:3000' + `/players/${w.id}`, { score: w.score+1 })
        })
      } else {
        this.team2.forEach(winner => {
          let w = this.players.find(p => winner.id == p.id)
          axios.patch('http://localhost:3000' + `/players/${w.id}`, { score: w.score+1 })
        })
      }
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
