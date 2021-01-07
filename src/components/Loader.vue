<template>
  <div
    class="loader"
    :class="{ 'has-overlay': hasOverlay }"
  >
    <!--TODO: Think of a better way to handle inline svg animation in vue-->
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 160 160"
      xml:space="preserve"
    >
      <g class="st0" />
      <path
        class="st1"
        d="M42.9,70.761l21.183-19.13h37.634l21.183,19.13l-39.887,37.608L42.9,70.761z
          M66.449,57.5h11.493l24.563,24.239
          L82.9,100.217L51.689,70.87L66.449,57.5z"
      >
        <animate
          attributeName="opacity"
          values=".22;.66;.22"
          dur="1.3s"
          repeatCount="indefinite"
        />
      </path>
      <g transform="matrix(.866 -.5 .25 .433 80 80)">
        <path
          class="st2"
          d="M2.455,72.835c35.899,0,65-31.34,65-70c0-2.761,2.239-5,5-5s5,2.239,5,5
          C77.455,41.495,43.876,72.835,2.455,72.835z"
        >
          <animateTransform
            accumulate="none"
            additive="replace"
            attributeName="transform"
            calcMode="linear"
            dur="1.3s"
            fill="remove"
            from="360 0 0"
            repeatCount="indefinite"
            restart="always"
            to="0 0 0"
            type="rotate"
          />
        </path>
      </g>
    </svg>
    <div class="progress-message">
      {{ progressMessage }}
    </div>
    <div class="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasOverlay: { type: Boolean },
    progressMessage: { type: String },
    message: { type: String },
  },
};
</script>

<style lang="scss" scoped>
.st0 {
  opacity: 0.66;
}

.st1 {
  opacity: 0.44;
  fill-rule: evenodd;
  clip-rule: evenodd;
  fill: #fff;
}

.st2 {
  fill: #fff;
}

.loader {
  text-align: center;

  .progress-message {
    color: $tip_note_color;
  }

  .message {
    color: $pure_white;
  }

  .message,
  .progress-message {
    font-size: 15px;
    line-height: 19.5px;
    text-align: center;
    margin-top: 8px;
  }

  svg {
    width: 56px;
    height: 56px;
  }

  &.lg svg {
    width: 72px;
    height: 72px;
  }

  &.has-overlay {
    position: absolute;
    padding: 16px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    left: 0;
    top: 0;
    z-index: 3;
    background-color: $article_content_color;
  }
}
</style>
