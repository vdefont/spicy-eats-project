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
    <image-upload
      @image-uploaded="imageUploaded">
    </image-upload>
  </div>
</template>

<script>
import CustomButton from '@/components/subcomponents/CustomButton'
import ImageUpload from '@/components/subcomponents/form/ImageUpload'

export default {
  name: 'multi-image-caption-input',
  components: {
    CustomButton,
    ImageUpload
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
</style>
