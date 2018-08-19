<!--
IN: inputFields []: {type, prompt, buttonText, validate, error}
OUT: $emit('field-updated', {field, value})
 -->
<template lang="html">
  <ul>
    <li v-for="(field, fieldName, key) in inputFields" :key="key">
      <div v-if="field.type=='image'">
        <div>{{ field.prompt }}</div>
        <image-upload
          v-if="field.type == 'image'"
          @image-uploaded="(photo) => imageUploaded(fieldName, photo)"
          >
          {{ field.prompt }}
        </image-upload>
      </div>
      <textarea
        v-else-if="field.type == 'textarea'"
        rows="6"
        :placeholder="field.prompt"
        v-model="field.value"
        >
      </textarea>
      <input
        v-else
        :type="field.type"
        :placeholder="field.prompt"
        v-model="field.value"
        >

      <custom-button
        v-if="field.type != 'image'"
        @custom-button-click="() => updateButtonClicked(fieldName)"
        >
        {{ field.buttonText }}
      </custom-button>
      <div v-if="invalidInput === fieldName" class="red">
        {{ field.error }}
      </div>
    </li>
  </ul>
</template>

<script>
import CustomButton from '@/components/subcomponents/CustomButton'
import ImageUpload from '@/components/subcomponents/form/ImageUpload'

export default {
  name: 'field-editor',
  components: {
    CustomButton,
    ImageUpload
  },
  props: {
    inputFields: Object // fieldName -> {type, prompt, buttonText, validate, error}
  },
  data () {
    return {
      invalidInput: ''
    }
  },
  methods: {
    imageUploaded: function (fieldName, photo) {
      var update = {}
      update.field = fieldName
      update.value = photo
      this.$emit('field-updated', update)
    },
    updateButtonClicked: function (fieldName) {
      var fields = this.inputFields[fieldName]
      var value = fields.value
      var validate = fields.validate
      var validInput = value && (!validate || validate(value))
      if (!validInput) {
        this.invalidInput = fieldName
      } else {
        this.invalidInput = ''

        // Clear field
        this.inputFields[fieldName].value = ''

        // Emit event
        var update = {}
        update.field = fieldName
        update.value = value
        this.$emit('field-updated', update)
      }
    }
  }
}
</script>

<style lang="css" scoped>
li {
  display: flex;
}
li > * {
  margin: 2px;
}
</style>
