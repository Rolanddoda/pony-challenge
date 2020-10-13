<template>
  <v-app>
    <v-main>
      <v-dialog :value="!mazeId" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">
            Enter a pony name to start the game
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model.trim="ponyName"
              label="Pony name"
              placeholder="Enter pony name"
              outlined
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!ponyName"
              :loading="isBtnLoading"
              color="primary"
              @click="startGame"
            >
              Start the game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar :value="!!error" @input="error = null">
        {{ error }}

        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="error = null">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <Game v-if="mazeId" :id="mazeId" />
    </v-main>
  </v-app>
</template>

<script>
import Game from "./components/Game";

export default {
  name: "App",

  components: {
    Game
  },

  data: () => ({
    isBtnLoading: false,
    ponyName: "",
    error: null,
    mazeId: null //f2c7918f-7f62-4a79-a124-4eefc277b67c
  }),

  methods: {
    startGame() {
      this.isBtnLoading = true;
      this.$axios
        .post("/maze", {
          "maze-width": 15,
          "maze-height": 15,
          "maze-player-name": this.ponyName,
          difficulty: 1
        })
        .then(({ data }) => {
          this.mazeId = data.maze_id;
        })
        .catch(err => {
          this.error = "Error: " + err.response.data;
        })
        .finally(() => (this.isBtnLoading = false));
    }
  }
};
</script>
