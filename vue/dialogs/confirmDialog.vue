<!--
Copyright 2020 SpinalCom - www.spinalcom.com

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
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)"
             class="mdDialog">
    <md-dialog-title class="mdDialogTitle">{{title}}</md-dialog-title>

    <md-dialog-content>
      {{message}}
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-accent"
                 @click="closeDialog(false)">NO</md-button>

      <md-button class="md-primary"
                 @click="closeDialog(true)">YES</md-button>
    </md-dialog-actions>

  </md-dialog>
</template>

<script>
export default {
  name: "confirmationDialog",
  props: ["onFinised"],
  data() {
    return {
      showDialog: true,
      title: "",
      message: "",
      callback: undefined,
    };
  },
  methods: {
    opened(option) {
      this.title = option.title || "Are you Sure ?";
      this.message = option.message;
      this.callback = option.callback;
    },

    async removed(res) {
      if (res.closeResult && this.callback) {
        this.callback();
      }

      this.showDialog = false;
    },
    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised({
          closeResult,
        });
      }
    },
  },
};
</script>