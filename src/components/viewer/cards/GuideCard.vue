<template>
  <!--        GUIDES -->
  <q-card bordered class="my-card no-shadow q-my-xs">
    <div :style="expandedGuide ? 'border-left: 5px solid #2bba82':''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedGuide = !expandedGuide">
            {{ $t("Guides") }}
            <q-badge floating align="top">{{ guides.length }}</q-badge>
          </div>
          <q-space></q-space>
          <q-btn
            v-if="itemUuid"
            :label="$t('Add')"
            class="q-mr-lg"
            color="primary"
            flat
            no-caps
            @click="addGuide(itemUuid)"
          />
          <q-btn :icon="expandedGuide ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                 @click="expandedGuide = !expandedGuide"/>
        </div>

      </q-card-section>


      <q-slide-transition>
        <div v-show="expandedGuide">
          <q-card-section>
            <q-list>

              <!--              <q-item :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'" class=" rounded-borders">-->
              <!--                <q-item-section avatar>-->
              <!--                  <span>&nbsp;</span>-->
              <!--                </q-item-section>-->
              <!--                <q-item-section>-->
              <!--                    <span>-->
              <!--                      {{ $t("Name") }}-->
              <!--                      <q-btn-->
              <!--                        :flat="sort.active!=='title'"-->
              <!--                        :icon="sort.title==='asc'? 'arrow_upward':'arrow_downward'"-->
              <!--                        :unelevated="sort.active==='title'"-->
              <!--                        color="primary"-->
              <!--                        padding="xs"-->
              <!--                        size="sm"-->
              <!--                        @click="changeSortOrder('title')"/>-->
              <!--                    </span>-->
              <!--                </q-item-section>-->

              <!--              </q-item>-->

              <div v-for="(guide, index) in guides" v-if="guides!= null" v-bind:key="index">
                <guide-item :guide="guide" :public-access="publicAccess"></guide-item>
              </div>


            </q-list>

          </q-card-section>
        </div>
      </q-slide-transition>
    </div>
  </q-card>
</template>

<script setup>
import {ref} from "vue";
import GuideItem from "components/listRow/GuideListRow.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const props = defineProps({
  guides: {
    type: Object,
    default() {
      return {
        uuid: null,
        name: null,
        text: null,
      }
    }
  },
  itemUuid: {
    type: String,
    default: null,
  },
  publicAccess: {
    type: Boolean,
    default: true,
  },
  expandedGuide: {
    type: Boolean,
    default: false,
  },
})

const expandedGuide = ref(props.expandedGuide)
const itemUuid = ref(props.itemUuid)
const guides = ref(props.guides)
const publicAccess = ref(props.publicAccess)


function addGuide(itemUuid) {
  router.push({path: '/guides/add/', query: {item: itemUuid}})
}

</script>
