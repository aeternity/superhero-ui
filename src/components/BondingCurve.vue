<script>
import { Scatter } from 'vue-chartjs';
import { mapGetters } from 'vuex';

export default {
  name: 'BondingCurve',
  extends: Scatter,
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  },
  computed: {
    ...mapGetters(['roundedTokenAmount']),
    chartData() {
      const token = this.data.tokenAddress;
      const sellPrice = this.roundedTokenAmount(this.data.sellPrice, token, 2, true);
      const buyPrice = this.roundedTokenAmount(this.data.buyPrice, token, 2, true);
      const supply = this.roundedTokenAmount(this.data.totalSupply, token, 2, true);
      return {
        showLines: true,
        datasets: [
          {
            order: 6,
            fill: '+1',
            data: [
              { x: 0, y: 0 },
              { x: supply, y: buyPrice },
            ],
            backgroundColor: '#1161fe3f',
          },
          {
            order: 7,
            fill: true,
            data: [
              { x: 0, y: 0 },
              { x: supply, y: sellPrice },
            ],
            backgroundColor: '#6224c75f',
          },
          {
            order: 3,
            data: [
              { x: supply, y: buyPrice },
              { x: supply, y: 0 },
            ],
            borderColor: '#1161fe',
            borderDash: [4],
          },
          {
            order: 4,
            data: [
              { x: 0, y: 0 },
              { x: 3 * supply, y: 3 * sellPrice },
            ],
            borderWidth: 1.5,
            pointBorderColor: ['#ffaa29', 'transparent'],
            borderColor: '#ff4746',
          },
          {
            order: 5,
            data: [
              { x: 0, y: 0 },
              { x: 3 * supply, y: 3 * buyPrice },
            ],
            borderWidth: 1.5,
            pointBorderColor: ['#ffaa29', 'transparent'],
            borderColor: '#00ff9d',
          },
          {
            order: 1,
            fill: true,
            data: [
              { x: 0, y: sellPrice },
              { x: supply, y: sellPrice },
            ],
            pointBorderColor: '#ff4746',
            borderColor: '#ff4746',
            borderDash: [4],
          },
          {
            order: 2,
            data: [
              { x: 0, y: buyPrice },
              { x: supply, y: buyPrice },
            ],
            pointBorderColor: '#00ff9d',
            borderColor: '#00ff9d',
            borderDash: [4],
          },
        ],
      };
    },
    chartOptions() {
      return {
        legend: {
          display: false,
        },
        datasets: {
          scatter: {
            showLine: true,
          },
        },
        elements: {
          point: {
            radius: 3,
            borderWidth: 1,
            backgroundColor: '#0f0f0f',
          },
          line: {
            tension: 0,
            borderWidth: 1,
            backgroundColor: 'transparent',
          },
        },
        tooltips: {
          mode: 'point',
          intersect: true,
        },
        scales: {
          yAxes: [{
            gridLines: {
              color: '#babac01a',
              zeroLineColor: '#babac0',
              lineWidth: 1.5,
            },
            beginAtZero: true,
            min: 0,
            suggestedMin: 0,
            scaleLabel: {
              padding: 0,
              display: true,
              labelString: this.$t('components.BondingCurve.GraphPrice'),
            },
          }],
          xAxes: [{
            gridLines: {
              color: '#babac00a',
              zeroLineColor: '#babac0',
              lineWidth: 1.5,
            },
            beginAtZero: false,
            min: 0,
            suggestedMin: 0,
            scaleLabel: {
              padding: 0,
              display: true,
              labelString: this.$t('components.BondingCurve.GraphSupply'),
            },
          }],
        },
      };
    },
  },
};
</script>
