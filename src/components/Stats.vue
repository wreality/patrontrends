<template lang="pug">
q-card-section
  .row.text-center
    stat-box.col-md-4.col-xs-12(
      :value="daysRemaining",
      caption="days reminaing"
    )
    stat-box.col-md-4.col-xs-12(:value="currency(pledged)", caption="pledged")
    stat-box.col-md-4.col-xs-12(
      :value="currency(remainingAmount)",
      caption="left to raise"
    )

  .row.q-my-md
    .col-3.flex.flex-center
      .text-center.text-subtitle2 Goal Progress
        q-icon.inline-tip(name="help")
          q-tooltip
            | Percentage of the way to the campaign's pledge goal.
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
        q-icon.inline-tip(name="help")
          q-tooltip
            | Percentage of the way to the campaign ending date.
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
q-card-section.bg-accent.text-white
  .row.text-center
    stat-box.col-md-3.col-sm-6.col-xs-6(
      :value="project.donors.length",
      caption="pledges"
    )
      template(#tooltip)
        | Number of pledges received
    stat-box.col-md-3.col-xs-6(
      :value="currency(pledged / project.donors.length)",
      caption="average pledge"
    )
      template(#tooltip)
        | Formula: Pledged amount / number of pledges
    stat-box.col-md-3.col-xs-6(
      :value="currency(pledged / daysElapsed)",
      caption="Pledged / day"
    )
      template(#tooltip)
        | Formula: Pledged amount / days elapsed in campaign
    stat-box.col-md-3.col-xs-6(
      :value="remainingAmount ? currency(remainingAmount / daysRemaining) : '--'",
      caption="Remaining / day"
    )
      template(#tooltip)
        | Formula: Remaining amount / days remaining in campaign
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

    const currency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
      currency: currency.format,
    }
  },
}
</script>
