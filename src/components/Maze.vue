<template>
  <div class="game fill-height pa-16">
    <div
      class="maze fill-height"
      :style="{ '--cols': cols, '--rows': rows }"
      v-if="data"
    >
      <div
        class="cell"
        v-for="(cell, index) of data.data"
        :class="[
          cell.join(' '),
          { pony: index === data.pony[0] },
          { domokun: index === data.domokun[0] },
          { 'border-right': index !== 0 && (index + 1) % cols === 0 },
          { 'border-bottom': index > cols * rows - cols - 1 }
        ]"
        :key="index"
      >
        <span v-if="index === data.pony[0]">🐎</span>
        <span v-if="index === data.domokun[0]">👾</span>
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
    },

    cols: {
      type: Number,
      required: true
    },

    rows: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    data: null
  }),

  created() {
    this.$axios.get(`/maze/${this.id}`).then(({ data }) => {
      this.data = data;
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
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);

    .cell {
      &.border-right {
        border-right: 1px solid;
      }

      &.border-bottom {
        border-bottom: 1px solid;
      }

      &.north {
        border-top: 1px solid;
      }

      &.west {
        border-left: 1px solid;
      }

      &.pony,
      &.domokun {
        font-size: 2rem;
        display: grid;
        place-items: center;
      }
    }
  }
}
</style>
