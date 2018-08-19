<template lang="html">
  <centered-content-wrapper>

    <ul class="cityList">
      <li
        v-for="(city, key) in cities"
        v-bind:key="key"
        >
        <city-card
          :city="city"
          @city-card-clicked="updateCity(city)"
          >
        </city-card>
      </li>
    </ul>

    <custom-form
      v-if="$store.state.username"
      :inputs="cityFormInputs"
      @custom-form-submit="newCityButtonClicked($event)"
      >
      Add New City
    </custom-form>
    <div v-else class="centered">
      <custom-button href="/#/login">
        Log in to Add New City
      </custom-button>
    </div>

  </centered-content-wrapper>
</template>

<script>
import api from '@/api'
import CityCard from '@/components/subcomponents/CityCard'
import CustomForm from '@/components/subcomponents/form/CustomForm'
import CustomButton from '@/components/subcomponents/CustomButton'
import CenteredContentWrapper from '@/components/subcomponents/CenteredContentWrapper'

export default {
  name: 'Home',
  components: {
    CityCard,
    CustomForm,
    CustomButton,
    CenteredContentWrapper
  },
  data () {
    return {
      cityFormInputs: [
        {
          label: 'Name',
          type: 'text',
          model: 'name',
          validate: (name) => name.length > 2,
          error: 'Name must be at least 3 characters'
        }
      ],
      cities: []
    }
  },
  methods: {
    loadPage: async function () {
      this.cities = (await api('/standardQuery/cities/getAll')).data
    },
    newCityButtonClicked: async function (newCity) {
      await api('/standardQuery/cities/create', newCity)
      await this.loadPage()
    },
    updateCity: function (city) {
      this.$store.commit('city', city)
    }
  },
  async mounted () {
    this.$store.commit('deleteCity') // Clear city on page load
    await this.loadPage()
  }
}
</script>

<style scoped>

.cityList {
  display: flex;
  flex-flow: row wrap;
}
.centered {
  display: flex;
  justify-content: center;
}

</style>
