<template lang="pug">
q-card
  q-card-section
    .text-h6 {{ project.Name }}
  q-card-section
    stats(:project="project", v-if="projectLoaded")
</template>

<script>
import { defineComponent, ref, onMounted, computed, toRef } from "vue"
import Stats from "components/Stats"
import { api } from "src/boot/axios"
export default defineComponent({
  name: "PageIndex",
  components: { Stats },
  props: {
    slug: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const project = ref({})
    const errorMessage = ref("")
    const slug = toRef(props, "slug")

    const projectLoaded = computed(() => {
      return project.value && Object.keys(project.value).length !== 0
    })

    onMounted(() => {
      fetchProject(slug.value)
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

    return { project, errorMessage, projectLoaded }
  },
})
</script>
