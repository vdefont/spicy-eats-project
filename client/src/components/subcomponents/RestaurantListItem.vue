<template lang="html">
  <li
    class="restaurantListItem"
    >
    <ul>
      <li>
        <a
          v-bind:href="`/#/restaurant/${data.id}`"
          class="largeText red"
          >
          {{ data.name }}
        </a>
      </li>
      <li
        v-for="(fieldVal, fieldKey, key) in data"
        v-if="fieldVal != null && ['id', 'name', 'citiesId', 'createdAt', 'updatedAt'].indexOf(fieldKey) == -1"
        :key="key"
        >
        {{ camelCaseToLabel(fieldKey) + ": " + fieldVal }}
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'restaurant-list-item',
  props: {
    data: Object
  }
}
</script>

<style lang="css" scoped>
.restaurantListItem {
  max-width: 600px;
  border-top: 1px solid grey;
}
</style>
