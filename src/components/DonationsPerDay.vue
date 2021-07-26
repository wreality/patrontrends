<template lang="pug">
line-chart(:chartData="data", :options="options")
</template>

<script>
import { LineChart } from "vue-chart-3"
import { defineComponent } from "vue"
import moment from "moment"
import { Chart, registerables } from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"
import "chartjs-adapter-moment"
import "chartjs-plugin-colorschemes"

Chart.register(...registerables)
Chart.register(annotationPlugin)
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default defineComponent({
  components: { LineChart },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    //loop through donors and build a map of date and totals

    const startEvent = Object.entries(props.project.timeline).find(
      // eslint-disable-next-line
        ([_, v]) => {
        return v.type === "event" && v.subtype == "campaign_started"
      }
    )[1]
    const startDate = moment(startEvent.date)

    const goal = parseFloat(props.project.Goal)
    const pledged = parseFloat(props.project.PledgeAmount)

    let acc = 0
    const donors = [...props.project.donors]

    donors.sort((a, b) => moment(a.Date).diff(moment(b.Date)))
    const data = donors.map((donor) => {
      acc += parseFloat(donor.Amount)
      const date = moment(donor.Date)
      return {
        x: date,
        y: acc,
      }
    })
    const dataset = {
      label: "Donations",
      data,
      radius: 5,
    }
    const options = {
      plugins: {
        title: {
          display: true,
          text: "Donation History",
        },
        colorschemes: {
          scheme: "brewer.DarkTwo3",
        },
        autocolors: true,
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
                content: `GOAL: ${currency.format(goal)}`,
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
      aspectRatio: 2,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
          min: startDate,
          max: moment(props.project.EndDate),
        },

        y: {
          max: goal > pledged ? goal : pledged,
          min: 0,
        },
      },
    }
    return { data: { datasets: [dataset] }, options }
  },
})
</script>
