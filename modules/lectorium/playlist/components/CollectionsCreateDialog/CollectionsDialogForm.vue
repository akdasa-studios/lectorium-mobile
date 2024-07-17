<template>
  <IonContent>
    <IonList lines="full" class="ion-no-margin ion-no-padding">
      <IonItem>
        <IonLabel position="stacked">Title</IonLabel>
        <IonInput aria-label="First Name" type="text" v-model="title" />
      </IonItem>

      <IonItem :button="true" @click="emit('selectAuthors')">
        <IonLabel>
          Authors
        </IonLabel>
        <IonNote slot="end">{{ authorsCount }}</IonNote>
      </IonItem>

      <IonItem :button="true" @click="emit('selectSources')">
        <IonLabel>
          Sources
        </IonLabel>
        <IonNote slot="end">{{ sourcesCount }}</IonNote>
      </IonItem>

      <IonItem :button="true" @click="emit('selectLanguages')">
        <IonLabel>
          Languages
        </IonLabel>
        <IonNote slot="end">{{ languagesCount }}</IonNote>
      </IonItem>
    </IonList>
  </IonContent>
</template>


<script setup lang="ts">
import { IonContent, IonList, IonItem, IonLabel, IonNote, IonInput } from '@ionic/vue'

// ── Interface ───────────────────────────────────────────────────────
defineProps<{
  authorsCount: number,
  sourcesCount: number,
  languagesCount: number,
}>();

const title = defineModel<string>('title', { default: '' })

const emit = defineEmits<{
  selectAuthors: [],
  selectSources: [],
  selectLanguages: [],
}>();
</script>
