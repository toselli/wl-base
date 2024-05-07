<template>
    <div class="splash-screen">
      <div class="spinner-wrapper">
        <div class="loader"></div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .splash-screen {
     background: #f2f0ee;
      width: 100vw;
      height: 100vh;
    position: fixed;
    z-index: 1000;    
  }
  
  .spinner-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
  
    transform: translate(-50%, -50%);
  }
  .loader {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        position: relative;
        animation: rotate 1s linear infinite
      }
      .loader::before , .loader::after {
        content: "";
        box-sizing: border-box;
        position: absolute;
        inset: 0px;
        border-radius: 50%;
        border: 5px solid #999;
        animation: prixClipFix 2s linear infinite ;
      }
      .loader::after{
        transform: rotate3d(90, 90, 0, 180deg );
        border-color: #407ae6;
      }

      @keyframes rotate {
        0%   {transform: rotate(0deg)}
        100%   {transform: rotate(360deg)}
      }

      @keyframes prixClipFix {
          0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
          50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
          75%, 100%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
      }
  </style>