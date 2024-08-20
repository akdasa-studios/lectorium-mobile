<template>
  <NothingFound
    v-if="nothingFound && isReady"
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
import { formatDate } from '@core/utils'
import { useLibrary } from '@lectorium/library'
import { NothingFound, TracksList, TrackViewModel, PlayingStatus } from '@lectorium/playlist'
import itemAddedSfx from '@lectorium/playlist/assets/item-added.mp3'
import { Track } from '@core/models'
import { useUserData } from '@lectorium/shared'

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
const { state: items, execute, isReady } = useAsyncState<TrackViewModel[], [string], true>(
  async (p) => await fetchData(p),
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
async function fetchData(
  query: string
): Promise<TrackViewModel[]> {
  // TODO: use languge of application. Note: user can search in any language.
  // TODO: optimization: there is no reason to fetch all playlist items again and again, we can cache it
  // https://github.com/akdasa-studios/lectorium-mobile/issues/32
  const playlistItems = (await userData.playlistItems.service.getAll()).map(x => x.trackId)
  let foundTracks: Track[] = []
  if (query) {
    const foundTrackIds = await library.search.search(query, 'Russian');
    foundTracks = await library.tracks.getMany(foundTrackIds.ids)
  } else {
    foundTracks = await library.tracks.getAll()
  }

  return await Promise.all(
    foundTracks.map(async i => ({
      trackId: i.id,
      title: i.title,
      date: formatDate(i.date),
      location: await library.locations.getLocalizedName(i.location, 'ru'),
      references: await library.sources.getLocalizedReferences(i.references, 'ru'),
      playingStatus: playlistItems.includes(i.id)
          ? PlayingStatus.InQueue
          : PlayingStatus.None,
    }))
  )
}
</script>
