<template>
	<div class="data-content">
		<h3 class="name">Select value</h3>

		<div class="content">
			<div class="radio">
				<div class="inactive">
					<md-radio v-model="data.value" :value="false">OFF</md-radio>
				</div>

				<div class="active">
					<md-radio v-model="data.value" :value="true">ON</md-radio>
				</div>
			</div>

			<md-field>
				<label>priority</label>
				<md-input type="number" v-model="data.priority"></md-input>
			</md-field>
		</div>

	</div>


</template>

<script>
export default {
	name: "booleanComponent",
	props: {
		data: {},
	},
	data() {
		return {};
	},
	methods: {},
};
</script>

<style scoped>
.data-content {
	width: 100%;
	height: 100%;
}

.data-content .content {
	width: 100%;
	height: 80%;
	display: flex;
	flex-direction: column;
}

.data-content .content .radio {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}


.data-content .content .radio .active,
.data-content .content .radio .inactive {
	width: 49%;
	text-align: center;
}

.data-content .content .switch {
	width: 55%;
}
</style>

<style>
/* .data-content .content .switch .md-switch,
   .data-content .content .switch .md-switch .md-switch-container {
      width: 100%;
   } */
</style>
