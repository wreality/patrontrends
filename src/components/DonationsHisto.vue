<template lang="pug">
q-icon(name="help")
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

    const donationData = buckets.map((b) => b.length)
    const labels = buckets.map((b) => `${b.x1}`)

    console.log(donationData)
    console.log(labels)
    console.log(buckets)
    const datasets = [
      {
        label: "Received",
        data: donationData,
      },
    ]

    const data = { labels, datasets }
    const options = {
      plugins: {
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
    }
    return { data, options }
  },
})
</script>
