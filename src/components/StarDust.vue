<template>
  <div class="container" @mousemove="handleMouseMove">
    <!-- 여기에 마우스 이동시 나타날 요소들을 추가하세요 -->
    <div v-for="(star, index) in stars" :key="index" class="star"></div>
  </div>
</template>

<script>
export default {
  name: "StarDust",
  data() {
    return {
      stars: [],
      sparkles: 50,
      swide: 0,
      shigh: 0,
    };
  },
  methods: {
    handleMouseMove(event) {
      // 마우스 위치를 추적하고 별을 만듭니다
      const x = event.clientX;
      const y = event.clientY;
      this.createStar(x, y);
    },
    createStar(x, y) {
      // 새로운 별을 만들어 화면에 나타냅니다
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = x + "px";
      star.style.top = y + "px";
      document.body.appendChild(star);
      setTimeout(() => {
        document.body.removeChild(star);
      }, 1000);
    },
    setWindowSize() {
      // 윈도우의 크기를 설정합니다
      this.swide = window.innerWidth;
      this.shigh = window.innerHeight;
    },
  },
  mounted() {
    // 컴포넌트가 마운트된 후에 실행되는 부분
    this.setWindowSize();
    window.addEventListener("resize", this.setWindowSize);
  },
  beforeUnmount() {
    // 컴포넌트가 파괴되기 전에 실행되는 부분
    window.removeEventListener("resize", this.setWindowSize);
  },
};
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: gold;
  pointer-events: none;
  animation: sparkle 1s linear;
}

@keyframes sparkle {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}
</style>
