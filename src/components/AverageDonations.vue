<template lang="pug">
q-icon(name="help")
  q-tooltip
    | Each point is the pledged / day and remaining / day values for a particular day.
line-chart(:chartData="data", :options="options", v-if="data")
</template>

<script>
import { LineChart } from "vue-chart-3"
import { defineComponent } from "vue"
import { DateTime } from "luxon"
import { Chart, registerables } from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"
import "chartjs-adapter-luxon"
import "chartjs-plugin-colorschemes"

Chart.register(...registerables)
Chart.register(annotationPlugin)

export default defineComponent({
  components: { LineChart },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const startEvent = Object.entries(props.project.timeline).find(
      // eslint-disable-next-line
        ([_, v]) => {
        return v.type === "event" && v.subtype == "campaign_started"
      }
    )[1]
    const startDate = DateTime.fromISO(startEvent.date).startOf("day")
    const endDate = DateTime.fromISO(props.project.EndDate).endOf("day")
    const campaignLength = endDate.diff(startDate, "days").toObject().days
    const goal = parseFloat(props.project.Goal)
    //const pledged = parseFloat(props.project.PledgeAmount)

    let acc = 0
    const dayMap = new Map()
    dayMap.set(0, 0)
    Array.from(props.project.donors)
      .sort((a, b) => DateTime.fromISO(a.Date) - DateTime.fromISO(b.Date))
      .forEach((donor) => {
        acc += parseFloat(donor.Amount)
        const campaignDay = DateTime.fromISO(donor.Date)
          .startOf("day")
          .diff(startDate, "days")
          .toObject().days
        dayMap.set(campaignDay, acc)
      })
    const dayTotals = Array.from(dayMap).reverse()

    const today = DateTime.now().startOf("day")

    const currentDay =
      today > endDate
        ? campaignLength
        : today.diff(startDate, "days").toObject().days

    const averageDonationPerDay = []
    const remainingDonationNeed = []
    for (var i = 0; i <= currentDay; i++) {
      const date = startDate.plus({ days: i })
      // eslint-disable-next-line
      const total = dayTotals.find(([day, _]) => day <= i)[1]
      averageDonationPerDay.push({ x: date, y: total / (i + 1) })
      if (goal - total > 0) {
        remainingDonationNeed.push({
          x: date,
          y: (goal - total) / (campaignLength - i),
        })
      }
    }
    const datasets = [
      {
        label: "Received",
        data: averageDonationPerDay,
        radius: 3,
      },
      {
        label: "Needed",
        data: remainingDonationNeed,
        radius: 3,
      },
    ]

    const data = { datasets }
    const options = {
      plugins: {
        title: {
          display: true,
          text: "Rolling Donation Average",
        },
        colorschemes: {
          scheme: "brewer.DarkTwo3",
        },
        autocolors: true,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || ""
            console.log(context)
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y)
            }
            return label
          },
        },
      },
      aspectRatio: 1.75,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
        },

        y: {},
      },
    }
    return { data, options }
  },
})
</script>
