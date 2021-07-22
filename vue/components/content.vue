<template>
	<div class="panel_content">
		<div class="tabs">
			<div
				class="tab"
				:class="{ active: tabSelected == tabs.endpoints }"
				@click="selectTab(tabs.endpoints)"
			>
				Endpoints
			</div>
			<div
				class="tab"
				:class="{ active: tabSelected == tabs.controlPoints }"
				@click="selectTab(tabs.controlPoints)"
			>
				Control Points
			</div>
		</div>
		<div class="main">
			<tab-content-component
				:data="contents"
				:itemCountPerLine="itemCountPerLine"
			></tab-content-component>
		</div>
	</div>
</template>

<script>
	import TabContentTemplate from "./tabs/tab-template.vue";

	export default {
		name: "panel-content",
		components: {
			"tab-content-component": TabContentTemplate,
		},
		props: {
			itemCountPerLine: {
				type: Number,
				default: 3,
			},

			data: {},
		},
		data() {
			this.tabs = {
				endpoints: "endpoints-component",
				controlPoints: "controlpoints-component",
			};
			return {
				tabSelected: "",
			};
		},

		mounted() {
			this.tabSelected = this.tabs.endpoints;
			this.endpoints = this.data.endpoints;
			this.controlpoints = this.data.controlPoints;
		},

		methods: {
			selectTab(tabName) {
				this.tabSelected = tabName;
			},
		},
		computed: {
			contents() {
				switch (this.tabSelected) {
					case this.tabs.endpoints:
						return this.data.endpoints;
					case this.tabs.controlPoints:
						return this.data.controlPoints;
					default:
						return [];
				}
			},
		},
	};
</script>

<style scoped>
	.panel_content {
		width: 100%;
		height: 100%;
	}

	.panel_content .tabs {
		width: 100%;
		height: 50px;
		display: flex;
	}

	.panel_content .tabs .tab {
		flex: 1 1 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #222;

		/* border: 1px solid grey; */
	}

	.panel_content .tabs .tab:hover {
		cursor: pointer;
	}

	.panel_content .tabs .tab.active {
		border-bottom: 2px solid #448aff;
	}

	.panel_content .main {
		width: 100%;
		height: calc(100% - 50px);
		overflow: hidden;
		/* display: grid;
		grid-auto-rows: minmax(140px, 140px);
		overflow: hidden;
		overflow-y: auto; */
	}
</style>
