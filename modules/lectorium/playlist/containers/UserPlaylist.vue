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
import { useAsyncState } from '@vueuse/core'
import { formatDate } from '@core/utils'
import { PlaylistEmpty, TracksListSwipable } from '@lectorium/playlist'
import { useLibrary } from '@lectorium/library'
import {
  PlaylistChangedEvent, useUserData, useConfig, useAudioPlayer,
  PlayingStatus, TrackViewModel
} from '@lectorium/shared'

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
  const language = config.locale.value
  const result: TrackViewModel[] = []
  const playlistItems = (
    await userData.playlist.getAll()
  ).sort((a, b) => a.order - b.order)

  for (const item of playlistItems) {
    const references = []
    const track      = await library.tracks.getOne(item.trackId)
    const author     = await library.authors.getOne(track.author)
    const location   = await library.locations.getName(track.location, language)

    for (const reference of track.references) {
      if (reference.length === 0) { continue }
      const source           = await library.sources.getOne(reference[0])
      const sourceShortName  = source.getName(language, 'short')
      const referenceNumbers = reference.slice(1).join('.')
      references.push(`${sourceShortName} ${referenceNumbers}`)
    }

    const playingStatus =
        (item.transcriptStatus === 'unknown' || item.mediaStatus !== 'downloaded')
          ? PlayingStatus.Loading
          : audioPlayer.trackId.value === track._id
            ? audioPlayer.trackId.value ? PlayingStatus.Playing : PlayingStatus.Paused
            : PlayingStatus.None

    result.push({
      trackId: item.trackId,
      date: track.date ? formatDate(track.date) : '',
      location: location,
      author: author.getName(language, 'short'),
      title: track.getTitle(config.locale.value),
      references,
      playingStatus,
    })
  }

  return result
}
</script>
