import React from 'react';
import './style.scss';
import { Grid } from 'semantic-ui-react';

const PLATFORMS = [
    '/img/vendors/Gmail.png',
    '/img/vendors/Google drive.png',
    '/img/vendors/docs.png',
    '/img/vendors/excel.png',
    '/img/vendors/slides.png',
    '/img/vendors/forms.svg',
    '/img/vendors/Dropbox.png',
    '/img/vendors/Airtable.png',
]

export default class EndToEndLocalization extends React.Component {
    render() {
        return (
            <div className="end-to-end-localization">
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Grid>
                                <Grid.Row className="vendors-container">
                                    {PLATFORMS.map((p) => (
                                        <Grid.Column key={`localization-vendor-${p}`} width={4} className="vendor-item">
                                            <img src={p} style={{ width: 60, height: 'auto' }} />
                                        </Grid.Column>
                                    ))}
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column width={2} />
                        <Grid.Column width={8}>
                            <h2 className="end-to-end-header">
                                End to end localization Platform
                            </h2>
                            <h4 className="end-to-end-subheader">
                                One place, not all over the place
                            </h4>
                            <div className="end-to-end-desc">

                                <p>
                                    The days of using multiple platforms such as emails, storage, task managers, and spreadsheets for translations are finally over.
                                </p>
                                <p>
                                    Save time with COMET by securely collaborating across your organization, and translators in one platform
                                </p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}