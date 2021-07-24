<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header(elevated="")
    q-toolbar
      q-toolbar-title Patronicity Trends
      div GitHub
  q-page-container
    q-page.q-mt-md
      .row.flex-center
        q-card.col-10
          q-input(
            v-model="patronicityUrl",
            label="Patronicity Project URL",
            outlined
          )
        q-card.col-10
          router-view
</template>

<script>
import { defineComponent, ref, watch } from "vue"
//import { api } from "src/boot/axios"

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const patronicityUrl = ref("")
    const errorMessage = ref("")

    const slugRegex = /https:\/\/www.patronicity.com\/project\/([\w_]+)#!\/$/

    watch(patronicityUrl, (newValue) => {
      if (!slugRegex.test(newValue)) {
        errorMessage.value = "Invalid patronicity URL"
        return
      }

      const slug = newValue.match(slugRegex)[1]
      const testURL = `https://patronicity.com/project/${slug}#!/`
      const options = {
        method: "GET",
        mode: "no-cors",
      }

      const request = new Request(testURL, options)

      fetch(request)
        .then((response) => response.text())
        .then((data) => {
          console.log(data)
          const project_id = data.match(/project-id="([0-9]+)"/)[1]

          console.log(project_id)
        })

      // api.get(`project/${slug}#!/`).then((result) => {
      //   const project_id = result.match(/project-id="([0-9]+)"/)[1]

      //   console.log(project_id)
      // })
    })
    return { patronicityUrl }
  },
})
</script>
