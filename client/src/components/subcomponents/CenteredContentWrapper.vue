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
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.desktop .outer {
  width: 100%;
}
.mobile .outer {
  width: 97%;
  margin: 0px auto;
}
.inner {
  flex-basis: 600px;
  flex-shrink: 1;
}
</style>
