<template>
  <div id="app">
     <cities-game />
  </div>
</template>

<script>
import CitiesGame from './components/CitiesGame'
export default {
  name: 'app',
  components: {
    CitiesGame
  }
}
</script>

<style lang="sass">
  body
    margin: 0
</style>
