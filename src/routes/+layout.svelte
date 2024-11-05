<div id="body">
  <slot />
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  #body {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    background-color: #fff;
    padding: 20px;
  }

  /* Adaptación de dispositivos pequeños */
  @media (max-width: 768px) {
    #body {
      padding: 10px;
    }
    #body::before {
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
    }
  }
</style>
