<template>
  <!-- Nothing found sticker -->
  <TracksNotFound
    v-if="tracksNotFound && isReady"
  />

  <!-- List of found items -->
  <IonList v-else>
    <TracksListItem
      v-for="item in items"
      :key="item.trackId"
      :track-id="item.trackId"
      :title="item.title"
      :author="item.author"
      :location="item.location"
      :date="item.date"
      :references="item.references"
      :playing-status="item.playingStatus"
      @click="onTrackClicked(item)"
    />
  </IonList>

  <IonInfiniteScroll
    @ionInfinite="onInfiniteSctoll"
    :disabled="!infiniteScrollEnabled"
  >
    <IonInfiniteScrollContent />
  </IonInfiniteScroll>
</template>


<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useSound } from '@vueuse/sound'
import {
  InfiniteScrollCustomEvent, IonInfiniteScroll,
  IonInfiniteScrollContent, IonList,
} from '@ionic/vue'
import { formatDate } from '@core/utils'
import { Track } from '@core/models'
import {
  useLibrary, TracksNotFound, type TracksFilterValue
} from '@lectorium/library'
import {
  PlaylistChangedEvent, useUserData, useConfig, TrackViewModel,
  PlayingStatus, TracksListItem
} from '@lectorium/shared'
import itemAddedSfx from '@lectorium/playlist/assets/item-added.mp3'

// ── Dependencies ────────────────────────────────────────────────────
const library  = useLibrary()
const userData = useUserData()
const config   = useConfig()
const { play: playItemAdded } = useSound(itemAddedSfx, { volume: .15 })

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  searchQuery: string
  filters: TracksFilterValue
}>()

const emit = defineEmits<{
  click: [trackId: string]
}>()

// ── State ───────────────────────────────────────────────────────────
const { searchQuery, filters } = toRefs(props)
const tracksNotFound = computed(() => items.value.length === 0)
const items = ref<TrackViewModel[]>([])
const infiniteScrollEnabled = ref(true)
const isReady = ref(false)

fetchData(searchQuery.value, config.locale.value, 0)

// ── Hooks ───────────────────────────────────────────────────────────
watchDebounced([searchQuery, filters], async (value) => {
  infiniteScrollEnabled.value = await fetchData(value[0], config.locale.value, 0)
}, { debounce: 250, maxWait: 1000, deep: true })


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

    const searchQueryTrackIds = query
      ? await library.search.search(query, 'Russian')
      : { ids: undefined };


    foundTracks = await library.tracks.getMany({
      ids: searchQueryTrackIds.ids,
      authors: props.filters.authors,
      locations: props.filters.locations,
      sources: props.filters.sources,
      languages: props.filters.languages,
      dates: props.filters.dates,
      duration: props.filters.duration,
      skip: offset,
      limit: 25,
    })

    // Map tracks to view model
    const loadedItems: TrackViewModel[] = []
    for (const i of foundTracks) {
      const location = await library.locations.getName(i.location, language)
      const author   = await library.authors.getOne(i.author)
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
        location: location,
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
