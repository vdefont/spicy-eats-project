<template lang="html">

  <div id="loginWrapper">
    <custom-form
      :inputs="loginFormInputs"
      :error="errors.login"
      :noclear="true"
      @custom-form-submit="loginClicked"
      >
      Login
    </custom-form>

    <custom-form
      :inputs="createAccountFormInputs"
      :error="errors.createAccount"
      :noclear="true"
      @custom-form-submit="createAccountClicked"
      >
      Create Account
    </custom-form>

  </div>

</template>

<script>
import api from '@/api'
import CustomForm from '@/components/subcomponents/form/CustomForm'

export default {
  components: {
    CustomForm
  },
  data () {
    return {
      lastRoute: '/',
      loginFormInputs: [
        {
          label: 'Username',
          type: 'text',
          model: 'username',
          validate: (username) => username.length > 0,
          error: 'Enter username'
        },
        {
          label: 'Password',
          type: 'password',
          model: 'password',
          validate: (password) => password.length > 0,
          error: 'Enter password'
        }
      ],
      createAccountFormInputs: [
        {
          label: 'Username',
          type: 'text',
          model: 'username',
          validate: (username) => username.length > 3,
          error: 'Username must be at least 4 characters'
        },
        {
          label: 'Name (appears on reviews)',
          type: 'text',
          model: 'name',
          validate: (name) => name.length > 2,
          error: 'Name must be at least 3 characters'
        },
        {
          label: 'Email (optional)',
          type: 'text',
          model: 'email'
        },
        {
          label: 'Password',
          type: 'password',
          model: 'password',
          validate: (password) => password.length >= 8,
          error: 'Password must be at least 8 characters'
        },
        {
          label: 'Confirm Password',
          type: 'password',
          model: 'passwordConfirm',
          validate: (password) => password.length >= 8,
          error: 'Password must be at least 8 characters'
        }
      ],
      errors: {
        login: '',
        createAccount: ''
      }
    }
  },
  methods: {
    loginClicked: async function (data) {
      await this.buttonClicked('login', data)
    },
    createAccountClicked: async function (data) {
      await this.buttonClicked('createAccount', data)
    },
    // whichButton: "login" or "createAccount"
    buttonClicked: async function (whichButton, data) {
      // Get data
      var user = data
      var username = user.username
      var password = user.password
      var name = user.name
      var passwordConfirm = user.passwordConfirm

      // If creating account, ensure that passwords match
      if (whichButton === 'createAccount') {
        if (password !== passwordConfirm) {
          this.errors.createAccount = 'Passwords must match'
          return
        } else if (!name) {
          this.errors.createAccount = 'Please enter your name'
          return
        }
      }

      // Try to log in or create account
      var res
      if (whichButton === 'login') {
        res = (await api('/validateUser', user)).data
        name = res.name
      } else if (whichButton === 'createAccount') {
        user.reviews = 0
        res = (await api('/createUser', user)).data
      }

      var error = res.error
      if (error) {
        this.errors[whichButton] = error
      } else {
        this.$store.commit('username', username)
        this.$router.push({ path: this.lastRoute })
      }
    }
  },
  // Store the last URL
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.lastRoute = from.path
      next()
    })
  }
}
</script>

<style lang="css" scoped>
#loginWrapper > * {
  margin-bottom: 10px;
}
</style>
