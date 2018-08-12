<template lang='html'>
  <div>
    <restaurant-editor
      @field-updated="fieldUpdated">
    </restaurant-editor>
  </div>
</template>

<script>
import RestaurantEditor from './subcomponents/RestaurantEditor'

export default {
  name: 'Test',
  components: {
    RestaurantEditor
  },
  methods: {
    fieldUpdated: function ($event) {
      var field = $event.field
      var value = $event.value
      console.log(field + ': ' + value)
    }
  }
}
</script>

<style lang='css'>
</style>
