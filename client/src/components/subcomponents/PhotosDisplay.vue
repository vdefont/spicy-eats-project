<template lang="html">
  <ul>
    <li v-for="(photo, key) in photos" :key="key">
      <img :src="photo.photo">
      <div class="caption">
        {{ photo.caption }}
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'photos-display',
  props: {
    photos: Array // {photo, caption}
  }
}
</script>

<style lang="css" scoped>
ul {
  display: flex;
}
li {
  margin: 5px;
  max-width: 250px;
}
img {
  max-width: 100%;
  max-height: 200px;
}
</style>
