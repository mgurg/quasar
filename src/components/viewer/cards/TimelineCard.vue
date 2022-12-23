<template>
  <q-card bordered class="my-card no-shadow q-my-xs">
  <!--  Timeline -->
  <div :style="expandedTimeline ? 'border-left: 5px solid #a04d2c':''">
    <q-card-section class="q-py-sm">
      <div class="row q-col-gutter-xs">
        <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedTimeline = !expandedTimeline">
          {{ $t("Timeline") }}
        </div>
        <q-space></q-space>
        <q-btn :icon="expandedTimeline ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat
               round
               @click="expandedTimeline = !expandedTimeline"/>
      </div>

    </q-card-section>

    <q-separator v-if="!expandedTimeline"/>
    <q-slide-transition>
      <div v-show="expandedTimeline">

        <q-card-section>
          <div class="q-px-lg q-pb-md">
            <q-timeline :layout="layout" color="secondary">
              <q-timeline-entry heading>
                Timeline heading
                <br>
                ({{ $q.screen.lt.sm ? 'Dense' : ($q.screen.lt.md ? 'Comfortable' : 'Loose') }} layout)
              </q-timeline-entry>

              <q-timeline-entry
                side="left"
                subtitle="February 22, 1986"
                title="Event Title"
              >
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit
                  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </q-timeline-entry>

              <q-timeline-entry
                icon="delete"
                side="right"
                subtitle="February 21, 1986"
                title="Event Title"
              >
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit
                  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </q-timeline-entry>

              <q-timeline-entry heading>November, 2017</q-timeline-entry>

              <q-timeline-entry
                side="left"
                subtitle="February 22, 1986"
                title="Event Title"
              >
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit
                  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </q-timeline-entry>

              <q-timeline-entry
                side="right"
                subtitle="February 22, 1986"
                title="Event Title"
              >
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit
                  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </q-timeline-entry>

              <q-timeline-entry
                color="orange"
                icon="done_all"
                side="left"
                subtitle="February 22, 1986"
                title="Event Title"
              >
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit
                  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </q-timeline-entry>

              <q-timeline-entry
                side="right"
                subtitle="February 22, 1986"
                title="Event Title"
              >
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit
                  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </q-timeline-entry>

              <q-timeline-entry
                side="left"
                subtitle="February 22, 1986"
                title="Event Title"
              >
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit
                  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </q-timeline-entry>
            </q-timeline>
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>
  </div>
  </q-card>
</template>

<script setup>
import {computed, ref} from "vue";
import {useQuasar} from "quasar";

const $q = useQuasar();

const props = defineProps({
  expandedTimeline: {
    type: Boolean,
    default: false,
  },
})

const expandedTimeline = ref(props.expandedTimeline)

const layout = computed(() => {
  return $q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose')
});

</script>
