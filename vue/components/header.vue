<template>
	<div class="panel_header">
		<div class="text">
			Number of columns : <span class="count">{{ itemCountPerLine }}</span>
		</div>
		<div class="buttons">
			<md-button class="md-dense md-accent" @click="decrements">
				-1
			</md-button>
			<md-button class="md-dense md-primary" @click="increments">
				+1
			</md-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: "panel-header",
		props: {
			itemCountPerLine: {
				type: Number,
				default: 1,
			},
			min: {
				type: Number,
				default: 1,
			},
			max: {
				type: Number,
				default: 5,
			},
		},
		data() {
			return {};
		},
		methods: {
			increments() {
				if (this.itemCountPerLine < this.max) this.$emit("increments");
			},
			decrements() {
				if (this.itemCountPerLine > this.min) this.$emit("decrements");
			},
		},
	};
</script>

<style scoped>
	.panel_header {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 1.5em;
		/* border-bottom: 1px solid grey; */
	}

	.panel_header .text .count {
		color: #f68204;
	}
</style>
