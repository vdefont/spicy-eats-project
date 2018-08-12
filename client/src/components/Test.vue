<template lang='html'>
  <div>
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

<style lang='css' scoped>
div {
  background-color: yellow;
}
.desktop div {
  width: 200px;
  height: 200px;
}
.mobile div {
  width: 100px;
  height: 200px;
}
</style>
