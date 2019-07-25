import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './app';

export default function App(props) {
    
    return (
        <Router>
            <AppLayout></AppLayout>
        </Router>
    );
}
