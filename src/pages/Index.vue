<template lang="pug">
q-card
  q-card-section
    q-btn.float-right(
      label="View on Patronicity.com",
      :href="projectUrl",
      type="a"
    )
    .text-h6 {{ project.Name }}
  stats(:project="project", v-if="projectLoaded")
.row.q-pt-md
  q-card.col-md-6
    q-card-section
      donations-per-day(:project="project", v-if="projectLoaded")
</template>

<script>
import { defineComponent, ref, onMounted, computed, toRef } from "vue"
import Stats from "components/Stats"
import { api } from "src/boot/axios"
import DonationsPerDay from "components/DonationsPerDay.vue"
export default defineComponent({
  name: "PageIndex",
  components: { Stats, DonationsPerDay },
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

    const projectUrl = computed(() => {
      return `https://www.patronicity.com/project/${slug.value}#!/`
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

    return { project, errorMessage, projectLoaded, projectUrl }
  },
})
</script>
