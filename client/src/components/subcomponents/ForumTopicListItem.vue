<template lang="html">
  <li class="mainWrapper">
    <a :href="`/#/forumTopic/${forumPost.id}`">
      <ul>
        <li class="largeText red">
          {{ forumPost.title }}
        </li>
        <li>
          {{ formatDate(forumPost.createdAt) }}
        </li>
        <li>
          {{ forumPost.replies + (forumPost.replies == 1 ? " reply" : " replies") }}
        </li>
      </ul>
    </a>
  </li>
</template>

<script>
export default {
  name: 'forum-topic-list-item',
  props: {
    forumPost: Object
  }
}
</script>

<style lang="css" scoped>
.mainWrapper {
  border-top: 1px solid #720300;
}
</style>
