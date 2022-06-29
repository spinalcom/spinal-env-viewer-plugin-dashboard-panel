<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
  <div class="controlpoint_main">
    <div class="search">
      <div class="buscar-caja">
        <input type="text"
               name="search"
               class="buscar-txt"
               placeholder="Search..."
               v-model.trim="searchText" />
        <a class="md-icon-button buscar-btn"
           @click="openSearchBar">
          <md-icon>search</md-icon>
        </a>
      </div>
    </div>

    <md-content class="main md-scrollbar"
                :style="gridStyle">
      <endpoint-component v-for="endpoint of itemsDiplayed"
                          :key="endpoint.id"
                          :endpointId="endpoint.id"
                          :endpointSelected="endpointSelected"
                          @select="selectEndpoint"
                          @removed="removeEndpoint"></endpoint-component>

      <span v-if="itemsDiplayed.length === 0">No item found !</span>
    </md-content>

    <div class="footer">
      <jw-pagination :items="search"
                     :pageSize="9"
                     @changePage="onPageChange"></jw-pagination>
    </div>
  </div>
</template>

<script>
import EndpointComponent from "../endpoint/endpoint.vue";
import JwPagination from "jw-vue-pagination";

export default {
  name: "control-points",
  props: {
    itemCountPerLine: {
      type: Number,
      default: 3,
    },
    data: Array,
  },
  components: {
    "endpoint-component": EndpointComponent,
    "jw-pagination": JwPagination,
  },
  data() {
    return {
      searchText: "",
      isOpened: false,
      endpointSelected: null,
      search: [],
      itemsDiplayed: [],
    };
  },
  mounted() {
    this.filteredData();
  },
  methods: {
    onPageChange(items) {
      this.itemsDiplayed = items;
    },

    selectEndpoint(id) {
      this.endpointSelected = id;
    },

    filteredData() {
      this.search = this.data.filter((el) => {
        if (this.searchText.length === 0) return true;
        return el.name.toLowerCase().includes(this.searchText.toLowerCase());
      });
    },

    openSearchBar() {
      this.isOpened = !this.isOpened;
    },

    removeEndpoint(data) {
      this.$emit("removed", data);
    },
  },

  computed: {
    gridStyle() {
      if (this.itemsDiplayed.length > 0) {
        return {
          display: "grid",
          gridTemplateColumns: `repeat(${this.itemCountPerLine}, minmax(20%, 100%))`,
          gridGap: "15px",
          gridAutoRows: "minmax(140px, 140px)",
        };
      } else {
        return {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
      }
    },
  },
  watch: {
    data() {
      this.filteredData();
    },
    searchText() {
      this.filteredData();
    },
  },
};
</script>

<style scoped>
.controlpoint_main {
  width: 100%;
  height: 100%;
}

.controlpoint_main .main {
  width: calc(100% - 30px);
  height: calc(100% - 100px);
  margin: auto;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 15px;
  /* background: brown; */
}

.controlpoint_main .search,
.controlpoint_main .footer {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.controlpoint_main .search .buscar-caja {
  width: 98%;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 40px;
  border: 1px solid #fff;
  background: #2f3640;
}

.controlpoint_main .search .buscar-caja .buscar-txt {
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
}

.controlpoint_main .search .buscar-caja .buscar-btn {
  width: 10%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.4s;
  color: white;
  cursor: pointer;
}

.controlpoint_main .search .buscar-caja .buscar-btn > i {
  font-size: 30px;
}

/* .controlpoint_main .search .buscar-caja .buscar-txt {
		border: none;
		background: none;
		outline: none;
		float: left;
		padding: 0;
		color: white;
		font-size: 16px;
		transition: 0.4s;
		line-height: 40px;
		width: 0px;
	} */
</style>
