<template>
  <q-page class="q-pa-md row items-start q-gutter-md">

    <q-card  v-for="product in products"
    :key="product._id" class="my-card">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom">
          <div class="text-h6">{{ product.name }}</div>
          <div class="text-subtitle2">price : ${{ product.price }}</div>
          <div v-for="item in cart?.items" :key="item._id" class="text-subtitle2">
            <div v-if="item.productId._id === product._id" caption>
            <span> in cart : {{ item.quantity }} </span>
            </div>
          </div>



        </div>
      </q-img>

      <q-card-actions>
        <q-btn @click="addToCart(product._id)"
          color="primary"
          icon="shopping_cart"
           >Add to cart</q-btn>
        <q-btn @click="removeFromCart(product._id)" color="red" >-</q-btn>
      </q-card-actions>
    </q-card>
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
        if(!localStorage.getItem('userId')){
          router.push('/register');
        }
        const response = await api.get<Product[]>('/products');
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
        fetchCart();
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

    onMounted(() => {
      fetchProducts();
      fetchCart();
    });

    return { products, cart, addToCart, removeFromCart };
  },
});
</script>

<style>
.my-card {
  width: 250px;
  height: 250px;
}
</style>
