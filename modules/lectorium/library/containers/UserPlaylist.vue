<template>
  <PlaylistEmpty
    v-if="playlistEmpty"
  />
  <TracksList
    v-else
    :items="playlistItemViews"
    @click="onTrackClicked"
  />
</template>


<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Track } from '@core/models'
import { PlaylistEmpty } from '@lectorium/library'
import { PlayingStatus, TrackViewModel, TracksList } from '@lectorium/library/components'
import { useLibrary } from '@lectorium/library/composables'
import { useUserData } from '@lectorium/library'
import { useAudioPlayer } from '@lectorium/shared/composables'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()
const userData = useUserData()
const audioPlayer = useAudioPlayer()

// ── Interface ───────────────────────────────────────────────────────
const emit = defineEmits<{
  click: [trackId: string]
}>()

// ── State ───────────────────────────────────────────────────────────
const playlistItemViews = ref<TrackViewModel[]>([])
const playlistEmpty = computed(() => playlistItemViews.value.length === 0)

watch([audioPlayer.currentTrackId, audioPlayer.playing], async () => {
  playlistItemViews.value = await fetchData()
}, { immediate: true })

async function fetchData(): Promise<TrackViewModel[]> {
  const playlistItems = await userData.playlistItems.getAll()
  console.log(playlistItems)

  const tracks =
    (await Promise.all(
      playlistItems
        .map(i => i.trackId)
        .map(i => library.tracks.get(i))
      )).reduce((acc, track) => {
        acc[track.id] = track
        return acc
      }, {} as Record<string, Track>)

  return playlistItems.map(i => ({
    playlistItemId: i.id,
    trackId: tracks[i.trackId].id,
    location: tracks[i.trackId].location,
    references: tracks[i.trackId].references,
    title: tracks[i.trackId].title,
    playingStatus: audioPlayer.currentTrackId.value === i.trackId
      ? audioPlayer.playing.value ? PlayingStatus.Playing : PlayingStatus.Paused
      : PlayingStatus.None,
  }))

}

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(async () => {
  playlistItemViews.value = await fetchData()
})

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(playlistItem: TrackViewModel) {
  emit('click', playlistItem.trackId)
}
</script>
