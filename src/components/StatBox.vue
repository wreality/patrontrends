<template lang="pug">
div
  .text-h6 {{ value }}
  .text-caption {{ caption }}
    span(v-if="$slots.tooltip")
      q-icon.inline-tip(name="help")
        q-tooltip
          slot(name="tooltip")
</template>

<script>
export default {
  name: "StatBox",
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
  },
}
</script>
