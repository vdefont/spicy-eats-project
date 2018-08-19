<!--
In: inputData [], isExistingReview Boolean
Out: emit('review-form-submit', data)
 -->
<template lang="html">
  <custom-form
    :inputData="inputData"
    :inputs="reviewFormInputs"
    :noclear="true"
    @custom-form-submit="reviewButtonClicked($event)"
    >
    {{ isExistingReview ? 'Edit Review' : 'Add New Review' }}
  </custom-form>
</template>

<script>
import CustomForm from '@/components/subcomponents/form/CustomForm'

export default {
  name: 'review-form',
  props: {
    inputData: Object,
    isExistingReview: Boolean // Whether user is adding new review or editing old one
  },
  components: {
    CustomForm
  },
  data () {
    return {
      reviewFormInputs: [
        {
          label: 'Spiciness (1-5)',
          type: 'number',
          model: 'spiciness',
          validate: (spiciness) => /^[1-5]$/.test(spiciness),
          error: 'Enter whole number between 1 and 5'
        },
        {
          label: 'Overall Quality (1-5)',
          type: 'number',
          model: 'overallQuality',
          validate: (overallQuality) => /^[1-5]$/.test(overallQuality),
          error: 'Enter whole number between 1 and 5'
        },
        {
          label: 'Dishes Eaten',
          type: 'text',
          model: 'dishesEaten',
          validate: (dishesEaten) => dishesEaten.length > 4,
          error: 'Enter valid dishes'
        },
        {
          label: 'Description',
          type: 'textarea',
          model: 'description',
          validate: (description) => description.length >= 40,
          error: 'Enter at least 40 characters'
        },
        {
          label: 'Images (optional)',
          type: 'multi-image-caption',
          model: 'photos'
        }
      ]
    }
  },
  methods: {
    reviewButtonClicked: function (data) {
      this.$emit('review-form-submit', data)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
