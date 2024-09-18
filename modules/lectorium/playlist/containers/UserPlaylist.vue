<template>
  <PlaylistEmpty
    v-if="playlistEmpty && isReady"
  />
  <TracksListSwipable
    v-else
    :items="items"
    @click="onTrackClicked"
    @remove="onTrackRemoved"
  />
</template>


<script setup lang="ts">
import { computed, watch } from 'vue'
import { formatDate } from '@core/utils'
import { getLocalizedTitle } from '@core/models'
import { PlaylistEmpty, PlayingStatus, TrackViewModel, TracksListSwipable } from '@lectorium/playlist'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { useAsyncState } from '@vueuse/core'
import { useLibrary } from '@lectorium/library'
import { PlaylistChangedEvent, useUserData, useConfig } from '@lectorium/shared'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()
const userData = useUserData()
const audioPlayer = useAudioPlayer()
const config = useConfig()

// ── Interface ───────────────────────────────────────────────────────
const emit = defineEmits<{
  click: [trackId: string]
}>()

// ── State ───────────────────────────────────────────────────────────
const { state: items, isReady, execute: refresh } = useAsyncState<TrackViewModel[], [], false>(
  async () => await fetchData(), [], { shallow: false, resetOnExecute: false })
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

userData.playlist.onChange(async (event: PlaylistChangedEvent) => {
  await refresh()
})

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(playlistItem: TrackViewModel) {
  emit('click', playlistItem.trackId)
}

async function onTrackRemoved(playlistItem: TrackViewModel) {
  await userData.playlist.removeTrack(playlistItem.trackId)
  await refresh()
}

async function fetchData(): Promise<TrackViewModel[]> {
  const result: TrackViewModel[] = []
  const playlistItems = (
    await userData.playlist.getAll()
  ).sort((a, b) => a.order - b.order)

  for (const item of playlistItems) {
    const track = await library.tracks.getTrack(item.trackId)
    const title = getLocalizedTitle(track.title, config.locale.value)
    const date = formatDate(track.date)
    const location = await library.locations.getLocalizedName(track.location, 'ru')
    const references = await library.sources.getLocalizedReferences(track.references, 'ru')
    const author = await library.authors.getLocalizedName(track.author, 'ru', 'short')
    const playingStatus =
        (item.transcriptStatus === 'unknown' || item.mediaStatus !== 'downloaded')
          ? PlayingStatus.Loading
          : audioPlayer.trackId.value === track.id
            ? audioPlayer.trackId.value ? PlayingStatus.Playing : PlayingStatus.Paused
            : PlayingStatus.None
    result.push({
      trackId: item.trackId,
      location, references, date,
      title, playingStatus, author
    })
  }

  return result
}
</script>
