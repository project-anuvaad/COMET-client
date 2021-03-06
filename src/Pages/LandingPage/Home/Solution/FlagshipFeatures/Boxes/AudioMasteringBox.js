import React from 'react';
import Box from './Box';


export default class AudioMasteringBox extends React.Component {
    state = {
        activeTabIndex: 0,
        tabs: [
            {
                text: 'Raw Audio',
                backgroundColor: 'pink',
                video: '/assets/audio_demo/mastering_unmastered_trimmed.mp3',
                currentTime: 0,
            },
            {
                text: 'Mastered Audio',
                backgroundColor: 'pink',
                video: '/assets/audio_demo/mastering_mastered_trimmed.mp3',
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