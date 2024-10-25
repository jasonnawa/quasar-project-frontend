<template>
  <q-page class="">
    <div class="q-pa-md q-gutter-md" style="width: 100%">
      <div v-if="cart?.items.length === 0" class="text-h4" style="display: flex; flex-direction: column; justify-content: center;">
        <div style="display: flex; justify-content: center;">
          cart empty
        </div>
        <router-link to="/" style="color: inherit; text-decoration: none;"> <button class="button-link">Go to Home</button></router-link>
      </div>
      <q-list v-else bordered class="rounded-borders">
        <q-item-label header>Cart</q-item-label>

        <q-item  style="width: 100%">
          <q-item-section style="width: 100%">
            <q-item v-for="item in cart?.items" :key="item._id">
              <q-item-section>
                <q-item-label lines="1">
                  <q-item-label>{{ item.productId.name }}</q-item-label>
                </q-item-label>
                <q-item-label caption lines="2">
                  <q-item-label>{{ item.productId.description }}</q-item-label>
                </q-item-label>
              </q-item-section>
              <q-item-section> x{{ item.quantity }} </q-item-section>

              <q-item-section side>
                <span>
                  <q-btn @click="removeFromCart(item.productId._id)">-</q-btn>
                  <q-btn @click="addToCart(item.productId._id)">+</q-btn>
                </span>
              </q-item-section>

              <q-item-section side>
                ${{ item.productId.price * item.quantity }}
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>

        <q-separator inset="item" />

        <q-item>
          <q-item-section>
            <q-item-label class="text-h5"
              >Total : $ {{ cart?.total }}</q-item-label
            >
          </q-item-section>

          <q-item-section side>
            <q-btn @click="checkout">checkout</q-btn></q-item-section
          >
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from 'src/api';

export default defineComponent({
  setup() {
    const router = useRouter();

    interface Product {
      _id: string;
      name: string;
      description: string;
      image: string;
      price: number;
    }

    interface CartItem {
      productId: Product;
      quantity: number;
      _id: string;
    }

    interface Cart {
      _id: string;
      userId: string;
      items: CartItem[];
      total: number;
    }
    //const isActive = ref(false);
    const products = ref<Product[]>([]);
    const CartItem = ref<CartItem[]>([]);
    const cart = ref<Cart | null>(null);

    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>('/products'); // Replace with your product API URL
        products.value = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCart = async () => {
      try {
        const id = localStorage.getItem('userId');
        const response = await api.get<Cart>(`/cart/${id}`);
        cart.value = response.data;
        if (cart.value.items.length === 0) {
          const isActive = ref(true);
          console.log(isActive, 'isActive');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    const addToCart = async (product: string) => {
      try {
        const id = localStorage.getItem('userId');
        const response = await api.post<Cart>(`/cart/add/${id}/${product}`);
        cart.value = response.data;
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    const removeFromCart = async (product: string) => {
      try {
        const id = localStorage.getItem('userId');
        const response = await api.delete<Cart>(
          `/cart/remove/${id}/${product}`
        );
        cart.value = response.data;
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    const checkout = async () => {
      try {
        const id = localStorage.getItem('userId');
        const response = await api.post(`cart/checkout/${id}`);
        router.push('/orders');
        console.log('Success:', response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    onMounted(() => {
      fetchCart();
      fetchProducts();
    });

    return { products, cart, addToCart, removeFromCart, checkout };
  },
});
</script>

<style scoped>
.button-link {
  width: 100%;
  background-color: #292786;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  border-radius: 4px;
}

.button-link hover {
  background-color: #45a049;
}
</style>
