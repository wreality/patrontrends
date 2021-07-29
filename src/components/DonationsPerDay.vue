<template lang="pug">
q-icon.float-right(name="help")
  q-tooltip
    p Sum of all donations on each day of the campaign.
bar-chart(:chartData="data", :options="options")
</template>

<script>
import { BarChart } from "vue-chart-3"
import { defineComponent, toRaw } from "vue"
import { DateTime } from "luxon"
import { Chart, registerables } from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"
import "chartjs-adapter-luxon"
import "chartjs-plugin-colorschemes"
import { rollups, sum } from "d3-array"

Chart.register(...registerables)
Chart.register(annotationPlugin)
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format

export default defineComponent({
  components: { BarChart },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const perDay = rollups(
      props.project.donors,
      (v) => sum(v, (d) => parseFloat(d.Amount)),
      (d) => {
        return DateTime.fromISO(d.Date).startOf("day").toISODate()
      }
    ).map(([day, amount]) => ({ x: day, y: amount }))

    const data = {
      datasets: [
        {
          label: "Total",
          data: perDay,
        },
      ],
    }
    const options = {
      plugins: {
        colorschemes: {
          scheme: "brewer.DarkTwo3",
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              var label = context.dataset.label || ""
              if (label) {
                label += ": "
              }
              if (context.parsed.y !== null) {
                label += currency(context.parsed.y)
              }
              return label
            },
          },
        },
      },
      responsive: true,
      aspectRatio: 1.75,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
          max:
            DateTime.now() < DateTime.fromISO(props.project.EndDate)
              ? DateTime.now().toISODate()
              : toRaw(props.project).EndDate,
        },

        y: {
          min: 0,
        },
      },
    }
    return { data, options }
  },
})
</script>
