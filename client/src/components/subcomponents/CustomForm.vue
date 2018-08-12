<!--
INPUT:
- inputs: Array, {type, label, model [, validate, error]}
- [error: String]
- [noclear: Boolean]
- [inputData: Object]
OUTPUT: $emit('custom-form-submit', formData)
 -->
<template lang="html">
  <div class="wrapper">
    <div class="custom-form-main">

      <div class="largeText">
        <slot></slot>
      </div>

      <div v-for="(input, key) in inputs" :key="key" class="formInput">
        <label>
          {{ input.label }}

          <div
            v-if="input.type == 'textarea'"
            >
            <textarea rows="6" v-model="formData[input.model]"></textarea>
          </div>

          <multi-image-caption-input
            v-else-if="input.type == 'multi-image-caption'"
            :inputPhotos="inputData[input.model] ? inputData[input.model] : []"
            @new-data="formData[input.model] = $event"
            >
          </multi-image-caption-input>

          <input
            v-else
            :type="input.type"
            v-model="formData[input.model]"
            >
        </label>
        <div
          v-if="input.model in invalidInputs"
          class="red">
          {{ input.error }}
        </div>
      </div>

      <custom-button class="submitButton" @custom-button-click="submitClicked">
        Submit
      </custom-button>
      <div v-if="error" class="red">{{ error }}</div>

    </div>
  </div>
</template>

<script>
import CustomButton from './CustomButton'
import MultiImageCaptionInput from './MultiImageCaptionInput'

export default {
  name: 'custom-form',
  components: {
    CustomButton,
    MultiImageCaptionInput
  },
  props: {
    inputs: Array, // Each input is object w/ properties: "type", "label", "model" [, "validate", "error"]
    error: {
      type: String,
      default: ''
    },
    noclear: {
      type: Boolean,
      default: false
    },
    inputData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      formData: {},
      invalidInputs: {}
    }
  },
  methods: {
    validateData: function () {
      var invalidInputs = {}
      var validationPassed = true

      // Check each input
      for (var i in this.inputs) {
        var input = this.inputs[i]
        if ('validate' in input) {
          // Get input value and validation
          var validate = input.validate
          var model = input.model
          var value = model in this.formData ? this.formData[model] : null

          // Check input validation
          var curValidationPassed = (value && validate(value))
          if (!curValidationPassed) {
            invalidInputs[model] = 1
            validationPassed = false
          }
        }
      }

      // Save invalid inputs
      this.invalidInputs = invalidInputs

      return validationPassed
    },
    submitClicked: function () {
      // Get and clear data
      var formData = this.formData

      // Check validation
      var validationPassed = this.validateData()

      // If there was data, send to parent
      if (validationPassed && formData !== {}) {
        if (!(this.noclear)) this.formData = {}
        this.$emit('custom-form-submit', formData)
      }
    }
  },
  mounted () {
    this.formData = this.inputData
  }
}
</script>

<style lang="css" scoped>
.wrapper {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.custom-form-main {
  padding: 10px;
  border: 1px solid #720300;
  display: inline-flex;
  flex-flow: column nowrap;
  align-items: flex-start;
}
.formInput {
  width: 100%;
  margin: 2px 0px;
}
label {
  width: 100%;
}
textarea {
  width: 100%;
}
.submitButton {
  margin-top: 5px;
}
</style>
