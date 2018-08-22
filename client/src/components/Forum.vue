<template lang="html">
  <centered-content-wrapper>
    <ul>
      <forum-topic-list-item
        v-for="(forumPost, key) in forumPosts"
        :key="key"
        :forumPost="forumPost"
        >
      </forum-topic-list-item>
    </ul>

    <custom-button
      v-if="!$store.state.username"
      href="/#/login"
      >
      Log In to Create New Topic
    </custom-button>
    <custom-button
      v-else-if="!creatingTopic"
      @custom-button-click="creatingTopic = true"
      >
      Create New Topic
    </custom-button>
    <forum-post-form
      v-else
      :isExistingPost="false"
      :isTopic="true"
      @form-submit="newTopic"
      >
    </forum-post-form>

  </centered-content-wrapper>
</template>

<script>
import api from '@/api'
import CenteredContentWrapper from '@/components/subcomponents/CenteredContentWrapper'
import ForumTopicListItem from '@/components/subcomponents/ForumTopicListItem'
import ForumPostForm from '@/components/subcomponents/form/ForumPostForm'
import CustomButton from '@/components/subcomponents/CustomButton'

export default {
  components: {
    CenteredContentWrapper,
    ForumTopicListItem,
    ForumPostForm,
    CustomButton
  },
  data () {
    return {
      forumPosts: [],
      creatingTopic: false
    }
  },
  methods: {
    loadPage: async function () {
      this.forumPosts = (await api('/standardQuery/forumPosts/find',
        {parent: 0}
      )).data
    },
    newTopic: async function (data) {
      this.creatingTopic = false

      data.usersId = this.$store.state.username
      data.parent = 0
      data.replies = 0
      data.likes = 0
      await api('/forumPosts/create', data)
      await this.loadPage()
    }
  },
  async mounted () {
    this.loadPage()
  }
}
</script>

<style lang="css" scoped>
ul > * {
  margin: 5px 0px;
}
</style>
