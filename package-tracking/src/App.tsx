import React from 'react';
import '@mantine/core/styles.css';
import { BrowserRouter, Route, Navigate } from "react-router";

import './App.css';
import { Container, MantineProvider } from '@mantine/core';

function App() {
  return (
   <MantineProvider>
    <Container>
        <BrowserRouter>
          
        </BrowserRouter>
    </Container>
   </MantineProvider>
  );
}

export default App;
