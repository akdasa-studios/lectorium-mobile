<template>
  <TracksList
    :items="tracks"
    @click="onTrackClicked"
  />
</template>


<script setup lang="ts">
import { toRefs, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { Track } from '@core/models'
import { useLibrary } from '@lectorium/library/composables'
import { PlayingStatus, TrackViewModel, TracksList } from '../components';

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  searchQuery: string
}>()

const emit = defineEmits<{
  click: [trackId: string]
}>()

// ── State ───────────────────────────────────────────────────────────
const { searchQuery } = toRefs(props)

const { state: tracks, execute } = useAsyncState<TrackViewModel[], [string], true>(
  async (p) => (await library.tracks.getLecturesList(p)).map(x => mapToVewModel(x)),
  [], { resetOnExecute: false }
)

// ── Hooks ───────────────────────────────────────────────────────────
watch(searchQuery, async (value) => {
  await execute(0, value)
})

// ── Handlers ────────────────────────────────────────────────────────
function mapToVewModel(track: Track): TrackViewModel {
  return {
    trackId: track.id,
    location: track.location,
    references: track.references,
    title: track.title,
    playingStatus: PlayingStatus.None,
  }
}

function onTrackClicked(track: TrackViewModel) {
  emit('click', track.trackId)
}
</script>
