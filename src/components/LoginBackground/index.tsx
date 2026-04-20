import styled, { keyframes } from 'styled-components';

// 1. 必须将 keyframes 提取到组件外部定义，确保全局可用
const speeder = keyframes`
  0% { transform: translate(2px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -3px) rotate(-1deg); }
  20% { transform: translate(-2px, 0px) rotate(1deg); }
  30% { transform: translate(1px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 3px) rotate(-1deg); }
  60% { transform: translate(-1px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-2px, -1px) rotate(1deg); }
  90% { transform: translate(2px, 1px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
`;

const fazer1 = keyframes` 0% { left: 0; } 100% { left: -80px; opacity: 0; } `;
const fazer2 = keyframes` 0% { left: 0; } 100% { left: -100px; opacity: 0; } `;
const fazer3 = keyframes` 0% { left: 0; } 100% { left: -50px; opacity: 0; } `;
const fazer4 = keyframes` 0% { left: 0; } 100% { left: -150px; opacity: 0; } `;

const lf = keyframes` 0% { left: 200%; } 100% { left: -200%; opacity: 0; } `;
const lf2 = keyframes` 0% { left: 200%; } 100% { left: -200%; opacity: 0; } `;
const lf3 = keyframes` 0% { left: 200%; } 100% { left: -100%; opacity: 0; } `;
const lf4 = keyframes` 0% { left: 200%; } 100% { left: -100%; opacity: 0; } `;

const LoginBackground = () => {
  return (
    <StyledWrapper>
      <div className="bg-container">
        <div className="loader">
          <span>
            <span />
            <span />
            <span />
            <span />
          </span>
          <div className="base">
            <span />
            <div className="face" />
          </div>
        </div>
        <div className="longfazers">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .bg-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-color: #f0f2f5;
    overflow: hidden;
  }

  .loader {
    position: absolute;
    top: 60%; /* 稍微往下调一点，避开表单中心 */
    left: 50%;
    margin-left: -50px;
    /* 使用外部定义的 keyframes 变量 */
    animation: ${speeder} 0.4s linear infinite;
  }

  .loader > span {
    height: 5px;
    width: 35px;
    background: #000;
    position: absolute;
    top: -19px;
    left: 60px;
    border-radius: 2px 10px 1px 0;
  }

  .base span {
    position: absolute;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-right: 100px solid #000;
    border-bottom: 6px solid transparent;
  }

  .base span:before {
    content: '';
    height: 22px;
    width: 22px;
    border-radius: 50%;
    background: #000;
    position: absolute;
    right: -110px;
    top: -16px;
  }

  .base span:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 0 solid transparent;
    border-right: 55px solid #000;
    border-bottom: 16px solid transparent;
    top: -16px;
    right: -98px;
  }

  .face {
    position: absolute;
    height: 12px;
    width: 20px;
    background: #000;
    border-radius: 20px 20px 0 0;
    transform: rotate(-40deg);
    right: -125px;
    top: -15px;
  }

  .face:after {
    content: '';
    height: 12px;
    width: 12px;
    background: #000;
    right: 4px;
    top: 7px;
    position: absolute;
    transform: rotate(40deg);
    transform-origin: 50% 50%;
    border-radius: 0 0 0 2px;
  }

  .loader > span > span:nth-child(1) {
    animation: ${fazer1} 0.2s linear infinite;
  }
  .loader > span > span:nth-child(2) {
    animation: ${fazer2} 0.4s linear infinite;
    top: 3px;
  }
  .loader > span > span:nth-child(3) {
    animation: ${fazer3} 0.4s linear infinite;
    top: 1px;
    animation-delay: -1s;
  }
  .loader > span > span:nth-child(4) {
    animation: ${fazer4} 1s linear infinite;
    top: 4px;
    animation-delay: -1s;
  }

  .longfazers {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .longfazers span {
    position: absolute;
    height: 2px;
    width: 20%;
    background: #000;
  }

  .longfazers span:nth-child(1) {
    top: 20%;
    animation: ${lf} 0.6s linear infinite;
    animation-delay: -5s;
  }
  .longfazers span:nth-child(2) {
    top: 40%;
    animation: ${lf2} 0.8s linear infinite;
    animation-delay: -1s;
  }
  .longfazers span:nth-child(3) {
    top: 60%;
    animation: ${lf3} 0.6s linear infinite;
  }
  .longfazers span:nth-child(4) {
    top: 80%;
    animation: ${lf4} 0.5s linear infinite;
    animation-delay: -3s;
  }
`;

export default LoginBackground;
