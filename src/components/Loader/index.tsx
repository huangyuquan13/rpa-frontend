import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  /* 居中容器，方便在登录页显示 */
  display: flex;
  justify-content: center;
  align-items: center;

  .container-loader {
    width: 300px;
    height: 300px;
    position: relative;
    transform-style: preserve-3d;
    transform: perspective(500px) rotateX(60deg);

    .aro {
      position: absolute;
      /* 使用传入的 --s 变量计算间距 */
      inset: calc(var(--s) * 10px);
      box-shadow: inset 0 0 80px #00f;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      animation: strim 3s infinite ease-in-out both;
      /* 使用 --s 变量计算动画延迟，形成交错效果 */
      animation-delay: calc(var(--s) * -0.1s);
    }
  }

  @keyframes strim {
    0%,
    100% {
      transform: translateZ(-100px) rotate(0deg);
    }
    50% {
      transform: translateZ(100px) rotate(90deg);
    }
  }
`;

const Loader = () => {
  return (
    <StyledWrapper>
      <aside className="container-loader">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="aro"
            style={{ '--s': i } as React.CSSProperties}
          />
        ))}
      </aside>
    </StyledWrapper>
  );
};

export default Loader;
