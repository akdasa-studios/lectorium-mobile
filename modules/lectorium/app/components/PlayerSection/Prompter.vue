<template>
  <p lang="ru"
    v-for="(paragraph, idx) in paragraphs"
    :key="idx"
    class="Prompter"
    :class="{
      'paragraph': paragraph[0].start <= time && paragraph[paragraph.length-1].end >= time
    }"
  >
    <Paragraph
      :start="paragraph[0].start"
    />
    <component
      v-for="(block, idx) in paragraph"
      :key="idx"
      :is="block.type === 'sentence' ? Sentence : Paragraph"
      :text="block.text"
      :start="block.start"
      :class="{
        'highlight': block.start <= time && block.end >= time
      }"
      @click="emit('rewind', block.start)"
    />
  </p>
</template>


<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import Sentence from './Sentence.vue'
import Paragraph from './Paragraph.vue'

// ── Interface ───────────────────────────────────────────────────────
export type Block = {
  type: string
  text: string
  start: number
  end: number
}

const props = defineProps<{
  blocks: Block[]
  time: number
}>()

const emit = defineEmits<{
  rewind: [time: number]
}>()

// ── State ───────────────────────────────────────────────────────────
const { blocks } = toRefs(props)
const paragraphs = ref<Array<Block[]>>([])

// ── Hooks ───────────────────────────────────────────────────────────
watch(blocks, update, { immediate: true })

// ── Helpers ─────────────────────────────────────────────────────────
function update() {
  paragraphs.value = []
  let lastParagraph: Block[] = []
  for (var block of props.blocks) {
    if (block.type === 'paragraph') {
      paragraphs.value.push(lastParagraph)
      lastParagraph = []
    } else {
      lastParagraph.push(block)
    }
  }
}
</script>


<style scoped>
.Prompter {
  color: rgba(var(--ion-color-oxford-blue-contrast-rgb), .3);
  hyphens: auto;
  -moz-hyphens: auto;
  /* text-align: justify; */
}
.paragraph {
  transition: all 0.5s;
  color: rgba(var(--ion-color-oxford-blue-contrast-rgb), .7);
  word-wrap: break-word;
}

.highlight {
  transition: all 0.5s;
  color: rgba(var(--ion-color-success-rgb), 1);
}
</style>