<template>
  <div :class="mobileClass" id="app">
    {{ this.$store.lastRoute }}
    <header>
      <a href="/#/">
        <div class="hugeText">
          Burning Hot Food
        </div>
        <div>
          Discover & Rate the Spiciest Restaurants
        </div>
      </a>
      <div id="navbar">
        <custom-button href="/#/">Home</custom-button>
        <custom-button
          v-if="$store.state.city.id"
          :href="`/#/city/${$store.state.city.id}`"
          >
          {{ $store.state.city.name }}
        </custom-button>
        <custom-button href="/#/forum">Forum</custom-button>
        <custom-button href="/#/about">About</custom-button>
        <!-- My account button  -->
        <custom-button
          v-if="$store.state.username"
          :href="`/#/user/${$store.state.username}`"
          >
          My Account
        </custom-button>
        <!-- Login/logout button -->
        <custom-button v-if="!$store.state.username" href="/#/login">Login</custom-button>
        <custom-button v-else href="/#/logout">Logout</custom-button>
      </div>
    </header>

    <!-- Specific page content goes here -->
    <section>
      <router-view></router-view>
    </section>
  </div>
</template>

<script type="text/javascript">
import CustomButton from '@/components/subcomponents/CustomButton'

export default {
  components: {
    CustomButton
  },
  data () {
    return {
      isMobile: window.innerWidth <= 600
    }
  },
  computed: {
    mobileClass: function () {
      if (this.isMobile) return 'mobile'
      else return 'desktop'
    }
  },
  mounted () {
    addEventListener('resize', () => {
      this.isMobile = innerWidth <= 600
    })
  }
}
</script>

<!-- Style for whole project -->
<style>

/* For this page */

#navbar {
  margin-top: 10px;
  display: flex;
  flex-flow: row wrap;
}

.desktop #navbar > * {
  margin: 0px 10px;
}

.mobile #navbar > * {
  margin: 0px 5px;
}

/* For all elements  */

#app {
  max-width: 800px;
  margin: 0px auto;
}

* {
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  color: black;
}

html {
  width: 100%;
  height:100%;
}

/* Header */
header {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 10px;
}

/* List styles */
ul, li {
  list-style-type: none;
}
.verticalList {
  display:flex;
  flex-flow: column nowrap;
}
.verticalList > li {
  padding: 10px 0px;
}

/* Text styles  */
.desktop .hugeText {
  font: 4em "Georgia";
}
.desktop .largeText {
  font: 2em "Georgia";
}
.desktop * {
  font: 1em "Georgia";
}

.mobile .hugeText {
  font: 2em "Georgia";
}
.mobile .largeText {
  font: 1.5em "Georgia";
}
.mobile * {
  font: 1em "Georgia";
}

/* General properties */
.red {
  color:#720300;
}

/* Wrap text in a pre tag */
pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
}

</style>
