<template lang="pug">
.row
  q-card.q-mb-md.col(style="min-height: 380px")
    q-card-section
      q-btn.float-right(
        label="View on Patronicity.com",
        :href="projectUrl",
        type="a"
      )
      .text-h6 {{ project.Name }}
    stats(:project="project", v-if="projectLoaded")
.row
  .col-md-6.col-xs-12.q-pa-xs
    q-card
      q-card-section
        donations-per-day(:project="project", v-if="projectLoaded")
  .col-md-6.col-xs-12.q-pa-xs
    q-card
      q-card-section
        average-donations(:project="project", v-if="projectLoaded")
</template>

<script>
import { defineComponent, ref, onMounted, computed, toRef } from "vue"
import Stats from "components/Stats.vue"
import { api } from "src/boot/axios"
import DonationsPerDay from "components/DonationsPerDay.vue"
import AverageDonations from "components/AverageDonations.vue"
export default defineComponent({
  name: "PageIndex",
  components: { Stats, DonationsPerDay, AverageDonations },
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
