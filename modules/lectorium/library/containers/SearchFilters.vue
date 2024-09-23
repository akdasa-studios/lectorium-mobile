<template>
  <!-- Chips representing filters -->
  <SearchFilterChips
    :filters="filterChipStates"
    @click="onFilterChipClicked"
    @remove="onFilterChipRemoved"
  />

  <!-- Authors selection dialog -->
  <ListItemsSelectorDialog
    v-model:items="authors"
    :open="currentOpenFilter == 'author'"
    :title="$t('filter-author')"
    @close="currentOpenFilter = ''"
  />

  <!-- Sources selection dialog -->
  <ListItemsSelectorDialog
    v-model:items="sources"
    :open="currentOpenFilter == 'source'"
    :title="$t('filter-source')"
    @close="currentOpenFilter = ''"
  />

  <!-- Locations selection dialog -->
  <ListItemsSelectorDialog
    v-model:items="locations"
    :open="currentOpenFilter == 'location'"
    :title="$t('filter-location')"
    @close="currentOpenFilter = ''"
  />

  <!-- Languages selection dialog -->
  <ListItemsSelectorDialog
    v-model:items="languages"
    :open="currentOpenFilter == 'language'"
    :title="$t('filter-language')"
    @close="currentOpenFilter = ''"
  />

  <!-- Duration selection dialog -->
  <ListItemsSelectorDialog
    v-model:items="durations"
    :open="currentOpenFilter == 'duration'"
    :title="$t('filter-duration')"
    @close="currentOpenFilter = ''" />

  <!-- Date range selection dialog -->
  <DateRangeSelectorDialog
    v-model="dates"
    :open="currentOpenFilter == 'date'"
    :title="$t('filter-date')"
    @close="currentOpenFilter = ''"
  />
</template>


<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useFluent } from 'fluent-vue'
import {
  ListItemsSelectorDialog, SelectDialogItem, DateRangeSelectorDialog
} from '@lectorium/shared/components'
import {
  SearchFilterChips, useLibrary, type TracksFilterValue
} from '@lectorium/library'

// ── Interface ───────────────────────────────────────────────────────
const value = defineModel<TracksFilterValue>({ required: true })

// ── Dependencies ────────────────────────────────────────────────────
const { $t } = useFluent()
const library = useLibrary()

// ── State ───────────────────────────────────────────────────────────
const currentOpenFilter = ref<string>('')
const filterChipStates  = computed(() => [
  { id: 'author',   title: $t('filter-author'),   applied: value.value?.authors   !== undefined },
  { id: 'source',   title: $t('filter-source'),   applied: value.value?.sources   !== undefined },
  { id: 'location', title: $t('filter-location'), applied: value.value?.locations !== undefined },
  { id: 'language', title: $t('filter-language'), applied: value.value?.languages !== undefined },
  { id: 'duration', title: $t('filter-duration'), applied: value.value?.duration  !== undefined },
  { id: 'date',     title: $t('filter-date'),     applied: value.value?.dates     !== undefined },
])
const authors   = ref<SelectDialogItem[]>([])
const sources   = ref<SelectDialogItem[]>([])
const locations = ref<SelectDialogItem[]>([])
const languages = ref<SelectDialogItem[]>([])
const durations = ref<SelectDialogItem[]>([
  { id: 'short',      title: $t('filter-duration-short'),      checked: false },
  { id: 'medium',     title: $t('filter-duration-medium'),     checked: false },
  { id: 'long',       title: $t('filter-duration-long'),       checked: false },
  { id: 'extra-long', title: $t('filter-duration-extra-long'), checked: false },
])
const dates = ref<{ from: string, to: string }>({
  from: '',
  to:   '',
})


// ── Hooks ───────────────────────────────────────────────────────────
watch(authors, (authors) => {
  const selectedAuthors = authors
    .filter((author) => author.checked)
    .map((author) => author.id)
  value.value.authors = selectedAuthors.length > 0
    ? selectedAuthors
    : undefined
}, { deep: true })

watch(sources, (sources) => {
  const selectedSources = sources
    .filter((source) => source.checked)
    .map((source) => source.id)
  value.value.sources = selectedSources.length > 0
    ? selectedSources
    : undefined
}, { deep: true })

watch(locations, (locations) => {
  const selectedLocations = locations
    .filter((location) => location.checked)
    .map((location) => location.id)
  value.value.locations = selectedLocations.length > 0
    ? selectedLocations
    : undefined
}, { deep: true })

watch(languages, (languages) => {
  const selectedLanguages = languages
    .filter((language) => language.checked)
    .map((language) => language.id)
  value.value.languages = selectedLanguages.length > 0
    ? selectedLanguages
    : undefined
}, { deep: true })

watch(durations, (durations) => {
  const selectedDurations = durations
    .filter((duration) => duration.checked)
    .map((duration) => duration.id)
  if (selectedDurations.length === 0) {
    value.value.duration = undefined
    return
  } else {
    var minDuration = Number.MAX_VALUE
    var maxDuration = 0
    for (const filter of selectedDurations) {
      if (filter == 'short')      { minDuration = Math.min(0,  minDuration); maxDuration = Math.max(maxDuration, 20) }
      if (filter == 'medium')     { minDuration = Math.min(20, minDuration); maxDuration = Math.max(maxDuration, 45) }
      if (filter == 'long')       { minDuration = Math.min(45, minDuration); maxDuration = Math.max(maxDuration, 90) }
      if (filter == 'extra-long') { minDuration = Math.min(90, minDuration); maxDuration = Math.max(maxDuration, 60*90*90) }
    }
    value.value.duration = {
      min: minDuration * 60,
      max: maxDuration * 60,
    }
  }
}, { deep: true })

watch(dates, (dates) => {
  value.value.dates =
    dates.from === '' && dates.to === ''
      ? undefined
      : { from: dates.from, to: dates.to }
}, { deep: true })

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(loadFilters)

// ── Handlers ────────────────────────────────────────────────────────
function onFilterChipClicked(filterId: string) {
  currentOpenFilter.value = filterId
}

function onFilterChipRemoved(filterId: string) {
  if (filterId === 'author') {
    value.value.authors = undefined
    authors.value.forEach((author) => author.checked = false)
  }
  if (filterId === 'source') {
    value.value.sources = undefined
    sources.value.forEach((source) => source.checked = false)
  }
  if (filterId === 'location') {
    value.value.locations = undefined
    locations.value.forEach((location) => location.checked = false)
  }
  if (filterId === 'language') {
    value.value.languages = undefined
    languages.value.forEach((language) => language.checked = false)
  }
  if (filterId === 'duration') {
    value.value.duration = undefined
    durations.value.forEach((duration) => duration.checked = false)
  }
  if (filterId === 'date') {
    value.value.dates = undefined
    dates.value = {
      from: '',
      to: '',
    }
  }
}

// ── Helpers ─────────────────────────────────────────────────────────
async function loadFilters() {
  authors.value = (await library.authors.getAll())
    .map((author) => ({
      id: author._id,
      title: author.getName('ru', 'full'),
      checked: false,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))

  sources.value = (await library.sources.getAll())
    .map((source) => ({
      id: source._id,
      title: source.getName('ru', 'full'),
      checked: false,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))

  locations.value = (await library.locations.getAll())
    .map((location) => ({
      id: location._id,
      title: location.getName('ru'),
      checked: false,
    })).sort((a, b) => a.title.localeCompare(b.title))

  languages.value = (await library.languages.getAll())
    .map((language) => ({
      id: language.code,
      title: language.name,
      checked: false,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}
</script>