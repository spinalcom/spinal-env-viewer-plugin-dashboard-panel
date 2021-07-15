<template>
   <div class="data-content">
      <md-field>
         <label>value</label>
         <md-input v-model="data.value"></md-input>
      </md-field>

      <div class="slider">
         <vue-slider
            ref="slider"
            v-model="data.value"
         ></vue-slider>
      </div>
   </div>
</template>

<script>
import vueSlider from "vue-slider-component";


export default {
   name: "numberComponent",
   components: {
      "vue-slider": vueSlider,
   },
   props : {
      data : {}
   },
   data() {
      return {}
   },
   methods : {}
}
</script>

<style scoped>
   .data-content {
      width: 100%;
      height: 100%;
   }
</style>