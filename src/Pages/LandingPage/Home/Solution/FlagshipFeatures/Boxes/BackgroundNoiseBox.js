import React from 'react';
import Box from './Box';


export default class BackgroundNoiseBox extends React.Component {
    state = {
        activeTabIndex: 0,
        tabs: [
            {
                text: 'Raw Audio',
                backgroundColor: 'blue',
                video: '/assets/video_demo/noise_cancellation_before.mp4',
                currentTime: 0,
            },
            {
                text: 'Noise Canceled',
                backgroundColor: 'blue',
                video: '/assets/video_demo/noise_cancellation_after.mp4',
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