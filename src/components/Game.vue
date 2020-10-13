<template>
  <div class="game fill-height pa-16">
    <div class="maze fill-height" v-if="cells">
      <div
        class="cell"
        v-for="(cell, index) of cells"
        :class="[cell.join(' '), { pony: index === ponyPos }]"
        :key="index"
      >
        <span v-if="index === ponyPos">🐎</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  data: () => ({
    cells: null,
    ponyPos: null
  }),

  created() {
    this.$axios.get(`/maze/${this.id}`).then(({ data }) => {
      this.cells = data.data;
      this.ponyPos = data.pony[0];
    });
  }
};
</script>

<style lang="scss" scoped>
.game {
  background: #2193b0; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #6dd5ed,
    #2193b0
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #6dd5ed,
    #2193b0
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .maze {
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    grid-template-rows: repeat(15, 1fr);

    .cell {
      border: 1px solid rgba(black, 0.1);

      &.north {
        border-top: 1px solid;
      }

      &.west {
        border-left: 1px solid;
      }

      &.pony {
        font-size: 2rem;
        display: grid;
        place-items: center;
      }
    }
  }
}
</style>
