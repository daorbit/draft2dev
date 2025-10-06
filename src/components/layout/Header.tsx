import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 16px 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e7eb;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.div`
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Inter, system-ui, sans-serif';
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoText>Test App</LogoText>
      </LogoContainer>
    </HeaderContainer>
  );
};

export default Header;