<template lang="pug">
div
  .row.text-center
    stat-box(:value="daysRemaining", caption="days reminaing")
    stat-box(:value="`\$${pledged.toFixed(2)}`", caption="pledged")
    stat-box(
      :value="`\$${remainingAmount.toFixed(2)}`",
      caption="left to raise"
    )

  .row.q-my-md
    .col-3.flex.flex-center
      .text-center.text-subtitle2 Goal Progress
    .col-9
      q-linear-progress(
        size="50px",
        :value="project.FundedPercentage / 100",
        color="secondary"
      )
        .absolute-full.flex.flex-center
          q-badge(
            color="white",
            text-color="black",
            :label="project.FundedPercentage + '%'"
          )
  .row.q-my-md
    .col-3.flex.flex-center
      .text-center.text-subtitle2 Campaign Deadline
    .col-9
      q-linear-progress(
        size="50px",
        :value="lengthPercentage",
        color="secondary"
      )
        .absolute-full.flex.flex-center
          q-badge(
            color="white",
            text-color="black",
            :label="(lengthPercentage * 100).toFixed(1) + '%'"
          )
  .row.text-center
    stat-box.col-md-3.col-sm-6(
      :value="project.donors.length",
      caption="donations"
    )
    stat-box.col-md-3.col-sm-6(
      :value="`\$${(pledged / project.donors.length).toFixed(2)}`",
      caption="average donation"
    )
    stat-box.col-md-3.col-sm-6(
      :value="`\$${(pledged / daysElapsed).toFixed(2)}`",
      caption="Pledged / day"
    )
    stat-box.col-md-3.col-sm-6(
      :value="`\$${remainingAmount ? (remainingAmount / daysRemaining).toFixed(2) : '--'}`",
      caption="Remaining / day"
    )
</template>

<script>
import { computed } from "vue"
import moment from "moment"
import StatBox from "components/StatBox.vue"
export default {
  name: "Stats",
  components: { StatBox },
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
      const remaining = goal.value - pledged.value
      return remaining > 0 ? remaining : 0
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
