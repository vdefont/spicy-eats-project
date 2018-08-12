<!--
IN: [href]
OUT: $emit('custom-button-click')
 -->
<template lang="html">
  <span>
    <a
      v-if="href"
      :href="href"
      >
      <slot></slot>
    </a>
    <a
      v-else
      @click="$emit('custom-button-click')"
      >
      <slot></slot>
    </a>
  </span>

</template>

<script>
export default {
  name: 'custom-button',
  props: {
    href: String
  }
}
</script>

<style lang="css" scoped>
a {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #720300;
  color: #720300;
}

a:hover {
  background-color: #720300;
  color: white;
}
</style>
