<template>
  <p lang="ru"
    v-for="paragraph in text"
    :key="paragraph.blocks[0].start"
    class="Prompter"
    :class="{
      'paragraph': paragraph.blocks[0].start <= time && paragraph.blocks[paragraph.blocks.length-1].end >= time
    }"
  >
    <div class="timestamp">
      {{ formatTime(paragraph.blocks[0].start) }}
    </div>

    <span
      v-for="block in paragraph.blocks"
      :key="block.start"
      :class="{
        'highlight': block.start <= time && block.end >= time
      }"
      @click="emit('rewind', block.start)"
    >
      {{ block.text }}&nbsp;
    </span>
  </p>
</template>


<script setup lang="ts">
// ── Interface ───────────────────────────────────────────────────────
export type Paragraph = {
  blocks: Block[]
}

export type Block = {
  text: string
  start: number
  end: number
}

defineProps<{
  text: Paragraph[]
  time: number
}>()

const emit = defineEmits<{
  rewind: [time: number]
}>()

// ── Computed ───────────────────────────────────────────────────────
function formatTime(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor((ms / 1000 / 60 / 60));

  let formattedTime;

  if (ms < 60000) {
    formattedTime = [minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
  } else {
    if (hours === 0) {
      formattedTime = [minutes.toString(), seconds.toString().padStart(2, "0")].join(":");
    } else {
      formattedTime = [hours.toString(), minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
    }
  }

  return formattedTime;
}
</script>


<style scoped>
.Prompter {
  color: rgba(var(--ion-color-oxford-blue-contrast-rgb), .3);
  /* word-wrap: break-word; */
  /* word-break: break-all; */
  hyphens: auto;
  -moz-hyphens: auto;
  /* text-align: justify; */
  /* text-justify: inter-word; */
}
.timestamp {
  font-size: .6rem;
}

.paragraph {
  transition: all 0.5s;
  color: rgba(var(--ion-color-oxford-blue-contrast-rgb), .7);
  word-wrap: break-word;
}

.highlight {
  word-wrap: break-word;
  transition: all 0.5s;
  /* color: var(--ion-color-oxford-blue-contrast-tint); */
  color: rgba(var(--ion-color-success-rgb), 1);
}
</style>