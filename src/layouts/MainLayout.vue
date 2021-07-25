<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header(elevated="")
    q-toolbar
      q-toolbar-title Patronicity Trends
      div
        a(href="https://github.com/wreality/patrontrends") GitHub
  q-page-container.row.flex-center
    q-page.col-10.q-pt-md
      q-input.row(
        v-model="patronicityUrl",
        label="Patronicity Project URL",
        outlined,
        :error="errorMessage.length > 0",
        :error-message="errorMessage"
      )
      router-view(:key="$route.fullPath")
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue"
import { useRouter, useRoute } from "vue-router"

export default defineComponent({
  name: "MainLayout",

  components: {},
  setup() {
    const patronicityUrl = ref("")
    const errorMessage = ref("")
    const slugRegex = RegExp(
      "https://www.patronicity.com/project/([\\w_]+)#!/$"
    )
    const router = useRouter()
    const route = useRoute()

    watchEffect(() => {
      errorMessage.value = ""
      if (patronicityUrl.value === "") {
        if (route.params?.slug) {
          patronicityUrl.value = `https://www.patronicity.com/project/${route.params.slug}#!/`
        }
        return
      }
      if (!slugRegex.test(patronicityUrl.value)) {
        console.log(patronicityUrl.value)
        errorMessage.value = "Invalid patronicity URL"
        return
      }

      const slug = patronicityUrl.value.match(slugRegex)[1]

      router.push({ path: `/${slug}` })
    })
    return { patronicityUrl, errorMessage }
  },
})
</script>
