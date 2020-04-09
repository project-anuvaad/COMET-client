import React from 'react';
import './style.scss'
import { Button } from 'semantic-ui-react';
export default class Tabs extends React.Component {

    render() {
        const { items, activeIndex, onActiveIndexChange } = this.props;
        const props = {}
        if (this.props.id) {
            props.id = this.props.id;
        }
        return (
            <div className="tabs-container" {...props}>
                <Button.Group>

                    {items && items.map((item, index) => {
                        const props = {
                            className: `tab-item ${activeIndex === index ? 'active' : ''}`,
                            key: `tabs-item-${item.title}`,
                            onClick: () => onActiveIndexChange(index)
                        }
                        if (item.render) {
                            const Comp = () => item.render(props);
                            return <Comp />
                        }
                        return (
                            <Button circular {...props} >
                                {item.title}
                            </Button>
                        )
                    }
                    )}
                </Button.Group>

            </div>
        )
    }
}