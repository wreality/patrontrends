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
      stats(:project="project")
</template>

<script>
import { defineComponent, ref, watch } from "vue"
import Stats from "components/Stats"
import { api } from "src/boot/axios"
export default defineComponent({
  name: "PageIndex",
  components: { Stats },
  setup() {
    const patronicityUrl = ref("")
    const errorMessage = ref("")
    const project = ref({})

    const slugRegex = /https:\/\/www.patronicity.com\/project\/([\w_]+)#!\/$/

    watch(patronicityUrl, async (newValue) => {
      if (!slugRegex.test(newValue)) {
        errorMessage.value = "Invalid patronicity URL"
        return
      }
      errorMessage.value = ""

      const slug = newValue.match(slugRegex)[1]

      try {
        const response = await api.get(`fetch?slug=${slug}`)
        console.log(response.data)
        if (response?.data?.success) {
          project.value = response.data.result
        } else {
          throw Error("Error processing result.")
        }
      } catch (e) {
        errorMessage.value = e.message
      }
    })
    return { patronicityUrl, project, errorMessage }
  },
})
</script>
