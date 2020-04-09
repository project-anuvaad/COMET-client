import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import LoaderComponent from '../../../shared/components/LoaderComponent';
import ApiKeyFormModal from './components/ApiKeyFormModal';

import * as actions from './modules/actions';
import ApiKeysTable from './components/ApiKeysTable';

class APIKeys extends React.Component {

    componentWillMount = () => {
        this.props.fetchApiKeys();
    }

    onApiKeyFormChange = (changes) => {
        const { apiKeyForm } = this.props;
        Object.keys(changes).forEach(key => {
            apiKeyForm[key] = changes[key];
        })
        this.props.setApiKeyForm({ ...apiKeyForm })
    }

    onSubmit = () => {
        this.props.createApiKey();
    }
    
    render() {
        return (
            <div className="organization-setting">
                <h2 style={{ margin: 20 }}>
                    API Keys
                </h2>
                <div className="wrapper">
                    <div className="ui fluid card">

                        <div className="content">
                            <div className="header">

                                <div className="pull-right">

                                    <Button icon primary labelPosition='left' onClick={() => this.props.setApiKeyFormOpen(true)}>
                                        <Icon name='plus' />
                                        Create new keys
                                    </Button>
                                </div>
                            </div>


                        </div>
                        <LoaderComponent active={this.props.loading}>

                            <div className="content">
                                <ApiKeysTable />
                            </div>
                        </LoaderComponent>

                    </div>
                </div>

                <ApiKeyFormModal
                    origins={this.props.apiKeyForm.origins}
                    originOptions={this.props.organization.origins.concat(this.props.apiKeyForm.origins)}
                    permissions={this.props.apiKeyForm.permissions}
                    open={this.props.apiKeyFormOpen}
                    onClose={() => this.props.setApiKeyFormOpen(false)}
                    onChange={this.onApiKeyFormChange}
                    onSubmit={this.onSubmit}
                />
            </div>
        )
    }
}

const mapStateToProps = ({ apiKeys, organization }) => ({
    ...apiKeys,
    organization: organization.organization,
})

const mapDispatchToProps = (dispatch) => ({
    fetchApiKeys: () => dispatch(actions.fetchApiKeys()),
    setApiKeyForm: (form) => dispatch(actions.setApiKeyForm(form)),
    setApiKeyFormOpen: (open) => dispatch(actions.setApiKeyFormOpen(open)),
    createApiKey: () => dispatch(actions.createApiKey()),
})

export default connect(mapStateToProps, mapDispatchToProps)(APIKeys);