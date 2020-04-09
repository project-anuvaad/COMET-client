import React from 'react';
import Box from './Box';


export default class AutomaticStitchingBox extends React.Component {
    state = {
        activeTabIndex: 0,
        tabs: [
            {
                text: 'Manual Stitching',
                backgroundColor: 'blue',
                video: '/img/animations/BeforeVideoStitchingFinal.mp4',
                currentTime: 0,
            },
            {
                text: 'Our Stitching',
                backgroundColor: 'blue',
                video: '/img/animations/AfterVideoStitchingFinal.mp4',
                currentTime: 0,
            }
        ]
    }

    onTabChange = (index, previousTime) => {
        const { tabs, activeTabIndex } = this.state;
        const currentTab = tabs[activeTabIndex];
        currentTab.currentTime = previousTime;
        this.setState({ activeTabIndex: index, tabs: tabs.slice() })
    }

    render() {
        const { tabs } = this.state;
        return (
            <Box
                tabs={tabs}
                activeTabIndex={this.state.activeTabIndex}
                onTabChange={this.onTabChange}
            />
        )
    }
}