<!--
IN: photos array - [ {photo, caption}, ... ]
OUT: $emit('new-data', photos)
-->

<template lang="html">
  <div>
    <ul>
      <li
        v-for="(dummy, i) in photos.length"
        :key="i">
        <img
          class="photo"
          :src="photos[i].photo" alt=""
          >
        <input
          class="caption"
          placeholder="caption"
          v-model="photos[i].caption"
          @input="emitEvent"
          >
      </li>
    </ul>
    <div id="addImageLabel">
      Add image:
    </div>
    <div class="imageInputWrapper">
      <image-uploader
        ref="imageInput"
        :maxWidth="512"
        :maxHeight="512"
        :quality="0.7"
        :autoRotate=false
        :preview=false
        @input="imageUploaded">
      </image-uploader>
    </div>
  </div>
</template>

<script>
import CustomButton from './CustomButton'
import { ImageUploader } from 'vue-image-upload-resize'

export default {
  name: 'multi-image-caption-input',
  components: {
    CustomButton,
    ImageUploader
  },
  props: {
    inputPhotos: Array
  },
  data () {
    return {
      photos: []
    }
  },
  methods: {
    clearPhotosIfNull: function () {
      if (this.photos == null) this.photos = []
    },
    emitEvent: function () {
      this.$emit('new-data', this.photos)
    },
    imageUploaded: function (photo) {
      // Add photo to data
      var newPhoto = {}
      newPhoto.photo = photo
      newPhoto.caption = ''
      this.photos.push(newPhoto)

      // Clear new photo input - hacky way of doing it
      this.$refs.imageInput.$el.children[1].value = ''

      // Send event that data was changed
      this.emitEvent()
    }
  },
  mounted () {
    this.photos = this.inputPhotos
  }
}
</script>

<style lang="css" scoped>
ul {
  display: flex;
  flex-flow: row wrap;
}
li {
  max-width: 250px;
  margin: 5px;
}
.photo {
  max-width: 100%;
  max-height: 200px;
}
.caption {
  width: 95%
}
.imageInputWrapper {
  display: flex;
  width: 0px;
}
</style>
