<template lang="html">
  <li class="reviewListItem">
    <ul>
      <li>{{ review.user.name }}, {{ formatDate(review.createdAt) }}</li>
      <li>Spiciness: {{ review.spiciness }}/5</li>
      <li>Overall Quality: {{ review.overallQuality }}/5</li>
      <li>Dishes eaten: {{ review.dishesEaten }}</li>
      <li class="reviewText">{{ review.description }}</li>
      <li>
        <photos-display :photos="review.photos">
        </photos-display>
      </li>
    </ul>
  </li>
</template>

<script>
import PhotosDisplay from './PhotosDisplay'

export default {
  name: 'review-list-item',
  components: {
    PhotosDisplay
  },
  props: {
    review: Object
  },
  methods: {
    // Initially "2018-08-06T16:19:35.000Z"
    formatDate: function (dateStr) {
      return dateStr.slice(0, 10)
    }
  }
}
</script>

<style lang="css" scoped>
.reviewListItem {
  max-width: 600px;
  border-top: 1px solid grey;
}
.reviewText {
  margin: 10px 0px;
}
</style>
