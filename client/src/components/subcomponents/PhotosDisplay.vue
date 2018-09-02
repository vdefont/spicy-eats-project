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
  flex-flow: row wrap;
}
li {
  margin: 5px;
}
.desktop li {
  max-width: 500px;
}
.mobile li {
  max-width: 500px;
}
img {
  max-width: 100%;
}
.desktop img {
  max-height: 200px;
}
.mobile img {
  max-height: 160px;
}
</style>
