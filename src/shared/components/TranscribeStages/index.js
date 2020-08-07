import React from 'react';
import { Icon } from 'semantic-ui-react';

const SUBTABS = [{ title: `Break Video` }, { title: `Proofread` }, { title: `Completed` }];
function generateStyle(item, activeStage, activeColor) {
    const styles = {
        display: 'inline-block',
        marginRight: '0.5rem',
        textTransform: 'none',
        fontSize: '1rem',
        opacity: 0.5,
    };

    if (activeStage.toLowerCase() === item.title.toLowerCase()) {
        styles.opacity = 1;
        styles.fontWeight = 'bold';
        if (activeColor) {
            styles.color = activeColor;
        }
    }

    return styles;
}

export default class TranscribeStages extends React.Component {

    render() {
        const { activeStage, activeColor } = this.props;
      
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem' }}>
                {SUBTABS.map((item, index) => (
                    <div
                        key={`subtab-item-${item.title}`}
                    >
                        <span
                            style={{ ...generateStyle(item, activeStage, activeColor) }}
                        >
                            {item.title}
                        </span>
                        {index !== 2 && (
                            <Icon name="chevron right" style={{ opacity: 0.5 }} />
                        )}
                    </div>
                ))}
            </div>
        )
    }
}