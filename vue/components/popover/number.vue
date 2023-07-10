<!--
Copyright 2023 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
	<div class="data-content">
		<md-field>
			<label>value</label>
			<md-input v-model="data.value"></md-input>
		</md-field>

		<!-- <div class="slider">
			<vue-slider
				ref="slider"
				v-model="data.value"
				v-bind="option"
			></vue-slider>
		</div> -->
	</div>
</template>

<script>
	import vueSlider from "vue-slider-component";

	export default {
		name: "numberComponent",
		components: {
			"vue-slider": vueSlider,
		},
		props: {
			data: {},
		},
		data() {
			return {
				option: {
					min: -2000,
					max: 2000,
					interval: 1,
					tooltip: "hover",
					tooltipPlacement: "bottom",
				},
			};
		},
		methods: {},
	};
</script>

<style scoped>
	.data-content {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
</style>
