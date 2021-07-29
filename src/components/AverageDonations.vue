<template lang="pug">
q-icon.float-right(name="help")
  q-tooltip
    | Each point is the pledged / day and remaining / day values for a particular day.
line-chart(:chartData="data", :options="options", v-if="data")
</template>

<script>
import { LineChart } from "vue-chart-3"
import { defineComponent } from "vue"
import { DateTime } from "luxon"
import { Chart, registerables } from "chart.js"
import { rollups, sum, cumsum, zip } from "d3-array"
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

    //   let acc = 0

    const dayTotals = rollups(
      props.project.donors,
      (v) => sum(v, (d) => parseFloat(d.Amount)),
      (d) =>
        DateTime.fromISO(d.Date)
          .startOf("day")
          .diff(startDate, "days")
          .toObject().days
    ).sort((a, b) => a[0] - b[0])

    const dayCumSum = zip(
      dayTotals.map((v) => v[0]),
      cumsum(dayTotals, (v) => v[1])
    ).reverse()

    const today = DateTime.now().startOf("day")
    const currentDay =
      today > endDate
        ? campaignLength
        : today.diff(startDate, "days").toObject().days

    const averageDonationPerDay = []
    const remainingDonationNeed = []

    ;[...Array(currentDay + 1).keys()].forEach((d) => {
      const date = startDate.plus({ days: d }).toISODate()
      // eslint-disable-next-line
      const total = dayCumSum.find(([day, _]) => day <= d)?.[1]
      console.log(total)
      averageDonationPerDay.push({ x: date, y: total / (d + 1) })
      if (goal - total > 0) {
        remainingDonationNeed.push({
          x: date,
          y: (goal - total) / (campaignLength - d),
        })
      }
    })

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
        colorschemes: {
          scheme: "brewer.DarkTwo3",
        },
        autocolors: true,
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
              return label + "/day"
            },
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
