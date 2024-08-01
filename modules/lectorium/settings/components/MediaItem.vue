<template>
  <IonItem>
    <IonIcon
      v-if="statusIcon.icon"
      aria-hidden="true"
      :icon="statusIcon.icon"
      :color="statusIcon.color"
      slot="end"
    />
    <IonLabel class="ion-text-nowrap">
      <h3>
        {{ title }}
      </h3>
      <p>{{ size }}</p>
    </IonLabel>
  </IonItem>
</template>


<script setup lang="ts">
import { IonItem, IonLabel, IonIcon } from '@ionic/vue'
import { cloudDownloadOutline, cloudOutline } from 'ionicons/icons'
import { computed } from 'vue';

// ── Interface ───────────────────────────────────────────────────────
export type DownloadingStatus = 'downloaded' | 'downloading' | 'pending' | 'failed'
export type MediaItemViewModel = {
  title: string
  size: string
  status: DownloadingStatus
}
const props = defineProps<MediaItemViewModel>()


// ── State ───────────────────────────────────────────────────────────
type StatusIconMap = {
  [key in DownloadingStatus]: { icon?: string, color?: string }
}

const statusIconMaps: StatusIconMap = {
  'downloaded':  { icon: undefined },
  'downloading': { icon: cloudDownloadOutline, color: 'primary' },
  'pending':     { icon: cloudOutline,         color: 'dark'    },
  'failed':      { icon: cloudOutline,         color: 'danger'  },
}
const statusIcon = computed(
  () => statusIconMaps[props.status]
)
</script>
