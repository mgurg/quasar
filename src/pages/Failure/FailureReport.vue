<template>

    
    <div class="row justify-center">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
            <q-card bordered class="my-card no-shadow q-mt-sm">
                <q-card-section>
                    <q-list>
                        <q-item class="q-px-none">
                            <q-item-section>
                                <q-item-label class="text-h5 text-weight-medium">{{ $t("Guides") }}</q-item-label>
                                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
                            </q-item-section>
                            <q-item-section side>
                                <div class="col-12 text-h6 q-mt-none">
                                    <q-btn outline class="float-right q-mr-xs no-shadow" icon="add" to="/guides/add"
                                        color="primary" no-caps :label="$q.screen.gt.xs ? $t('New guide') : ''" />
                                </div>
                            </q-item-section>
                        </q-item>

                    </q-list>
                </q-card-section>
            </q-card>

            <div class="q-pa-md">
      <q-stepper
        v-model="step"
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Coś z tego?"
          icon="settings"
          :done="step > 1"
        >
          For each ad campaign that you create, you can control how much you're willing to
          spend on clicks and conversions, which networks and geographical locations you want
          your ads to show on, and more.
  
          <q-stepper-navigation>
            <q-btn @click="step = 2" color="primary" label="Continue" />
          </q-stepper-navigation>
        </q-step>
  
        <q-step
          :name="2"
          title="Raport"
          icon="add_comment"
        >
          Try out different ad text to see what brings in the most customers, and learn how to
          enhance your ads using features like ad extensions. If you run into any problems with
          your ads, find out how to tell if they're running and how to resolve approval issues.
  
          <q-stepper-navigation>
            <q-btn color="primary" label="Finish" />
            <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>

           





        </q-page>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1);
</script>