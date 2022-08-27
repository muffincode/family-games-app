<template>
  <!--
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/create">Create</router-link>
  </nav>
-->
  <router-view/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');

html, body {
  background: #EADEDA;
}
#app {
  .title, .label {
    font-family: "Playfair Display", sans-serif;
  }
  .notification {
    text-align: center;
  }
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
