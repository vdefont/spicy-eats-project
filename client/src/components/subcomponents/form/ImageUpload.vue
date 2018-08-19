<!-- OUT: emit('image-uploaded', image) -->
<template lang="html">
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
</template>

<script>
import { ImageUploader } from 'vue-image-upload-resize'

export default {
  name: 'image-upload',
  components: {
    ImageUploader
  },
  methods: {
    imageUploaded: function (photo) {
      this.$emit('image-uploaded', photo)
      // Clear new photo input - hacky way of doing it
      this.$refs.imageInput.$el.children[1].value = ''
    }
  }
}
</script>

<style lang="css" scoped>
.imageInputWrapper {
  display: flex;
  width: 0px;
}
</style>
