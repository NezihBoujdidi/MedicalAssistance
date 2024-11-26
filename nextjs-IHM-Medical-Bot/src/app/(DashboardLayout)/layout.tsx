"use client";
import { styled, Container, Box } from "@mui/material";
import React, { useState } from "react";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  overflowX: "hidden", // Prevent horizontal scroll
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
  width: "100%", // Ensure content does not exceed viewport width
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <MainWrapper className="mainwrapper">
  
      <PageWrapper className="page-wrapper">
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "1000px",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh)" }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
