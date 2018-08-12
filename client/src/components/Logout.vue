<template lang="html">
  <div></div>
</template>

<script>
export default {
  mounted () {
    this.$store.commit('username', null)
    this.$router.push({ path: '/' })
  }
}
</script>

<style lang="css">
</style>
