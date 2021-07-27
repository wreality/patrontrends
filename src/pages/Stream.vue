<template lang="pug">
.stream {{ pledged }}
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  toRef,
  onUnmounted,
} from "vue"
import { api } from "src/boot/axios"
export default defineComponent({
  name: "PageStream",
  props: {
    slug: {
      type: String,
      required: true,
      default: null,
    },
  },
  setup(props) {
    const project = ref({})
    const errorMessage = ref("")
    const slug = toRef(props, "slug")
    const currency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format
    const pledged = computed(() => {
      return project.value?.PledgeAmount
        ? currency(parseFloat(project.value.PledgeAmount))
        : ""
    })

    const projectLoaded = computed(() => {
      return project.value && Object.keys(project.value).length !== 0
    })

    let timer

    onMounted(() => {
      fetchProject()
      timer = setInterval(fetchProject, 60000)
    })

    onUnmounted(() => {
      clearInterval(timer)
    })

    const fetchProject = async () => {
      project.value = await api
        .get(`fetch?slug=${slug.value}`)
        .then((response) => {
          if (!response?.data) {
            throw Error("Unable to fetch project data.")
          }
          return response.data
        })
        .catch((error) => {
          errorMessage.value = error.message
          return {}
        })
    }

    return { project, errorMessage, projectLoaded, pledged }
  },
})
</script>
<style scoped>
div {
  font-weight: bold;
  font-size: 10em;
}
</style>
