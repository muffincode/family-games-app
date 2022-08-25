<template>
  <div class="home container">
    <div class="section">
      <h1 class="title is-1">Lock&</h1>
      <hr/>
      <div class="block">
        <h2 class="title is-3">Rejoindre une partie</h2>

        <div class="field">
          <label class="label">Code de la partie</label>
          <div class="control">
            <input type="text" v-model="code" placeholder="Par exemple: 4562" class="input"/>
          </div>
        </div>
        <button class="button is-primary">Rejoindre</button>
      </div>

      <hr/>

      <div class="block">
        <h2 class="title is-3">Créer une partie</h2>
        <a href="/create">
          <button class="button is-info">Créer</button>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    //HelloWorld
  },
  data: function () {
    return {
      code: null,
    }
  }
}
</script>

<style lang="scss">
.section {
  max-width:800px;
}
</style>
