<template>
  <NothingFound
    v-if="nothingFound && isReady"
  />
  <TracksList
    v-else
    :items="items"
    @click="onTrackClicked"
  />
  <IonInfiniteScroll
    @ionInfinite="onInfiniteSctoll"
    :disabled="!infiniteScrollEnabled"
  >
    <IonInfiniteScrollContent></IonInfiniteScrollContent>
  </IonInfiniteScroll>
</template>


<script setup lang="ts">
import { InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue'
import { watchDebounced } from '@vueuse/core'
import { computed, ref, toRefs } from 'vue'
import { useSound } from '@vueuse/sound'
import { formatDate } from '@core/utils'
import { Track } from '@core/models'
import { useLibrary } from '@lectorium/library'
import { NothingFound, TracksList, TrackViewModel, PlayingStatus } from '@lectorium/playlist'
import itemAddedSfx from '@lectorium/playlist/assets/item-added.mp3'
import { PlaylistChangedEvent, useUserData, useConfig } from '@lectorium/shared'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()
const userData = useUserData()
const config = useConfig()
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
const items = ref<TrackViewModel[]>([])
const infiniteScrollEnabled = ref(true)
const isReady = ref(false)

fetchData(searchQuery.value, config.locale.value, 0)

// ── Hooks ───────────────────────────────────────────────────────────
watchDebounced(searchQuery, async (value) => {
  infiniteScrollEnabled.value = await fetchData(value, config.locale.value, 0)
}, { debounce: 250, maxWait: 1000 })

userData.playlist.onChange(async (e: PlaylistChangedEvent) => {
  if (e.event !== 'added') { return }

  items.value = items.value.map(i => {
    if (i.trackId === e.item.trackId) {
      return { ...i, playingStatus: PlayingStatus.InQueue }
    }
    return i
  })
})

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(track: TrackViewModel) {
  if (track.playingStatus == PlayingStatus.InQueue) { return }
  track.playingStatus = PlayingStatus.InQueue
  emit('click', track.trackId)
  playItemAdded()
}

async function onInfiniteSctoll(e: InfiniteScrollCustomEvent) {
  infiniteScrollEnabled.value = await fetchData(
    searchQuery.value, config.locale.value, items.value.length)
  e.target.complete()
}

// ── Helpers ─────────────────────────────────────────────────────────
async function fetchData(
  query: string,
  language: string,
  offset: number = 0,
): Promise<boolean> {
  try {
    // TODO: use languge of application. Note: user can search in any language.
    // TODO: optimization: there is no reason to fetch all playlist items again and again, we can cache it
    // https://github.com/akdasa-studios/lectorium-mobile/issues/32
    const playlistItems = (await userData.playlist.getAll()).map(x => x.trackId)
    let foundTracks: Track[] = []
    if (query) {
      const foundTrackIds = await library.search.search(query, 'Russian');
      const tracksToLoad = foundTrackIds.ids.slice(offset, offset + 25)
      foundTracks = await library.tracks.getMany(tracksToLoad)
    } else {
      foundTracks = await library.tracks.getAll({ skip: offset, limit: 25 })
    }

    // Map tracks to view model
    const loadedItems: TrackViewModel[] = []
    for (const i of foundTracks) {
      const author   = await library.authors.getOne(i.author)
      const location = await library.locations.getOne(i.location)
      const title    = i.getTitle(language)

      const references = []
      for (const reference of i.references) {
        const source           = await library.sources.getOne(reference[0])
        const sourceShortName  = source.getName(language, 'short')
        const referenceNumbers = reference.slice(1).join('.')
        references.push(`${sourceShortName} ${referenceNumbers}`)
      }

      loadedItems.push({
        trackId: i._id,
        date: formatDate(i.date),
        title: title,
        author: author.getName(language, 'short'),
        location: location.getName(language),
        references: references,
        playingStatus: playlistItems.includes(i._id)
            ? PlayingStatus.InQueue
            : PlayingStatus.None,
      })
    }

    if (offset === 0) {
      items.value = loadedItems
    } else {
      items.value = [...items.value, ...loadedItems]
    }

    return foundTracks.length > 0
  } catch (e) {
    console.error("Error", e,  JSON.stringify(e))
    return false
  } finally {
    isReady.value = true
  }
}
</script>
