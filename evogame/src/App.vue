<template>
  <div id="app">
    <form @submit.prevent="handleSubmit">
      <label for="size">Size:</label>
      <input type="number" id="size" v-model="size" required>
      
      <label for="speed">Speed:</label>
      <input type="number" id="speed" v-model="speed" required>

      <label for="foodNeeded">Food Needed:</label>
      <input type="number" id="foodNeeded" v-model="foodNeeded" required>

      <label for="location">Location:</label>
      <input type="text" id="location" v-model="location" required>

      <label for="predator">Predator (1 for predator, 0 for prey):</label>
      <input type="number" id="predator" v-model="predator" required>

      <button type="submit">Submit</button>
    </form>

    <div>
      <h2>Score: {{ score }}</h2>
    </div>

    <div>
      <h2>Leaderboard</h2>
      <ul>
        <li v-for="(score, index) in leaderboard" :key="index">
          {{ index + 1 }}. {{ score }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      size: '',
      speed: '',
      foodNeeded: '',
      location: '',
      predator: '',
      leaderboard: [],
    };
  },
  methods: {
    handleSubmit() {
      // Calculate score based on input values
      const score = parseFloat(this.size) * parseFloat(this.speed); // Example calculation

      // Push score to leaderboard
      this.leaderboard.push(score);

      // Reset form fields
      this.size = '';
      this.speed = '';
      this.foodNeeded = '';
      this.location = '';
      this.predator = '';
    }
  },
  computed: {
    score() {
      // Calculate total score (e.g., sum of leaderboard)
      return this.leaderboard.reduce((acc, curr) => acc + curr, 0);
    }
  }
};
</script>

<style>
/* Add global styles */
</style>
