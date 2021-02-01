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
      const initialBuy = this.roundedTokenAmount(this.data.initialPrice, null, 2, true);
      const currentSell = this.roundedTokenAmount(this.data.bondingSellPrice, null, 2, true);
      const currentBuy = this.roundedTokenAmount(this.data.bondingBuyPrice, null, 2, true);
      const supply = this.roundedTokenAmount(this.data.totalSupply, token, 2, true);
      const coef = 2; // coefficient to extend the chart for future supply
      const futureSupply = supply > 1 ? supply * coef : coef;
      const futureSell = (supply > 1 ? currentSell : 1) * coef;
      const futureBuy = (supply > 1 ? (currentBuy - initialBuy) : 1) * coef - (-initialBuy);

      return {
        showLines: true,
        datasets: [
          {
            order: 6,
            fill: '+1',
            data: [
              { x: 0, y: initialBuy },
              { x: supply, y: currentBuy },
            ],
            backgroundColor: '#1161fe3f',
          },
          {
            order: 7,
            fill: true,
            data: [
              { x: 0, y: 0 },
              { x: supply, y: currentSell },
            ],
            backgroundColor: '#6224c75f',
          },
          {
            order: 3,
            data: [
              { x: supply, y: currentBuy },
              { x: supply, y: 0 },
            ],
            borderColor: '#1161fe',
            borderDash: [4],
          },
          {
            order: 4,
            data: [
              { x: 0, y: 0 },
              { x: futureSupply, y: futureSell },
            ],
            borderWidth: 1.5,
            pointBorderColor: ['#ffaa29', 'transparent'],
            borderColor: '#ff4746',
          },
          {
            order: 5,
            data: [
              { x: 0, y: initialBuy },
              { x: futureSupply, y: futureBuy },
            ],
            borderWidth: 1.5,
            pointBorderColor: ['#ffaa29', 'transparent'],
            borderColor: '#00ff9d',
          },
          {
            order: 1,
            fill: true,
            data: [
              { x: 0, y: currentSell },
              { x: supply, y: currentSell },
            ],
            pointBorderColor: '#ff4746',
            borderColor: '#ff4746',
            borderDash: [4],
          },
          {
            order: 2,
            data: [
              { x: 0, y: currentBuy },
              { x: supply, y: currentBuy },
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
            beginAtZero: true,
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
