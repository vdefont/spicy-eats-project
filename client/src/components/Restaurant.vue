<template lang="html">

  <centered-content-wrapper>

    <restaurant-list-item :data="restaurant">
    </restaurant-list-item>

    <field-editor
      v-if="$store.state.username && editingRestaurant"
      :inputFields="restaurantEditorInputs"
      @field-updated="restaurantFieldUpdated"
      >
    </field-editor>

    <custom-button
      v-if="$store.state.username"
      @custom-button-click="() => editingRestaurant = !editingRestaurant"
      >
      {{ editingRestaurant ? "Done Editing" : "Edit Restaurant Info" }}
    </custom-button>
    <custom-button
      v-else
      href="/#/login">
      Log in to Edit Restaurant
    </custom-button>

    <div class="reviewsSection">

        <div class="largeText red">
          Reviews:
        </div>

        <ul class="verticalList reviewsList">

          <!-- Button to log in, write, or add review  -->
          <li v-if="!$store.state.username">
            <custom-button href="/#/login">
              Log in to Add Review
            </custom-button>
          </li>
          <li v-else-if="!writingReview">
            <custom-button @custom-button-click="() => writingReview = true">
              {{ previousReview ? 'Edit Your Existing Review' : 'Write a Review' }}
            </custom-button>
          </li>

          <review-list-item
            v-for="(review, key) in reviews"
            :key="key"
            :review="review"
            >
          </review-list-item>

          <!-- Add review -->
          <li
            class="newReview"
            v-if="writingReview"
            >
            <review-form
              :inputData="previousReview ? previousReview : {}"
              :isExistingReview="previousReview ? true : false"
              @review-form-submit="newReviewButtonClicked($event)"
              >
            </review-form>
          </li>

        </ul>

      </div>

  </centered-content-wrapper>

</template>

<script>
import api from '@/api'
import RestaurantListItem from '@/components/subcomponents/RestaurantListItem'
import ReviewListItem from '@/components/subcomponents/ReviewListItem'
import ReviewForm from '@/components/subcomponents/form/ReviewForm'
import CustomButton from '@/components/subcomponents/CustomButton'
import FieldEditor from '@/components/subcomponents/form/FieldEditor'
import CenteredContentWrapper from '@/components/subcomponents/CenteredContentWrapper'

export default {
  components: {
    RestaurantListItem,
    ReviewListItem,
    ReviewForm,
    CustomButton,
    FieldEditor,
    CenteredContentWrapper
  },
  data () {
    return {
      restaurant: {}, // restaurant data object
      editingRestaurant: false,
      reviews: [], // list of review data objects
      previousReview: null, // User's past review (default is null)
      writingReview: false,
      restaurantEditorInputs: {
        name: {
          type: 'text',
          prompt: 'New Name',
          buttonText: 'Update Name',
          validate: (val) => val.length > 2,
          error: 'Enter Valid Name'
        },
        address: {
          type: 'text',
          prompt: 'New Address',
          buttonText: 'Update Address',
          validate: (val) => val.length > 10,
          error: 'Enter Valid Address'
        },
        website: {
          type: 'text',
          prompt: 'New Website',
          buttonText: 'Update Website',
          validate: (val) => val.length > 5,
          error: 'Enter Valid Website'
        },
        phoneNumber: {
          type: 'text',
          prompt: 'New Phone Number',
          buttonText: 'Update Phone Number',
          validate: (val) => val.length >= 10,
          error: 'Enter Valid Phone Number'
        },
        acceptsReservations: {
          type: 'text',
          prompt: 'Accepts Reservations?',
          buttonText: 'Update Reservation Policy',
          validate: (val) => val === 'Yes' || val === 'No',
          error: 'Enter "Yes" or "No"'
        },
        cuisine: {
          type: 'text',
          prompt: 'New Cuisine Type',
          buttonText: 'Add Cuisine',
          validate: (val) => val.length > 2,
          error: 'Enter Valid Cuisine'
        }
      }
    }
  },
  methods: {
    loadPage: async function () {
      // Get restaurant info
      var restaurantsId = this.$route.params.restaurantsId
      this.restaurant = (await api('/standardQuery/restaurants/find', {
        id: restaurantsId
      })).data[0]

      // Get reviews
      var reviews = (await api('/getReviews', {
        restaurantsId: restaurantsId
      })).data
      this.reviews = reviews

      // Determine if user already reviewed
      if (this.$store.state.username) {
        for (var i = 0; i < reviews.length; i += 1) {
          var curReview = reviews[i]
          var curUser = curReview.usersId
          var alreadyReviewed = (this.$store.state.username === curUser)
          if (alreadyReviewed) {
            this.previousReview = curReview
          }
        }
      }
    },
    newReviewButtonClicked: async function (newReview) {
      // Add new review
      newReview.usersId = this.$store.state.username
      newReview.restaurantsId = this.restaurant.id
      var operation = this.previousReview ? 'update' : 'create'
      var res = (await api(`/reviews/${operation}`, newReview)).data
      var reviewsId = (operation === 'create') ? res.insertId : this.previousReview.id

      // Add images
      var photos = newReview.photos
      for (var i in photos) {
        var photo = photos[i]
        photo.reviewsId = reviewsId
        if (photo.id) {
          var updatePhoto = {}
          updatePhoto.id = photo.id
          updatePhoto.caption = photo.caption
          await api('/standardQuery/photos/update', updatePhoto)
        } else {
          await api('/standardQuery/photos/create', photo)
        }
      }

      // Reload page
      await this.loadPage()

      // No longer writing a review
      this.writingReview = false
    },
    restaurantFieldUpdated: async function (data) {
      var field = data.field
      var value = data.value

      // Cuisine is a special case
      if (field === 'cuisine') {
        var cuisineData = {
          cuisinesName: value,
          restaurantsId: this.restaurant.id
        }
        await api('/addCuisineToRestaurant', cuisineData)
      } else {
        var restaurant = {}
        restaurant.id = this.restaurant.id
        restaurant[field] = value
        await api('/standardQuery/restaurants/update', restaurant)
      }

      await this.loadPage()
    }
  },
  async mounted () {
    await this.loadPage()
  }
}
</script>

<style lang="css" scoped>
.restaurantWrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}
.centeredContent {
  flex-basis: 600px;
  flex-shrink: 1;
}
.reviewsSection {
  margin: 20px 0px;
}
</style>
