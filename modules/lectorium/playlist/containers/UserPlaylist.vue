<template>
  <PlaylistEmpty
    v-if="playlistEmpty && isReady"
  />
  <TracksList
    v-else
    :items="items"
    @click="onTrackClicked"
  />
</template>


<script setup lang="ts">
import { computed, watch } from 'vue'
import { Track } from '@core/models'
import { formatDate } from '@core/utils'
import { PlaylistEmpty, PlayingStatus, TrackViewModel, TracksList, useUserData } from '@lectorium/playlist'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { useAsyncState } from '@vueuse/core'
import { useLibrary } from '@lectorium/library'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()
const userData = useUserData()
const audioPlayer = useAudioPlayer()

// ── Interface ───────────────────────────────────────────────────────
const emit = defineEmits<{
  click: [trackId: string]
}>()

// ── State ───────────────────────────────────────────────────────────
const { state: items, isReady, execute: refresh } = useAsyncState<TrackViewModel[], [], false>(
  async () => await fetchData(), [], { shallow: false })
const playlistEmpty = computed(() => items.value.length === 0)

// ── Hooks ───────────────────────────────────────────────────────────
watch(audioPlayer.trackId, async (current, previous) => {
  const trackCurrent = items.value.find(x => x.trackId === current)
  const trackPrevious = items.value.find(x => x.trackId === previous)
  if (trackCurrent)  { trackCurrent.playingStatus = PlayingStatus.Playing }
  if (trackPrevious) { trackPrevious.playingStatus = PlayingStatus.None }
})

watch(audioPlayer.playing, async (current) => {
  const trackCurrent = items.value.find(x => audioPlayer.trackId.value === x.trackId)
  if (trackCurrent) { trackCurrent.playingStatus = current ? PlayingStatus.Playing : PlayingStatus.Paused }
})

watch(userData.playlistItems.changedAt, async () => {
  await refresh()
})

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(playlistItem: TrackViewModel) {
  emit('click', playlistItem.trackId)
}

async function fetchData(): Promise<TrackViewModel[]> {
  // Fetch playlist items
  const playlistItems = await userData.playlistItems.service.getAll()

  // Load all related tracks
  const tracks =
    (await Promise.all(
      playlistItems
        .map(i => i.trackId)
        .map(i => library.tracks.get(i))
      )).reduce((acc, track) => {
        acc[track.id] = track
        return acc
      }, {} as Record<string, Track>)

  // Map playlist items to view models
  return await Promise.all(playlistItems
    .sort((a, b) => a.order - b.order)
    .map(async i => ({
      order: i.order,
      trackId: tracks[i.trackId].id,
      location: await library.locations.getLocalizedName(tracks[i.trackId].location, 'ru'),
      date: formatDate(tracks[i.trackId].date),
      references: await library.sources.getLocalizedReferences(tracks[i.trackId].references, 'ru'),
      title: tracks[i.trackId].title,
      playingStatus: audioPlayer.trackId.value === i.trackId
        ? audioPlayer.trackId.value ? PlayingStatus.Playing : PlayingStatus.Paused
        : PlayingStatus.None,
    })))
}
</script>
