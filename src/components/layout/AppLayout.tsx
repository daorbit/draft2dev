import React from "react";
import { useTheme } from "@mui/material/styles";
import styled from "styled-components";
import Sidebar from "./Sidebar";

const LayoutContainer = styled.div<{ theme: any }>`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.palette.background.default};
  position: relative;
  transition: background-color 0.3s ease;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`;

const ContentArea = styled.main<{ theme: any }>`
  flex: 1;
  background: ${props => props.theme.palette.background.default};
  overflow: auto;
  position: relative;
  transition: background-color 0.3s ease;
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <LayoutContainer theme={theme}>
      <Sidebar />
      <MainContent>
        <ContentArea theme={theme}>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default AppLayout;
