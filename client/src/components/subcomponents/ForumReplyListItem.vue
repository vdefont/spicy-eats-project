<!--
IN: forumPost, depth
OUT: emit('reply-created', data)
 -->
<template lang="html">
  <li class="mainWrapper">
    <div
      class="spacer"
      v-for="i in depthArr"
      :key="i"
      >
    </div>
    <div class="forumPost">
      <p v-if="forumPost.title" class="largeText red">{{ forumPost.title }}</p>
      <user-card :user="forumPost.user">
      </user-card>
      <pre>{{ forumPost.description }}</pre>
      <photos-display :photos="forumPost.photos"></photos-display>
      <p>{{ forumPost.replies + ' ' + (forumPost.replies == 1 ? 'reply' : 'replies')}}</p>

      <custom-button
        v-if="$store.state.username === forumPost.usersId && !isEditing"
        @custom-button-click="isEditing = true"
        >
        Edit Your Post
      </custom-button>

      <custom-button
        v-if="!$store.state.username"
        href="/#/login"
        >
        Log In to Reply
      </custom-button>
      <custom-button
        v-else-if="!isReplying && !isEditing"
        @custom-button-click="isReplying = true"
        >
        Write a Reply
      </custom-button>
      <forum-post-form
        v-else
        :isExistingPost="isEditing"
        :inputData="isEditing ? forumPost : {}"
        :isTopic="false"
        @form-submit="replyCreated($event)"
        >
      </forum-post-form>
      <p v-if="forumPost.title" class="replies largeText red">Replies:</p>
    </div>
  </li>
</template>

<script>
import UserCard from '@/components/subcomponents/UserCard'
import PhotosDisplay from '@/components/subcomponents/PhotosDisplay'
import CustomButton from '@/components/subcomponents/CustomButton'
import ForumPostForm from '@/components/subcomponents/form/ForumPostForm'

export default {
  name: 'forum-reply-list-item',
  components: {
    UserCard,
    PhotosDisplay,
    CustomButton,
    ForumPostForm
  },
  props: {
    forumPost: Object, // Main data
    depth: Number
  },
  data () {
    return {
      isReplying: false,
      isEditing: false
    }
  },
  computed: {
    depthArr: function () {
      var depthArr = []
      for (var i = 1; i <= this.depth; i += 1) {
        depthArr.push(i)
      }
      return (depthArr)
    }
  },
  methods: {
    replyCreated: function (data) {
      var isEditing = this.isEditing
      this.isReplying = false
      this.isEditing = false

      // If creating, initialize important variables
      if (!isEditing) {
        data.usersId = this.$store.state.username
        data.parent = this.forumPost.id
        data.root = this.forumPost.root
        data.likes = 0
        data.replies = 0
      }
      this.$emit('reply-created', data)
    }
  }
}
</script>

<style lang="css" scoped>
.mainWrapper {
  display: flex;
  flex-flow: row nowrap;
}
.replies {
  margin: 10px 0px;
}
.forumPost {
  width: 100%;
  border-top: 1px solid #720300;
  margin: 5px 0px;
  padding-top: 5px;
}
.desktop .spacer {
  width: 60px;
}
.mobile .spacer {
  width: 30px;
}
</style>
