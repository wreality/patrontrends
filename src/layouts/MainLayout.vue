<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header(elevated="")
    q-toolbar
      q-toolbar-title
        router-link.text-white.decoration-none(to="/") Patronicity Trends
      div
        a.text-white.decoration-none(
          href="https://github.com/wreality/patrontrends"
        ) GitHub
  q-page-container.row.flex-center
    q-page.col-10.q-pt-md
      q-input.row(
        v-model="patronicityUrl",
        label="Paste a Patronicity Project URL to view stats",
        outlined,
        :error="errorMessage.length > 0",
        :error-message="errorMessage"
      )
      router-view(:key="$route.fullPath")
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue"
import { useRouter } from "vue-router"

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

    watchEffect(() => {
      errorMessage.value = ""
      if (patronicityUrl.value === "") {
        return
      }
      if (!slugRegex.test(patronicityUrl.value)) {
        console.log(patronicityUrl.value)
        errorMessage.value = "Invalid patronicity URL"
        return
      }

      const slug = patronicityUrl.value.match(slugRegex)[1]
      patronicityUrl.value = ""

      router.push({ path: `/${slug}` })
    })
    return { patronicityUrl, errorMessage }
  },
})
</script>
