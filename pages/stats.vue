<style scoped>
</style>
<template>
	<section class="section">
		<h2 class="title is-3 has-text-grey">
			Statistika příchozích plateb na transparentní účet ANO
		</h2>
		<div class="columns">
			<div class="column">
				<div class="card">
					<div class="card-content chart-card">
						<chart
							:chartData="
							{ datasets: [{label: 'Příjem na účty (Kč)', data: monthAmountStats,
										backgroundColor: [backgroundColor], borderColor: [borderColor]}]
								}"
							:options="chartOptions"
						/>
					</div>
				</div>
			</div>
			<div class="column">
				<div class="card">
					<div class="card-content chart-card">
						<chart
							:chartData="{ datasets: [{label: 'Počet příspěvků',  data: monthCountStats,
							backgroundColor: [backgroundColor], borderColor: [borderColor]}] }"
							:options="chartOptions"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script lang="ts">
import { Prop, Watch, Component, Vue , Inject} from 'vue-property-decorator'
import  Chart  from "../components/Chart.vue"
import gql from 'graphql-tag'
import { MonthStat } from "../assets/ts/interfaces"

const MONTH_AMOUNT_QUERY = gql`
query {
	monthAmountStats: monthStats {
		x: month
		y: amount
	}
}
`
const MONTH_COUNT_QUERY = gql`
query {
	monthCountStats: monthStats {
		x: month
		y: count
	}
}
`

@Component({
	components: {
		Chart
	},
	apollo: {
		monthAmountStats: {
			query: MONTH_AMOUNT_QUERY,
			prefetch: true
		},
		monthCountStats: {
			query: MONTH_COUNT_QUERY,
			prefetch: true
		}
	}
})
export default class Stats extends Vue {
	private backgroundColor = "#f9a74f55"
	private borderColor = "#ef820e"
	private chartOptions ={
			scales: {
				xAxes: [{
					type: 'time',
					time: {
						unit: 'month'
					}
				}],
				yAxes: [{
					ticks: {
						userCallback: function(value: any, index: any, values: any) {
							// Convert the number to a string and splite the string every 3 charaters from the end
							value = value.toString();
							value = value.split(/(?=(?:...)*$)/);
							// Convert the array to a string and format the output
							value = value.join(' ');
							return value;
						}
					}
				}]
			},
			responsive: true,
			maintainAspectRatio: false
		}

	private monthAmountStats!: MonthStat[]
	private monthCountStats!: MonthStat[]

}
</script>

