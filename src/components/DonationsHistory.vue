<template lang="pug">
q-icon.float-right(name="help")
  q-tooltip
    p Each donation charted over time.
    p The dotted diagonal line represents a linear progress of campaign donations over time.
line-chart(:chartData="data", :options="options")
</template>

<script>
import { LineChart } from "vue-chart-3"
import { defineComponent, toRaw } from "vue"
import { DateTime } from "luxon"
import { Chart, registerables } from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"
import "chartjs-adapter-luxon"
import "chartjs-plugin-colorschemes"

Chart.register(...registerables)
Chart.register(annotationPlugin)
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format

export default defineComponent({
  components: { LineChart },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const goal = parseFloat(props.project.Goal)
    const pledged = parseFloat(props.project.PledgeAmount)

    let acc = 0

    const donations = Array.from(props.project.donors)
      .sort((a, b) => DateTime.fromISO(a.Date) - DateTime.fromISO(b.Date))
      .map((d) => {
        acc += parseFloat(d.Amount)
        return {
          x: d.Date,
          y: acc,
          donor: d,
        }
      })
    donations.push({ x: DateTime.now(), y: pledged })

    const data = {
      datasets: [
        {
          label: "Pledges",
          data: donations,
          radius: 3,
        },
      ],
    }
    const options = {
      plugins: {
        colorschemes: {
          scheme: "brewer.DarkTwo3",
        },
        autocolors: true,
        tooltip: {
          callbacks: {
            afterBody: function (context) {
              const donor = context[0].raw?.donor
              if (!donor) {
                return `Current: ${currency(pledged)}`
              }
              return `${donor.Name}: ${currency(parseFloat(donor.Amount))}`
            },
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
        annotation: {
          annotations: {
            goal: {
              type: "line",
              value: goal,
              scaleID: "y",
              borderColor: "#3FB781",
              borderWidth: 2,
              label: {
                backgroundColor: "#3FB781",
                content: `GOAL: ${currency(goal)}`,
                color: "#fff",
                enabled: true,
              },
            },
            constant: {
              type: "line",

              yMin: 0,
              borderDash: [12, 12],
              yMax: goal,
              borderColor: "#F1A102",
              borderWidth: 2,
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
          max: toRaw(props.project).EndDate,
        },

        y: {
          max: goal > pledged ? goal : pledged,
          min: 0,
        },
      },
    }
    return { data, options }
  },
})
</script>
