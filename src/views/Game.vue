<template>
  <div class="game container">

    <div class="section" v-if="game.status == 'invalid'">
      <div class="notification is-danger">
        <p>La partie n'existe pas (ou plus) !</p>
      </div>
    </div>

    <div class="section" v-if="game.status == 'open'">
      <h2 class="title is-2">{{ game.name }} <span class="tag is-info is-light">{{ game.code }}</span></h2>

      <div v-if="!admin && !playerReady" class="notification is-info">
        <p><b>Ça commence bientôt!</b> Remplissez vos informations avant le début de la partie 😄<br/>
        <b>{{ otherPlayers.length }}</b> personnes déjà là !</p>
      </div>

      <div v-if="!admin && playerReady" class="notification is-success">
        <p><b>Parfait!</b> Vos infos ont bien été envoyées, vous pouvez les mettre à jour avant que ça commence.<br/>
        <b>{{ otherPlayers.length }}</b> personnes déjà là !</p>
      </div>

      <div v-if="admin" class="notification is-warning">
        <p class="content"><b>À vous de jouer!</b> Vous allez devoir lancer la partie quand tout le monde sera prêt !<br/>
        <i>Il y a pour l'instant <b>{{ otherPlayers.length }}</b> personnes</i>.</p>

        <div class="tags">
          <span v-for="p in otherPlayers" class="tag is-dark" :key="p.id">{{ p.name }}</span>
        </div>

        <div class="button is-danger" v-on:click="start">Lancer la partie 🎲</div>

      </div>

      <form class="box" style="margin-top: 1em;">
        <div :key="index" class="field">
          <label class="label">Votre prénom</label>
          <div class="control">
            <input type="text" v-model="name" placeholder="Camille" class="input"/>
          </div>
        </div>

        <hr/>

        <div v-for="index in game.nbWords" :key="index" class="field">
          <label class="label">Mot #{{index}}</label>
          <div class="control">
            <input type="text" v-model="words[index-1]" placeholder="Un mot qui vous inspire!" class="input"/>
          </div>
        </div>

        <div v-if="!playerReady" class="button is-success" v-on:click="send">
          Envoyer ✉️
        </div>

        <div v-if="playerReady" class="button is-info" v-on:click="send">
          Mettre à jour 🤓
        </div>

      </form>

    </div>

    <div class="section" v-if="game.status == 'running'">
      Partie en cours :)
    </div>

  </div>

</template>

<script>
import axios from "axios";

// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
const between = function (date1, date2) {
  return Date.now() > date1 && Date.now() < date2
}

export default {
  name: 'GameLobby',
  components: {
    //HelloWorld
  },
  data: function () {
    return {
      admin: 0,
      otherPlayers: [],

      index: 0,

      name: null,
      id: null,
      playerReady: false,

      game: {
        status: null,
      },
      words: []
    }
  },
  methods: {
    start: function () {
      this.game.status = "running"
      const updatedGame = this.game
      axios.put('http://localhost:3000' + `/games/${this.game.id}`, updatedGame)
        .then(response => {
          // Object is created, update view
          this.game.status = "created"
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    send: function () {
      // TODO check if form data is valid


      // Send or update players info
      const playerId = localStorage.getItem('playerId')

      axios({
        method: playerId ? 'put' : 'post', //if playerId exists, update, else post
        url: 'http://localhost:3000' + '/players/' + (playerId ? playerId : ''),
        data: {
          name: this.name,
          gameCode: this.game.code,
          wordsList: this.words
        }
      }).then(response => {
        console.log(response);
        localStorage.setItem('playerId', response.data.id);
        localStorage.setItem('playerName', this.name);
        this.playerReady = true
      })
      .catch(function (error) {
        localStorage.clear()
        alert('Une erreur est survenue, veuillez réessayer')
        console.log(error);
      });
    },
    updateGameInfo: function () {
      // Update player list
      axios.get('http://localhost:3000' + '/players?gameCode=' + this.game.code)
        .then(res => this.otherPlayers = res.data.filter(p => p.gameCode))
        .catch(err => console.log(err))
      // Update games info
      axios.get('http://localhost:3000' + '/games', {
        params: {
          code: this.$route.params.id
        }
      })
      .then(response => {
        this.game = response.data[0]
        this.game.nbWords = parseInt(response.data[0].nbWords)
        if (this.game.status != "running" && between(this.game.dateCreated, this.game.validUntil)) {
          this.game.status = "open"

          switch (this.game.mode){
            case "mimes":
              this.game.name =  "Mimes"
              break;
          }
        } else if (this.game.status != "running"){
          this.game.status = "invalid"
        }
      })
      .catch(err => console.log(err))
    }
  },
  mounted: function () {
    this.admin = this.$route.query.admin

    this.name = localStorage.getItem('playerName')
    this.id = localStorage.getItem('playerId')
    /*if (this.id) {

    }*/

    this.updateGameInfo();
    setInterval(this.updateGameInfo, 3000);
  }
}
</script>

<style lang="scss">
form {
  text-align: left;
}
.tags {
  margin-top:0.5rem;
  margin-bottom: 0.5rem;
  display:flex;
  justify-content: center!important;
}
</style>
