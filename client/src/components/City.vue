<template lang="html">
  <div id="cityWrapper">

    <section>
      <ul id="restaurantList" class="verticalList">
        <restaurant-list-item
          v-for="(restaurant, key) in restaurants"
          :key="key"
          :data="restaurant"
          >
        </restaurant-list-item>

        <!-- Add new restaurant -->
        <li v-if="$store.state.username">
          <custom-form
            :inputs="newRestaurantFormInputs"
            @custom-form-submit="newRestaurantButtonClicked"
            >
            Add New Restaurant
          </custom-form>
        </li>
        <li v-else>
          <custom-button href="/#/login">
            Log in to Add New Restaurant
          </custom-button>
        </li>
      </ul>
    </section>

  </div>
</template>

<script>
import api from '@/api'
import CustomForm from './subcomponents/CustomForm'
import RestaurantListItem from './subcomponents/RestaurantListItem'
import CustomButton from './subcomponents/CustomButton'

export default {
  name: 'City',
  components: {
    CustomForm,
    RestaurantListItem,
    CustomButton
  },
  data () {
    return {
      citiesId: null,
      restaurants: [],
      newRestaurantFormInputs: [
        {
          label: 'Name',
          type: 'text',
          model: 'name',
          validate: (name) => name.length > 2,
          error: 'Enter valid restaurant name'
        },
        {
          label: 'Address',
          type: 'text',
          model: 'address',
          validate: (address) => address.length > 10,
          error: 'Enter valid address'
        }
      ]
    }
  },
  methods: {
    loadPage: async function () {
      this.citiesId = this.$route.params.citiesId
      this.restaurants = (await api('/standardQuery/restaurants/find', {
        citiesId: this.citiesId
      })).data
    },
    newRestaurantButtonClicked: async function (newRestaurant) {
      newRestaurant.citiesId = this.citiesId // Add in the city ID
      newRestaurant.reviews = 0 // 0 reviews to start
      this.newRestaurant = {}
      await api('/standardQuery/restaurants/create', newRestaurant)
      await this.loadPage()
    }
  },
  async mounted () {
    await this.loadPage()
  }
}
</script>

<style lang="css" scoped>
#cityWrapper {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
#cityWrapper > * {
  flex: 0 1 600px;
}
</style>
