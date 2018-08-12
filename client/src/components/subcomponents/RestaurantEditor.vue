<!--
OUT: $emit('field-updated', {field, value})
 -->
<template lang="html">
  <ul>
    <li v-for="(fields, fieldName, key) in inputFields" :key="key">
      <input
        type="text"
        :placeholder="fields.inputText"
        v-model="fields.value"
        >
      <custom-button
        @custom-button-click="() => updateButtonClicked(fieldName)"
        >
        {{ fields.buttonText }}
      </custom-button>
      <div v-if="invalidInput === fieldName" class="red">
        {{ fields.error }}
      </div>
    </li>
  </ul>
</template>

<script>
import CustomButton from './CustomButton'

export default {
  name: 'restaurantEditor',
  components: {
    CustomButton
  },
  data () {
    return {
      invalidInput: '',
      inputFields: {
        name: {
          inputText: 'New Name',
          buttonText: 'Update Name',
          validate: (val) => val.length > 2,
          error: 'Enter Valid Name'
        },
        address: {
          inputText: 'New Address',
          buttonText: 'Update Address',
          validate: (val) => val.length > 10,
          error: 'Enter Valid Address'
        },
        website: {
          inputText: 'New Website',
          buttonText: 'Update Website',
          validate: (val) => val.length > 5,
          error: 'Enter Valid Website'
        },
        phoneNumber: {
          inputText: 'New Phone Number',
          buttonText: 'Update Phone Number',
          validate: (val) => val.length >= 10,
          error: 'Enter Valid Phone Number'
        },
        acceptsReservations: {
          inputText: 'Accepts Reservations?',
          buttonText: 'Update Reservation Policy',
          validate: (val) => val === 'Yes' || val === 'No',
          error: 'Enter "Yes" or "No"'
        },
        cuisine: {
          inputText: 'New Cuisine Type',
          buttonText: 'Add Cuisine',
          validate: (val) => val.length > 2,
          error: 'Enter Valid Cuisine'
        }
      }
    }
  },
  methods: {
    updateButtonClicked: function (fieldName) {
      var fields = this.inputFields[fieldName]
      var value = fields.value
      var validate = fields.validate
      var validInput = (value && validate(value))
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
