<template>
    <q-card class="bg-transparent no-shadow no-border">
        <q-card-section class="q-pa-none">
            <div class="row q-col-gutter-sm ">
                <div v-for="(item, index) in items" :key="index" class="col-md-3 col-sm-6 col-xs-12">
                    <router-link :to="item.link">
                    <q-item :style="`background-color: ${item.color1}`" class="q-pa-none rounded-borders">
                        <q-item-section v-if="icon_position === 'left'" side :style="`background-color: ${item.color2}`"
                            class=" q-pa-lg q-mr-none text-white rounded-borders">
                            <q-icon :name="item.icon" color="white" size="24px"></q-icon>
                        </q-item-section>
                        <q-item-section class=" q-pa-md q-ml-none  text-white">
                            <q-item-label class="text-white text-h5 text-weight-bolder">{{ item.value }}</q-item-label>
                            <q-item-label>{{ item.title }}</q-item-label>
                        </q-item-section>
                        <q-item-section v-if="icon_position === 'right'" side class="q-mr-md text-white">
                            <q-icon :name="item.icon" color="white" size="44px"></q-icon>
                        </q-item-section>
                    </q-item>
                </router-link>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>
  
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: "CardSettings",
    props: {
        icon_position: {
            required: false,
            default: "left"
        }
    },
    computed: {
        items: function () {
            return this.icon_position === "left"
                ? [
                    {
                        title: "New",
                        icon: "auto_awesome",
                        value: "4",
                        color1: "#e91e63",
                        color2: "#d81b60",
                        link: "/ideas"
                    },
                    {
                        title: "Voted",
                        icon: "ballot",
                        value: "1",
                        color1: "#ffb300",
                        color2: "#ffa000",
                        link: "/ideas"
                    },
                    {
                        title: "Accepted",
                        icon: "thumb_up_alt",
                        value: "1",
                        color1: "#009688",
                        color2: "#00897b",
                        link: "/ideas"
                    },
                    {
                        title: "Rejected",
                        icon: "delete_forever",
                        value: "1",
                        color1: "#455a64",
                        color2: "#37474f",
                        link: "/ideas"
                    }
                ]
                : [
                    {
                        title: "Monthly Income",
                        icon: "fas fa-dollar-sign",
                        value: "$ 20k",
                        color1: "#546bfa",
                        color2: "#3e51b5",
                        link: "/settings/ideas"
                    },
                    {
                        title: "Weekly Sales",
                        icon: "fas fa-chart-bar",
                        value: "20",
                        color1: "#3a9688",
                        color2: "#3e51b5",
                        link: "/settings/ideas"
                    },
                    {
                        title: "New Customers",
                        icon: "fas fa-chart-line",
                        value: "321",
                        color1: "#7cb342",
                        color2: "#3e51b5",
                        link: "/settings/ideas"
                    },
                    {
                        title: "Active Users",
                        icon: "person",
                        value: "82",
                        color1: "#f88c2b",
                        color2: "#3e51b5",
                        link: "/settings/ideas"
                    }
                ];
        }
    }
})
</script>

<style lang="scss"  scoped>
a {
  text-decoration: none;
}
</style>