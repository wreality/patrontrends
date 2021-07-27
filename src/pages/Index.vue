<template lang="pug">
div
  .row(v-if="slug")
    q-card.q-mb-md.col(style="min-height: 380px")
      q-inner-loading(:showing="!projectLoaded")
        q-spinner-gears(size="50px", color="primary")
      q-card-section(v-if="projectLoaded")
        q-btn.float-right(
          label="View on Patronicity.com",
          :href="projectUrl",
          type="a"
        )
        .text-h6 {{ project.Name }}
      stats(:project="project", v-if="projectLoaded")
  .row(v-if="projectLoaded")
    .col-md-6.col-xs-12.q-pa-xs
      q-card
        q-card-section
          .text-h6 Donations over Time
          donations-per-day(:project="project")
    .col-md-6.col-xs-12.q-pa-xs
      q-card
        q-card-section
          .text-h6 Average Donations
          average-donations(:project="project")
    .col-md-6.col-xs-12.q-pa-xs
      q-card
        q-card-section
          .text-h6 Donation Size
          donations-histo(:project="project")
  .row
    q-card.col
      q-card-section(v-if="!slug")
        q-banner.bg-accent.text-white(rounded) Paste a patronicity.com project URL above to get started.
      q-card-section
        .text-h6.text-weight-bolder About this Site
        :markdown-it
          This is a quick and dirty side project by the folks behind
          [Lansing Makers Network's Patronicity campaign](https://www.patronicity.com/project/lansing_makers_network_make_the_move#!/).
          We use the APIs powering the Patronicity site to show you information about a campaign.
          Everything is delivered directly to your browser and we maintain no data and do no data analysis on our servers All of that is performed by your browser.


          This site is hosted on the free tier of [Netlify](https://www.netlify.com).  If you're into Jamstack stuff, you should absolutely show them some love
          and see what they have to offer. If you find this site useful, feel free to consider supporting
          [our campaign](https://www.patronicity.com/project/lansing_makers_network_make_the_move#!/). We'll keep this site up and running as long as it doesn't cost us anything. 😁
        p.text-weight-bolder
          :markdown-it
            IMPORTANT: This site is not maintained, endorsed or supported by Patronicity. Please don't pester their support with questions.
            The analysis you see here is also our naive attempt at interpreting the available data. If you notice a discrepency, assume its our fault, not Patronicity's.
            For campaigns: your campaign is your business--make your strategic decisions with your own data analysis, not ours (no matter how awesome we seem).
            For supporters, take this data with a grain of salt.  We're not statisticians.
</template>

<script>
import { defineComponent, ref, onMounted, computed, toRef } from "vue"
import Stats from "components/Stats.vue"
import { api } from "src/boot/axios"
import DonationsPerDay from "components/DonationsPerDay.vue"
import AverageDonations from "components/AverageDonations.vue"
import DonationsHisto from "components/DonationsHisto.vue"
export default defineComponent({
  name: "PageIndex",
  components: { Stats, DonationsPerDay, AverageDonations, DonationsHisto },
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
      if (slug.value) {
        fetchProject(slug.value)
      }
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
