<template>
	<div class="dashboardPanelContent" v-if="pageSelected === PAGES.normal">
		<div class="header">
			<panel-header
				:itemCountPerLine="itemCountPerLine"
				@increments="itemCountPerLine++"
				@decrements="itemCountPerLine--"
			></panel-header>
		</div>

		<div class="content">
			<panel-content
				:itemCountPerLine="itemCountPerLine"
				:data="data"
			></panel-content>
		</div>
	</div>

	<div class="dashboardPanelContent state" v-else>
		<md-progress-spinner
			v-if="pageSelected === PAGES.loading"
			md-mode="indeterminate"
		>
		</md-progress-spinner>

		<md-icon v-else-if="pageSelected === PAGES.error" class="md-size-4x">
			close
		</md-icon>
	</div>
</template>

<script>
	const {
		spinalPanelManagerService,
	} = require("spinal-env-viewer-panel-manager-service");

	import endpointUtilities from "../../js/endpoint_utilities";
	import HeaderComponent from "../components/header.vue";
	import ContentComponent from "../components/content.vue";

	export default {
		name: "dashboard-panel",
		components: {
			"panel-header": HeaderComponent,
			"panel-content": ContentComponent,
		},
		data() {
			this.viewer;
			this.PAGES = {
				normal: 1,
				loading: 2,
				error: 3,
			};

			return {
				pageSelected: this.PAGES.normal,
				// endpointsNode: null,
				// endpointSelected: null,
				itemCountPerLine: 3,
				data: {},
			};
		},
		methods: {
			opened(option, viewer) {
				this.viewer = viewer;
				this.setTitle(option.name.get());
				this.pageSelected = this.PAGES.loading;
				endpointUtilities
					.getTreeStructure(option.id.get())
					.then((result) => {
						console.log("result", result);
						this.data = result;
						this.pageSelected = this.PAGES.normal;
					})
					.catch((err) => (this.pageSelected = this.PAGES.error));
				// this.getEndpointsNode(option)
				//    .then((endpoints) => {
				//       this.endpointsNode = endpoints;
				//       this.pageSelected = this.PAGES.normal;
				//    })
				//    .catch((err) => {
				//       this.pageSelected = this.PAGES.error;
				//    });
			},

			closed() {},

			// getEndpointsNode(node) {
			//    return SpinalGraphService.findNodesByType(
			//       node.id.get(),
			//       RELATION_NAMES,
			//       SpinalBmsEndpoint.nodeTypeName
			//    )
			//       .then((endpoints) => {
			//          return endpoints.map((el) => {
			//             SpinalGraphService._addNode(el);
			//             return SpinalGraphService.getInfo(el.getId().get());
			//          });
			//       })
			//       .catch((err) => {
			//          console.log(err);
			//          return [];
			//       });
			// },

			setTitle(title) {
				spinalPanelManagerService.panels.spinal_dashboard_panel.panel.setTitle(
					`Dashboard : ${title}`
				);
			},
		},
		computed: {
			V6() {
				return parseInt(window.LMV_VIEWER_VERSION) === 6;
			},
		},
	};
</script>

<style scoped>
	.dashboardPanelContent {
		width: calc(100% - 10px);
		height: calc(100% - 20px);
		margin: auto;
		/* background-color: unset !important; */
	}

	.dashboardPanelContent .header {
		width: 100%;
		height: 50px;
	}

	.dashboardPanelContent .content {
		width: 100%;
		height: calc(100% - 50px);
	}

	.dashboardPanelContent.state {
		width: calc(100% - 10px);
		height: calc(100% - 20px);
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
