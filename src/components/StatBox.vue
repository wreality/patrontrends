<template lang="pug">
div
  .text-h6 {{ value }}
  .text-caption {{ caption }}
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
