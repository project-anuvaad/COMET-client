import React from 'react';
import FAQ from '../../../shared/components/FAQ';
import LandingPage from '../../../layouts/LandingPage';

export default class FAQPage extends React.Component {
  
    render() {
        return (
            <LandingPage stretched>
                <FAQ />
            </LandingPage >
        )
    }
}