

<template>
  <div class="fullscreen bg-white text-black text-center q-pa-md flex flex-center">
    <div>
      <span class="text-h6 q-pa-lg " style="font-size:7vh">Login</span>
      <div class="">
        <hr/>
        <q-input  class="q-pt-md" filled v-model="email" label="Enter email" />
        <hr />
        <q-input filled v-model="password" label="Enter password" />
        <hr />
        <q-btn @click="submitForm" style="width: 100%;" filled color="primary" label="Login"  />


      </div>
      <p class="text-caption">Dont have an account? Register <router-link to="/register">here</router-link>.</p>

    </div>
    <q-card-section v-if="error" class="text-negative">
      {{ error }}
    </q-card-section>

    <q-card-section v-if="success" class="text-positive">
      {{ success }}
    </q-card-section>
  </div>
</template>

<script  lang="ts">

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from 'src/api';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const success = ref('');
    const router = useRouter();

    const submitForm = async () => {
      error.value = '';
      success.value = '';

      try {
        const response = await api.post('auth/login', {
          email: email.value,
          password: password.value,
        });
        success.value = 'Login successful!';

        //  store the token and user info
        localStorage.setItem('token', response.data.user.token);
        localStorage.setItem('userId', response.data.user.user._id);

        // Redirect to  home page

          router.push('/');

      } catch (err) {
        error.value = 'Login failed: ' + (err);
      }
    };

    return {
      email,
      password,
      error,
      success,
      submitForm,
    };
  },
};

</script>







