<template lang="html">
  <li class="reviewListItem">
    <ul>
      <li v-if="!noUserInfo">
        <user-card :user="review.user">
        </user-card>
      </li>
      <li>{{ formatDate(review.createdAt) }}</li>
      <li>Spiciness: {{ review.spiciness }}/5</li>
      <li>Overall Quality: {{ review.overallQuality }}/5</li>
      <li>Dishes eaten: {{ review.dishesEaten }}</li>
      <li class="reviewText">
        <pre>{{ review.description }}</pre>
      </li>
      <li>
        <photos-display :photos="review.photos">
        </photos-display>
      </li>
    </ul>
  </li>
</template>

<script>
import PhotosDisplay from '@/components/subcomponents/PhotosDisplay'
import UserCard from '@/components/subcomponents/UserCard'

export default {
  name: 'review-list-item',
  components: {
    PhotosDisplay,
    UserCard
  },
  props: {
    review: Object,
    noUserInfo: Boolean
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
