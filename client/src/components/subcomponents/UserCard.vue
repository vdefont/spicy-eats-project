<!-- IN: user -->
<template lang="html">
  <a
    :href="`/#/user/${user.username}`"
    class="main_wrapper"
    >
    <div>
      <img v-if="user.photo" :src="user.photo">
      <img v-else src="/static/jalapenos.png">
      <p v-if="user.photo">photo</p>
      <p v-else>No photo</p>
    </div>
    <ul>
      <li>{{ user.name }}</li>
      <li>Reviews: {{ user.reviews }}</li>
      <li v-if="user.location">{{ user.location }}</li>
      <li v-if="user.age">Age: {{ user.age }}</li>
    </ul>
  </a>
</template>

<script>
export default {
  name: 'user-card',
  props: {
    user: Object
  }
}
</script>

<style lang="css" scoped>
.main_wrapper {
  display: flex;
  flex-flow: row nowrap;
}
ul {
  margin-left: 5px;
}
.desktop img {
  max-width:  150px;;
  max-height: 150px
}
.mobile img {
  max-width: 100px;
  max-height: 100px;
}
</style>
