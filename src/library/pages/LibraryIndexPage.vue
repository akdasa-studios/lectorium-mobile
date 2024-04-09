<template>
  <PageWithHeader 
    title="Library"
    :loading="isLoading"
  >
    <TracksList
      :items="tracks"
      @click="onTrackClicked"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { PlayingStatus, TracksList } from '@/library/components'
import { useLibraryService } from '@/library/composables'
import { lecturesToViewModel } from '@/library/helpers/mappers'
import { usePlaylist, useAudioPlayer } from '@/shared/composables'
import { PageWithHeader } from '@/shared/components'

// ── Dependencies ────────────────────────────────────────────────────
const libraryService = useLibraryService()
const playlist = usePlaylist()
const audioPlayer = useAudioPlayer()

// ── State ───────────────────────────────────────────────────────────
const { state: tracks, isLoading } = useAsyncState(
  () => libraryService.getLecturesList().then(t => lecturesToViewModel(t)),
  [], { shallow: false }
)

// ── Hooks ───────────────────────────────────────────────────────────
watch([
  playlist.currentTrackId, audioPlayer.playing, audioPlayer.loading
], (
  [trackId, playing,  loading], 
  [lastTrackId]
) => {
  if (trackId) {
    onTrackPlayingStateChanged(
        trackId,
        playing || loading ? PlayingStatus.Playing : PlayingStatus.Paused
    );
  }

  // Track has changed, update state of it
  if (lastTrackId && trackId != lastTrackId) {
    onTrackPlayingStateChanged(lastTrackId, PlayingStatus.None);
  }
})

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(trackId: string) {
  if (playlist.currentTrackId.value === trackId) {
    audioPlayer.togglePlaying()
  } else {
    playlist.enqueue(trackId)
  }
}

function onTrackPlayingStateChanged(
  trackId: string, value: PlayingStatus
) {
  const track = tracks.value.find(x => x.id === trackId);
  if (track) { track.playingStatus = value }
}
</script>

