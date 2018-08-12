<template lang="html">

  <div class="restaurantWrapper">
    <div class="centeredContent">

      <restaurant-list-item :data="restaurant">
      </restaurant-list-item>

      <restaurant-editor
        v-if="$store.state.username && editingRestaurant"
        @field-updated="restaurantFieldUpdated"
        >
      </restaurant-editor>

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
          <review-list-item
            v-for="(review, key) in reviews"
            :key="key"
            :review="review"
            >
          </review-list-item>

          <!-- Add review -->
          <li
            class="newReview"
            v-if="$store.state.username"
            >
            <custom-form
              :inputs="newReviewFormInputs"
              @custom-form-submit="newReviewButtonClicked($event)"
              >
              Add New Review
            </custom-form>
          </li>
          <li v-else>
            <custom-button href="/#/login">
              Log in to Add Review
            </custom-button>
          </li>
        </ul>

      </div>

    </div>
  </div>

</template>

<script>
import api from '@/api'
import RestaurantListItem from './subcomponents/RestaurantListItem'
import ReviewListItem from './subcomponents/ReviewListItem'
import CustomForm from './subcomponents/CustomForm'
import CustomButton from './subcomponents/CustomButton'
import RestaurantEditor from './subcomponents/RestaurantEditor'

export default {
  components: {
    RestaurantListItem,
    ReviewListItem,
    CustomForm,
    CustomButton,
    RestaurantEditor
  },
  data () {
    return {
      restaurant: {}, // restaurant data object
      editingRestaurant: false,
      reviews: [], // list of review data objects
      newReviewFormInputs: [
        {
          label: 'Spiciness (1-5)',
          type: 'number',
          model: 'spiciness',
          validate: (spiciness) => /^[1-5]$/.test(spiciness),
          error: 'Enter whole number between 1 and 5'
        },
        {
          label: 'Overall Quality (1-5)',
          type: 'number',
          model: 'overallQuality',
          validate: (overallQuality) => /^[1-5]$/.test(overallQuality),
          error: 'Enter whole number between 1 and 5'
        },
        {
          label: 'Dishes Eaten',
          type: 'text',
          model: 'dishesEaten',
          validate: (dishesEaten) => dishesEaten.length > 4,
          error: 'Enter valid dishes'
        },
        {
          label: 'Description',
          type: 'textarea',
          model: 'description',
          validate: (description) => description.length >= 40,
          error: 'Enter at least 40 characters'
        },
        {
          label: 'Images (optional)',
          type: 'multi-image-caption',
          model: 'photos'
        }
      ]
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
      this.reviews = (await api('/getReviews', {
        restaurantsId: restaurantsId
      })).data
    },
    newReviewButtonClicked: async function (newReview) {
      // Add new review
      newReview.usersId = this.$store.state.username
      newReview.restaurantsId = this.restaurant.id
      var res = (await api('/addReview', newReview)).data
      var reviewsId = res.insertId

      // Add images
      var photos = newReview.photos
      for (var i in photos) {
        var photo = photos[i]
        photo.reviewsId = reviewsId
        await api('/standardQuery/photos/create', photo)
      }

      // Reload page
      await this.loadPage()
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
