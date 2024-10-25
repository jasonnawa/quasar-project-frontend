<template>
  <q-page class="">
    <div class="q-pa-md q-gutter-md" style="width: 100%">
      <h4>Order List  <q-btn> <router-link to="/" style="color: inherit; text-decoration: none;">home</router-link></q-btn></h4>
      <q-list v-for="order in Orders" :key="order._id" bordered class="rounded-borders">
        <q-item-label header>Order ID: {{ order._id }}</q-item-label>

        <q-item style="width: 100%">
          <q-item-section style="width: 100%">
            <q-item v-for="item in order.items" :key="item._id" v-ripple>
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
                ${{ item.quantity * item.productId.price }}
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>

        <q-separator inset="item" />

        <q-item>
          <q-item-section>
            <q-item-label
              >{{ formatDate(order.orderDate) }}</q-item-label
            >
          </q-item-section>

          <q-item-section side>
            Total : $ {{ order.total }}</q-item-section
          >
        </q-item>
      </q-list>

    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import api from 'src/api';

export default defineComponent({
  setup() {


    function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}

    // Define interfaces directly in the script
    interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  __v: number;
}

interface OrderItem {
  productId: Product;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type Orders = Order[];

    //const isActive = ref(false);
    const products = ref<Product[]>([]);
    const OrderItem = ref<OrderItem[]>([]);
    const Orders = ref<Orders | null>([] as Orders);


    const fetchOrders = async () => {
      try {
        const id = localStorage.getItem('userId');
        const response = await api.get<Orders>(`/orders/${id}`);
        Orders.value = response.data;
        console.log('cart', response.data);
        //if (Orders.value.items.length === 0) {
          //const isActive = ref(true);
          //console.log(isActive, 'isActive');
        //}
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };




    onMounted(() => {
      fetchOrders();
    });

    return { products, Orders, formatDate };
  },
});
</script>
