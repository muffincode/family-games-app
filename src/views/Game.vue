<template>
  <div class="game container">

    <div class="section" v-if="game.status == 'invalid'">
      <div class="notification is-danger">
        <p>La partie n'existe pas (ou plus) !</p>
      </div>
    </div>

    <div class="section" v-if="game.status == 'running'">
      <h2 class="title is-2">{{ game.name }} <span class="tag is-info is-light">{{ game.code }}</span></h2>

      <div class="notification is-info">
        <p><b>Ça commence bientôt!</b> Remplissez vos informations avant le début de la partie 😄</p>
      </div>

      <form>
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

        <div class="button is-success" v-on:click="update">
          Valider
        </div>

      </form>

    </div>
  </div>

</template>

<script>
import axios from "axios";

// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'GameLobby',
  components: {
    //HelloWorld
  },
  data: function () {
    return {
      index: 0,
      name: null,
      game: {
        status: null,
      },
      words: [

      ]
    }
  },
  methods: {
    update: function () {
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
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted: function () {
    this.name = localStorage.getItem('playerName')
    axios.get('http://localhost:3000' + '/games', {
      params: {
        code: this.$route.params.id
      }
    })
    .then(response => {
      this.game = response.data[0]
      this.game.nbWords = parseInt(response.data[0].nbWords)

      // Game is valid, we can fetch data
      if (Date.now() > this.game.dateCreated && Date.now() < this.game.validUntil) {
        this.game.status = "running"
        switch (this.game.mode){
          case "mimes":
            this.game.name =  "Mimes"
            break;
        }
      } else {
        this.game.status = "invalid"
      }
    })
    .catch(error => {
      console.log(error);
      this.game.status = "invalid"
    })
    .then(function () {
      // always executed
    });
  }
}
</script>

<style lang="scss">
form {
  text-align: left;
}
</style>
