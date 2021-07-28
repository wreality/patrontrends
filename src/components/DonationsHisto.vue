<template lang="pug">
q-icon.float-right(name="help")
  q-tooltip
    | Histogram view of the amounts of individual donations.
bar-chart(:chartData="data", :options="options", v-if="data")
</template>

<script>
import { BarChart } from "vue-chart-3"
import { defineComponent } from "vue"
import { Chart, registerables } from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"
import "chartjs-adapter-luxon"
import "chartjs-plugin-colorschemes"
import { bin, thresholdScott as thresholdFunction } from "d3-array"

Chart.register(...registerables)
Chart.register(annotationPlugin)

export default defineComponent({
  components: { BarChart },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const binner = bin()
      .value((d) => parseFloat(d.Amount))
      .thresholds(thresholdFunction)

    const buckets = binner(props.project.donors)
    console.log(buckets)
    const donationData = buckets.map((b) => b.length)
    const labels = [0, ...buckets.map((b) => b.x1)]
    const bucketSize = buckets[0].x1 - buckets[0].x0
    const datasets = [
      {
        label: "Pledges",
        data: donationData,
        xAxisID: "xA",
      },
    ]

    const data = { labels, datasets }
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
            title: function (context) {
              console.log(context)
              const min = parseInt(context[0].label)
              return `$${min} - $${min + bucketSize}`
            },
          },
        },
      },
      aspectRatio: 1.75,
      barPercentage: 1,
      categoryPercentage: 1,
      scales: {
        x: {
          display: true,
          offset: false,
          grid: {
            offset: false,
            display: false,
          },
        },
        xA: {
          display: false,
          offset: true,
          max: labels.length - 2,
        },
        y: {
          beginAtZero: true,
        },
      },
    }
    return { data, options }
  },
})
</script>
