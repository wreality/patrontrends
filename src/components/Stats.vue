<template lang="pug">
div {{ project.Name }}
  .row
    .col-3 Goal Progress
    q-linear-progress.col-9(
      size="50px",
      :value="project.FundedPercentage / 100",
      color="accent"
    )
      .absolute-full.flex.flex-center
        q-badge(
          color="white",
          text-color="accent",
          :label="project.FundedPercentage + '%'"
        )
  .row
    .col-3 Campaign Deadline
    q-linear-progress.col-9(
      size="50px",
      :value="lengthPercentage",
      color="accent"
    )
      .absolute-full.flex.flex-center
        q-badge(
          color="white",
          text-color="accent",
          :label="(lengthPercentage * 100).toFixed(1) + '%'"
        )
  .row
    .col-4 Average Donation / Day
    .col-8 ${{ (pledged / daysElapsed).toFixed(2) }}
  .row
    .col-4 Remaining Donation / Day
    .col-8 ${{ (remainingAmount / daysRemaining).toFixed(2) }}
</template>

<script>
import { computed } from "vue"
import moment from "moment"

export default {
  name: "Stats",
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const lengthPercentage = computed(() => {
      return daysElapsed.value / campaignLength.value
    })

    const campaignLength = computed(() => {
      return moment(props.project.EndDate).diff(projectStart.value, "days")
    })

    const daysElapsed = computed(() => {
      return campaignLength.value - daysRemaining.value
    })

    const daysRemaining = computed(() => {
      const days = moment(props.project.EndDate).diff(moment(), "days")
      return days > 0 ? days : 0
    })
    const projectStart = computed(() => {
      const startEvent = Object.entries(props.project.timeline).find(
        // eslint-disable-next-line
        ([_, v]) => {
          return v.type === "event" && v.subtype == "campaign_started"
        }
      )[1]
      return moment(startEvent.date)
    })

    const pledged = computed(() => {
      return parseFloat(props.project.PledgeAmount)
    })

    const goal = computed(() => {
      return parseFloat(props.project.Goal)
    })

    const remainingAmount = computed(() => {
      return goal.value - pledged.value
    })

    return {
      projectStart,
      daysRemaining,
      campaignLength,
      lengthPercentage,
      daysElapsed,
      pledged,
      remainingAmount,
      goal,
    }
  },
}
</script>
