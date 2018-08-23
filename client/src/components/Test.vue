<template lang='html'>
  <div>
    <pre>{{ input }}</pre>
    <textarea
      rows="6"
      cols="50"
      v-model="input"
      >
    </textarea>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: ''
    }
  }
}
</script>

<style lang='css' scoped>

</style>
