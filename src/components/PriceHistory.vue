<script>
import { Scatter } from 'vue-chartjs';
import 'chartjs-plugin-annotation';

export default {
  extends: Scatter,
  props: {
    chartdata: { type: Array, required: true },
    daysAgo: { type: Number, default: 0 },
  },
  computed: {
    data() {
      return {
        datasets: [
          {
            label: 'Sell price',
            data: this.formatedData('Sell'),
            borderColor: '#FF4746',
            backgroundColor: 'rgba(98,36,199,0.22)',
            showLine: true,
          },
          {
            data: this.formatedData('Sell'),
            backgroundColor: '#090909',
          },
          {
            label: 'Buy price',
            data: this.formatedData('Buy'),
            borderColor: '#00FF9D',
            backgroundColor: 'rgba(17,97,254,0.22)',
            showLine: true,
          },
        ],
      };
    },
    options() {
      const start = new Date();
      start.setDate(start.getDate() - this.daysAgo);
      if (this.daysAgo !== 1) { start.setHours(0, 0, 0, 0); }

      const startLine = this.daysAgo === 0 ? this.formatedData('Sell')[0] : start;

      const time = {
        unit: this.daysAgo === 1 ? 'hour' : 'day',
        format: {
          day: this.daysAgo === 1 ? 'HH:MM' : 'DD MMM',
        },
        unitStepSize: this.daysAgo === 0 ? 1 : Math.ceil(this.daysAgo / 10),
        min: this.daysAgo === 0 ? 0 : start,
      };

      return {
        animation: {
          duration: 0,
        },
        legend: {
          display: false,
        },
        tooltips: {
          mode: 'point',
          filter(tooltipItem) {
            return tooltipItem.datasetIndex !== 1;
          },
          callbacks: {
            label(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                label += ': ';
              }
              label += tooltipItem.yLabel;
              return label;
            },
            title(tooltipItem) {
              return tooltipItem[0].label;
            },
          },
        },
        datasets: {
          scatter: {
            showLine: true,
          },
        },
        spanGaps: true,
        elements: {
          line: {
            tension: 0,
            borderWidth: 1.5,
          },
          point: {
            radius: 3,
            borderWidth: 1.5,
            backgroundColor: '#0f0f0f',
          },
        },
        scales: {
          xAxes: [{
            id: 'time-axis',
            type: 'time',
            time,
            scaleLabel: {
              padding: 0,
              display: true,
              fontColor: '#FFFFFF',
              labelString: this.$t('components.PriceHistory.Time'),
            },
          }],
          yAxes: [{
            gridLines: {
              zeroLineColor: '#babac0',
              lineWidth: 1.5,
            },
            scaleLabel: {
              padding: 0,
              display: true,
              fontColor: '#FFFFFF',
              labelString: this.$t('components.PriceHistory.Price'),
            },
          }],
        },
        annotation: {
          annotations: [
            {
              drawTime: 'afterDatasetsDraw',
              id: 'start-line',
              type: 'line',
              mode: 'vertical',
              scaleID: 'time-axis',
              value: startLine,
              borderColor: '#babac0',
              borderWidth: 1.5,
            },
          ],
        },
      };
    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.options);
    },
    daysAgo() {
      this.renderChart(this.data, this.options);
    },
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
  methods: {
    formatedData(event) {
      return this.chartdata
        .filter((d) => d.event === event)
        .map((d) => ({ x: new Date(d.timestamp), y: d.price }))
        .sort((a, b) => a.x - b.x);
    },
  },
};
</script>
