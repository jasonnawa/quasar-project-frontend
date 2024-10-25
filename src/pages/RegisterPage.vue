<template>
  <div
    class="fullscreen bg-white text-black text-center q-pa-md flex flex-center"
  >
    <div>
      <span class="text-h6 q-pa-lg" style="font-size: 7vh">Register</span>
      <div class="">
        <hr />
        <q-input class="q-pt-md" filled v-model="email" label="Enter email" />
        <hr />

        <q-input
          class="q-pt-md"
          filled
          v-model="phoneNumber"
          label="+234"
        />
        <hr />
        <q-input filled v-model="password" label="Enter password" />
        <hr />
        <q-btn
          @click="submitForm"
          style="width: 100%"
          filled
          color="primary"
          label="Register"
        />
      </div>
      <p class="text-caption">Already registered? sign In <router-link to="/login">here</router-link>.</p>
    </div>
    <q-card-section v-if="error" class="text-negative">
      {{ error }}
    </q-card-section>

    <q-card-section v-if="success" class="text-positive">
      {{ success }}
    </q-card-section>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import api from 'src/api';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const phoneNumber = ref('');
    const password = ref('');
    const error = ref('');
    const success = ref('');
    const router = useRouter();

    const submitForm = async () => {
      error.value = '';
      success.value = '';

      try {
        console.log('clicked');
        console.log(
          `email: ${email.value}, phone: ${phoneNumber.value}, password : ${password.value}`
        );
        const response = await api.post('auth/register', {
          email: email.value,
          phoneNumber: `+234${phoneNumber.value}`,
          password: password.value,
        });
        console.log(response);
        success.value = 'Registration successful!';
        // Redirect to login page
        setTimeout(() => {
          router.push('/login'); // Adjust the route according to your structure
        }, 1000); // Optional: Add a delay before redirecting
        // =reset the form
        email.value = '';
        phoneNumber.value = '';
        password.value = '';
      } catch (err) {
        error.value = 'Registration failed: ' + err;
      }
    };

    return {
      email,
      phoneNumber,
      password,
      error,
      success,
      submitForm,
    };
  },
};
</script>
