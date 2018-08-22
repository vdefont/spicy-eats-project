<template lang="html">
  <li
    class="restaurantListItem"
    >
    <a :href="`/#/restaurant/${data.id}`">
      <ul>
        <li>
          <p class="largeText red">
            {{ data.name }}
          </p>
        </li>
        <li
          v-for="(fieldVal, fieldKey, key) in data"
          v-if="fieldVal != null && ['id', 'name', 'citiesId', 'createdAt', 'updatedAt'].indexOf(fieldKey) == -1"
          :key="key"
          >
          {{ camelCaseToLabel(fieldKey) + ": " + fieldVal }}
        </li>
      </ul>
    </a>
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
