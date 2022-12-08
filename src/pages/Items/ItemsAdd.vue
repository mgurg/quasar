<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs class="row q-pa-sm">
        <q-breadcrumbs-el icon="home" to="/home" />
        <q-breadcrumbs-el :label="$t('Items')" icon="tips_and_updates" to="/items" />
        <q-breadcrumbs-el :label="$t('Add')" icon="add" />
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h6">{{ $t("Item") }} </q-item-label>
                <!--
                  <q-item-label caption>
                  Nowy pracownik będzie musiał potwierdzić hasło. Wiecej użytkowników?
                  Pamiętaj o opcji importu!
                </q-item-label>
                -->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <div>&nbsp;</div>

      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
          <item-form />
        </q-card-section>
      </q-card>

    </q-page>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ItemForm from 'src/components/forms/ItemForm.vue'
import { authApi } from "boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
