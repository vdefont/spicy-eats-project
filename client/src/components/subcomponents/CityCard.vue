<template lang="html">
  <button
    @click="clicked"
    class="largeText"
    >
    {{ city.name }}
  </button>
</template>

<script>
export default {
  name: 'city-card',
  props: [
    'city'
  ],
  methods: {
    clicked: function () {
      this.$emit('city-card-clicked')
      var path = `/city/${this.city.id}`
      this.$router.push({ path: path })
    }
  }
}
</script>

<style lang="css" scoped>
button {
  margin: 10px;
  border: 1px solid #720300;
  background-color: #720300;
  width: 180px;
  height: 100px;
  color:white;
  display:flex;
  justify-content: center;
  align-items: center;
}

button:hover {
  background-color: white;
  color: #720300;
}
</style>
