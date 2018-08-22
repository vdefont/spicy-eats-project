<!-- IN: user -->
<template lang="html">
  <a
    :href="`/#/user/${user.username}`"
    class="main_wrapper"
    >
    <div>
      <img v-if="user.photo" :src="user.photo">
      <img v-else src="/static/logo.png">
    </div>
    <ul>
      <li>{{ user.name }}</li>
      <li>{{ user.reviews + (user.reviews == 1 ? ' review' : ' reviews') }}</li>
      <li v-if="user.location">Location: {{ user.location }}</li>
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
  max-width:  75px;;
  max-height: 75px
}
.mobile img {
  max-width: 75px;
  max-height: 75px;
}
</style>
