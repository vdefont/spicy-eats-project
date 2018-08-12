<template lang="html">
  <div></div>
</template>

<script>
export default {
  data () {
    return {
      lastRoute: null
    }
  },
  // Store the last URL
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.lastRoute = from.path
      next()
    })
  },
  watch: {
    lastRoute: function (lastRoute) {
      this.$store.commit('username', null)
      this.$router.push({ path: this.lastRoute })
    }
  }
}
</script>

<style lang="css">
</style>
