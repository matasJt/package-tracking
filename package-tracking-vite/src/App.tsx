import "@mantine/core/styles.css";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import "./App.css";
import { Container, MantineProvider } from "@mantine/core";
import Header from "./Components/Package/Header/Header";
import PackageList from "./Components/Package/PackagesList";
import PackageDetail from "./Components/Package/PackageDetails";
import { ModalsProvider } from "@mantine/modals";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MantineProvider>
        <ModalsProvider modalProps={{ zIndex: 1500 }}>
          <Header />
          <Container size="lg">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/packages" replace />} />
                <Route path="/packages" element={<PackageList />} />
                <Route path="/packages/:packageId" element={<PackageDetail />} />
              </Routes>
            </BrowserRouter>
          </Container>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;