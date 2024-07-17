<template>
  <NothingFound
    v-if="nothingFound"
  />
  <TracksList
    v-else
    :items="items"
    @click="onTrackClicked"
  />
</template>


<script setup lang="ts">
import { computed, toRefs, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { useSound } from '@vueuse/sound'
import { useLibrary } from '@lectorium/library'
import { NothingFound, TracksList, TrackViewModel, PlayingStatus, useUserData } from '@lectorium/playlist'
import itemAddedSfx from '@lectorium/playlist/assets/item-added.mp3'


// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()
const userData = useUserData()
const { play: playItemAdded } = useSound(itemAddedSfx, { volume: .15 })

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  searchQuery: string
}>()

const emit = defineEmits<{
  click: [trackId: string]
}>()

// ── State ───────────────────────────────────────────────────────────
const { searchQuery } = toRefs(props)
const nothingFound = computed(() => items.value.length === 0)
const { state: items, execute } = useAsyncState<TrackViewModel[], [string], true>(
  async (p) => fetchData(p),
  [], { resetOnExecute: false }
)

// ── Hooks ───────────────────────────────────────────────────────────
watch(searchQuery, async (value) => {
  await execute(0, value)
})

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(track: TrackViewModel) {
  if (track.playingStatus == PlayingStatus.InQueue) { return }
  emit('click', track.trackId)
  playItemAdded()
  execute(150, searchQuery.value)
}

// ── Helpers ─────────────────────────────────────────────────────────
async function fetchData(query: string): Promise<TrackViewModel[]> {
  // TODO: optimization: there is no reason to fetch all playlist items
  // again and agian, we can cache it
  const [
    tracks,
    playlistItems
  ] = await Promise.all([
    library.tracks.getLecturesList(query),
    userData.playlistItems.service.getAll()
  ])

  const playlistItemsId = playlistItems.map(x => x.trackId)

  return tracks.map(track => ({
    trackId: track.id,
    location: track.location,
    references: track.references,
    title: track.title,
    playingStatus: playlistItemsId.includes(track.id)
                    ? PlayingStatus.InQueue
                    : PlayingStatus.None
  }))
}
</script>
