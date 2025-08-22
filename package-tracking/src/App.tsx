import React, { useState } from "react";
import "@mantine/core/styles.css";
import { BrowserRouter, Route, Navigate, Routes } from "react-router";
import "./App.css";
import { Container, MantineProvider } from "@mantine/core";
import Header from "./Components/Package/Header/Header";
import PackageList from "./Components/Package/PackagesList";
import PackageDetail from "./Components/Package/PackageDetail";
import { ModalsProvider } from "@mantine/modals";

function App() {
  return (
    <MantineProvider>
      <ModalsProvider modalProps={{zIndex:1500}}>
        <Header />
        <Container size="lg">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/packages" replace />} />
              <Route path="/packages/" element={<PackageList />} />
              <Route path="packages/:packageId" element={<PackageDetail />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
