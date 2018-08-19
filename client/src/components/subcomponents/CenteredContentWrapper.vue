<!-- Centers the content within it -->
<template lang="html">
  <div class="outer">
    <div class="inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'centered-content-wrapper'
}
</script>

<style lang="css" scoped>
.outer {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.inner {
  flex-basis: 600px;
  flex-shrink: 1;
}
</style>
