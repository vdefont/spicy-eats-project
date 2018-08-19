<template lang="html">
  <centered-content-wrapper>

    <div class="userInfo">

      <ul class="userInfoList">
        <li class="largeText red">{{ user.name }}</li>
        <li>
          <img v-if="user.photo" :src="user.photo">
          <img v-else src="/static/logo.png">
        </li>
        <li>
          Reviews: {{ user.reviews }}
        </li>
        <li v-if="user.location">
          Location: {{ user.location }}
        </li>
        <li v-if="user.age">
          Age: {{ user.age }}
        </li>
        <li v-if="user.favoriteCuisines">
          Favorite Cuisines: {{ user.favoriteCuisines }}
        </li>
        <li v-if="user.about">
          About: {{ user.about }}
        </li>
      </ul>

      <div class="updateInfo">
        <field-editor
          v-if="editingUserFields"
          :inputFields="userFields"
          @field-updated="userFieldUpdated($event)"
          >
        </field-editor>
        <custom-button
          v-if="myAccount"
          @custom-button-click="() => editingUserFields = !editingUserFields"
          >
          {{ editingUserFields ? "Done Editing" : "Edit My Info" }}
        </custom-button>
      </div>

    </div>

    <div class="largeText red">
      {{ myAccount ? 'My Reviews:' : 'Reviews:' }}
    </div>
    <ul class="reviews verticalList">
      <div
        v-for="(review, key) in reviews"
        :key="key"
        >

        <a class="largeText red" :href="`/#/restaurant/${review.restaurant.id}`">
          {{ review.restaurant.name }}
        </a>

        <review-form
          v-if="reviewBeingEdited(key)"
          :inputData="review"
          :isExistingReview="true"
          @review-form-submit="doneEditingReview(key)"
          >
        </review-form>

        <div v-else>
          <review-list-item
            :key="key"
            :review="review"
            :noUserInfo="true"
            >
          </review-list-item>
          <custom-button
            v-if="myAccount"
            @custom-button-click="editingReview(key)"
            >
            Edit Review
          </custom-button>
        </div>

      </div>
    </ul>

  </centered-content-wrapper>
</template>

<script>
import api from '@/api'
import CustomButton from '@/components/subcomponents/CustomButton'
import CenteredContentWrapper from '@/components/subcomponents/CenteredContentWrapper'
import ReviewListItem from '@/components/subcomponents/ReviewListItem'
import ReviewForm from '@/components/subcomponents/form/ReviewForm'
import FieldEditor from '@/components/subcomponents/form/FieldEditor'

export default {
  components: {
    CenteredContentWrapper,
    ReviewListItem,
    CustomButton,
    ReviewForm,
    FieldEditor
  },
  data: function () {
    return {
      username: null,
      myAccount: null, // Whether this is the user's own account
      user: {},
      reviews: [],
      reviewEditHelper: 0, // Binary variable - hack to track reviews being edited
      editingUserFields: false,
      userFields: {
        photo: {
          type: 'image',
          prompt: 'Upload New Photo'
        },
        location: {
          type: 'text',
          prompt: 'New Location',
          buttonText: 'Update Location',
          validate: (val) => val.length > 3,
          error: 'Enter Valid Location'
        },
        age: {
          type: 'number',
          prompt: 'New Age',
          buttonText: 'Update Age',
          validate: (val) => !isNaN(parseInt(val)),
          error: 'Enter Valid Age'
        },
        favoriteCuisines: {
          type: 'text',
          prompt: 'New Favorite Cuisines',
          buttonText: 'Update Favorite Cuisines'
        },
        about: {
          type: 'textarea',
          prompt: 'New About Text',
          buttonText: 'Update About Text'
        }
      }
    }
  },
  methods: {
    userFieldUpdated: async function (data) {
      // Get values
      var field = data.field
      var value = data.value
      // Run update query
      var update = {}
      update.username = this.username
      update[field] = value
      await api('/standardQuery/users/update', update)
      // Await page reload
      await this.loadPage()
    },
    editingReview: function (key) {
      this.reviewEditHelper += 1 << key
    },
    doneEditingReview: function (key) {
      this.reviewEditHelper -= 1 << key
    },
    reviewBeingEdited: function (key) {
      var beingEdited = (this.reviewEditHelper >> key) % 2 === 1
      return (beingEdited)
    },
    loadUser: async function () {
      var username = this.$route.params.username
      this.user = (await api('/standardQuery/users/find', {username: username})).data[0]
      this.username = username
      this.myAccount = this.$store.state.username === username
      return (username)
    },
    loadReviews: async function (username) {
      var queryObject = {
        usersId: username
      }
      this.reviews = (await api('/getReviews', queryObject)).data
    },
    loadPage: async function () {
      var username = await this.loadUser()
      await this.loadReviews(username)
    }
  },
  async mounted () {
    await this.loadPage()
  }
}
</script>

<style lang="css" scoped>
.userInfo {
  margin-bottom: 20px;
}
.reviews > * {
  margin-top: 15px;
}

.desktop img {
  max-width: 300px;
  max-height: 300px;
}
.mobile img {
  max-width: 250px;
  max-height: 125px;
}

.userInfoList > li {
  margin-top: 5px;
}
.updateInfo {
  margin-top: 10px;
}
</style>
