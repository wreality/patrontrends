<template lang="pug">
q-page.q-mt-md
  .row.flex-center
    q-card.col-10
      q-input(
        v-model="patronicityUrl",
        label="Patronicity Project URL",
        outlined,
        :error="errorMessage.length > 0",
        :error-message="errorMessage"
      )
    q-card.col-10
      stats(:project="project", v-if="projectLoaded")
</template>

<script>
import { defineComponent, ref, watch, computed } from "vue"
import Stats from "components/Stats"
import { api } from "src/boot/axios"
export default defineComponent({
  name: "PageIndex",
  components: { Stats },
  setup() {
    const patronicityUrl = ref("")
    const errorMessage = ref("")
    const project = ref({})
    const projectLoaded = computed(() => {
      return project.value && Object.keys(project.value).length !== 0
    })

    const slugRegex = /https:\/\/www.patronicity.com\/project\/([\w_]+)#!\/$/

    watch(patronicityUrl, async (newValue) => {
      project.value = {}
      if (!slugRegex.test(newValue)) {
        errorMessage.value = "Invalid patronicity URL"
        return
      }
      errorMessage.value = ""

      const slug = newValue.match(slugRegex)[1]

      try {
        const response = await api.get(`fetch?slug=${slug}`)
        console.log(response.data)
        if (response?.data) {
          project.value = response.data
        } else {
          throw Error("Error processing result.")
        }
      } catch (e) {
        errorMessage.value = e.message
      }
    })
    return { patronicityUrl, project, errorMessage, projectLoaded }
  },
})
</script>
