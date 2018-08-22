<!--
IN: inputData, isExistingPost, isTopic
OUT: emit('form-submit', data)
 -->
<template lang="html">
  <custom-form
    :inputs="isTopic ? topicInputs : replyInputs"
    :inputData="data"
    @custom-form-submit="formSubmitted($event)"
    >
    {{ (isExistingPost ? 'Edit' : 'Create New') + ' ' + (isTopic ? 'Topic' : 'Reply') }}
  </custom-form>
</template>

<script>
import CustomForm from '@/components/subcomponents/form/CustomForm'

export default {
  name: 'forum-post-form',
  components: {
    CustomForm
  },
  props: {
    inputData: Object, // Pre-existing data
    isExistingPost: Boolean,
    isTopic: Boolean // Whether it is a topic, or a reply to a topic
  },
  data () {
    return {
      data: {},
      replyInputs: [
        {
          type: 'textarea',
          model: 'description',
          validate: (val) => val.length >= 10,
          error: 'Enter at least 10 characters'
        },
        {
          type: 'multi-image-caption',
          model: 'photos',
          label: 'Photos'
        }
      ]
    }
  },
  computed: {
    topicInputs: function () {
      var topicInputsOnly = [
        {
          type: 'text',
          label: 'Topic Title',
          model: 'title',
          validate: (val) => val.length >= 10,
          error: 'Enter at least 10 characters'
        }
      ]
      return (topicInputsOnly.concat(this.replyInputs))
    }
  },
  methods: {
    formSubmitted: function (data) {
      console.log('submitted')
      this.$emit('form-submit', data)
    }
  },
  mounted () {
    this.data = this.inputData
  }
}
</script>

<style lang="css">
</style>
