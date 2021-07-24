<template lang="pug">
div {{ project.Name }}
</template>

<script>
export default {
  name: "Stats",
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {}
  },
}
</script>
