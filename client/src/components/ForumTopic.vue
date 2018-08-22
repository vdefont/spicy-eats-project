<template lang="html">
  <centered-content-wrapper>
    <ul>
      <forum-reply-list-item
        v-for="(forumPost, key) in forumPostsOrdered"
        :key="key"
        :forumPost="forumPost"
        :depth="postDepth[forumPost.id]"
        @reply-created="replyCreated"
        >
      </forum-reply-list-item>
    </ul>
  </centered-content-wrapper>
</template>

<script>
import api from '@/api'
import CenteredContentWrapper from '@/components/subcomponents/CenteredContentWrapper'
import ForumPostForm from '@/components/subcomponents/form/ForumPostForm'
import ForumReplyListItem from '@/components/subcomponents/ForumReplyListItem'

export default {
  components: {
    ForumPostForm,
    ForumReplyListItem,
    CenteredContentWrapper
  },
  data () {
    return {
      root: null,
      forumPosts: [],
      forumPostsOrdered: [],
      postDepth: {}
    }
  },
  methods: {
    loadPage: async function () {
      var forumPosts = (await api('/getPosts/forumPosts', {
        root: this.root
      })).data
      this.computePostIndexAndDepth(forumPosts)
      this.forumPosts = forumPosts
    },
    // Build and traverse tree of posts
    computePostIndexAndDepth: function (forumPosts) {
      // Build tree
      var children = {}
      var depth = {}
      depth[this.root] = -1
      for (var i in forumPosts) {
        var forumPost = forumPosts[i]
        var id = forumPost.id
        var parent = forumPost.parent
        children[id] = []

        // If not root, add as child to parent and update depth
        if (parent !== 0) {
          children[parent].push(id)
          depth[id] = depth[parent] + 1
        }
      }

      // Traverse tree
      var index = {}
      var stack = []
      stack.push(this.root)
      var curIndex = 0
      while (stack.length > 0) {
        var curId = stack.pop()
        stack = stack.concat(children[curId].reverse())
        index[curId] = curIndex
        curIndex += 1
      }

      // Created ordered list of posts
      var forumPostsOrdered = []
      for (i in forumPosts) {
        forumPost = forumPosts[i]
        id = forumPost.id
        curIndex = index[id]
        forumPostsOrdered[curIndex] = forumPost
      }

      // Save depth and index
      this.postDepth = depth
      this.forumPostsOrdered = forumPostsOrdered
    },
    replyCreated: async function (data) {
      // If id already exists, we are just updating
      if (data.id) await api('/forumPosts/update', data)
      else await api('/forumPosts/update', data)
      // Reload page
      await this.loadPage()
    }
  },
  computed: {
    rootPost: function () {
      var rootPost = {}
      for (var forumPost in this.forumPosts) {
        if (forumPost.id === this.root) rootPost = forumPost
      }
      return (rootPost)
    }
  },
  async mounted () {
    this.root = this.$route.params.root
    this.loadPage()
  }
}
</script>

<style lang="css" scoped>
</style>
