import React from 'react';
import './style.scss'
import { Grid } from 'semantic-ui-react';

export default class Map extends React.Component {
    render() {
        const {
            countHeader,
            countDescription,
            infoItems,
            image,
            number,
        } = this.props;
        return (
            <Grid className={`map map${number}`}>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <div
                            className="counter-container"
                        >
                            <h1
                                className="count-header"
                            >
                                {countHeader}
                            </h1>
                            <p
                                className="count-desc"
                            >
                                {countDescription}
                            </p>
                        </div>
                        <div className="description">
                            {infoItems.map((item, index) => (
                                <p key={`info-item-${item}`} className="desc-item">
                                    <span className={`desc-circle desc${index + 1}-label`} />
                                    {item}
                                </p>
                            ))}
                        </div>
                    </Grid.Column>
                    <Grid.Column width={7}>
                            <img src={image} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}