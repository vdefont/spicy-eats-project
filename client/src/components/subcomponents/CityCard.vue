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
  border: 1px solid #720300;
  background-color: #720300;
  color:white;
  display:flex;
  justify-content: center;
  align-items: center;
}
.desktop button {
  width: 180px;
  height: 100px;
  margin: 10px;
}
.mobile button {
  width: 110px;
  height: 70px;
  margin: 5px;
}

button:hover {
  background-color: white;
  color: #720300;
}
</style>
