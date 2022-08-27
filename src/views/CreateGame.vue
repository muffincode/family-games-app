<template>
  <div class="game-creation section">
    <div class="container">
      <div class="block card" v-if="game.status != 'created'">
        <div class="card-content">
          <h2 class="title is-3">Créer une partie</h2>
          <form class="form">

            <div class="field">
              <label class="label">Mode de jeu</label>
              <div class="select">
                <select v-model="game.mode">
                  <option value="0">Sélectionner un mode de jeu</option>
                  <option value="mimes">Mimes en équipes</option>
                  <option value="mdp">(Mot de passe)</option>
                  <option value="timesup">(Time's up)</option>
                </select>
              </div>
            </div>

            <div class="field">
              <label class="label">Nombre de mots</label>
              <div class="select" v-if="game.mode == 'mimes'">
                <select v-model="game.nbWords">
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>

            <div class="button is-primary" v-on:click="createGame">
              Créer
            </div>

          </form>
        </div>
      </div>
    </div>

    <div class="container" v-if="game.status == 'created'">
      <div class="notification is-primary">
        <p>La partie a été créée avec succès !</p>
        <b class="title is-2">{{ game.code }}</b>
      </div>

      <button class="button is-info" v-on:click="join">
        Rejoindre
      </button>
    </div>
  </div>

</template>

<script>
import axios from "axios";

// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'CreateGame',
  components: {
    //HelloWorld
  },
  data: function () {
    return {
      game: {
        code: 0,
        mode: "mimes",
        nbWords: 5,
        status: "pending"
      },
    }
  },
  methods: {
    createGame : function () {
      // Set game info (date and code to join)
      const now = Date.now()
      this.game.code = Math.floor(Math.random() * 10000)
      // Post to API
      axios.post('http://localhost:3000' + '/games', {
          dateCreated: now,
          code: this.game.code,
          status: this.game.status,
          mode: this.game.mode,
          nbWords: this.game.nbWords,
          minPlayers: 5, // TODO change depending on game mode
          validUntil: new Date().setTime(now + 12 /*hour*/ * 60 * 60 * 1000),
        })
        .then(response => {
          // Object is created, update view TODO check if needed?
          this.game.status = "created"
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    join : function () {
      this.$router.push(`/game/${this.game.code}?admin=1`)
    }
  }
}
</script>

<style lang="scss">
</style>
