<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">
        <h2 v-if="won">Pony won!!!</h2>
        <h2 v-else>Pony lost!!!</h2>
      </v-card-title>

      <v-card-text>
        <h3 v-if="won">Congrats!!! You saved the pony</h3>
        <h3 v-else>You couldn't save the pony from the monster</h3>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('new-game')">
          New game ?
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    won: Boolean
  },

  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      }
    }
  }
}
</script>
