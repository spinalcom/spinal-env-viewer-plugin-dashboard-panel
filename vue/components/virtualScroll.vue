<template>
   <div
      class="scroll-content"
      v-if="scroll"
   >
      <div
         class="div_content"
         v-html="scroll.container.outerHTML"
      ></div>

   </div>
</template>

<script>
import { VirtualList } from "../../js/virtualscroll.js";

export default {
   name: "virtualScroll",
   components: {
      itemHeight: { type: String, default: 50 },
      items: { type: Array, default: [] },
      totalColumns: { type: Number, default: 1 },
   },
   data() {
      return {
         totalRows: this.items ? this.items.length : 0,
         scroll: undefined,
      };
   },
   mounted() {
      this.scroll = new VirtualList({
         itemHeight: 50,
         totalRows: 1000000,
         generatorFn: function (row) {
            var el = document.createElement("div");
            el.innerHTML = "ITEM " + row;
            el.className = "celda";
            return el;
         },
      });

      console.log(this.scroll.container.outerHTML);
   },
   methods: {},
};
</script>

<style scoped>
.scroll-content {
   width: 100%;
   height: 100%;
}

.scroll-content .div_content {
   width: 100%;
   height: 100%;
}
</style>