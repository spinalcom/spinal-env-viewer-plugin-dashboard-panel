<template>
  <md-button class="md-icon-button md-dense"
             title="Alarm"
             @click="seeAlarm">
    <md-icon class="endpointIcons">
      error_outline
    </md-icon>
  </md-button>
</template>

<script>
export default {
  name: "alarmButton",
  props: ["endpoint"],
  methods: {
    seeAlarm() {
      this.$emit("clickAlarm", this.endpoint);
    }
  }
};
</script>