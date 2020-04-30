import React from 'react';
import { Icon, Dropdown, Input } from 'semantic-ui-react';
import { isoLangsArray } from '../../../../shared/utils/langs'
import { generateWhatsappTranslateLink } from '../../../../shared/utils/helpers';
import { filter, startsWith, lowerCase } from 'lodash';

const languagesOptions = isoLangsArray.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name}` }));

export default class TranslateOnWhatsappDropdown extends React.Component {
    state = {
        searchValue: '',
        dropdownOptions: languagesOptions,
    }
    onChange = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery === '') {
            this.setState({ dropdownOptions: languagesOptions, searchValue: '' })
          return;
        }

        const r = filter(languagesOptions, o => lowerCase(o.text).indexOf(lowerCase(searchQuery)) !== -1);
        // const r = filter(languagesOptions, (o) => startsWith(lowerCase(o.text), lowerCase(searchQuery)));
        this.setState({ dropdownOptions: r, searchValue: searchQuery })
      }
    
    render() {

        const { videoId } = this.props;

        return (
            <Dropdown
                fluid
                trigger={(
                    <div>
                        <Icon name="whatsapp" color="green" />
                        Add Voiceover on WhatsApp
                        <Icon name="chevron right" className="pull-right" />
                    </div>
                )}
                icon="none"
                style={{ height: 20 }}
                disabled={this.props.disabled}
                onChange={this.onChange}
            >
                <Dropdown.Menu style={{ width: '100%', padding: '1rem' }}>
                    <h4 style={{ color: '#1b1c21' }}>
                        <span>
                            Selec Voiceover Language
                        </span>
                        <br />
                        <small style={{ color: '#666666' }}>to add voiceover on WhatsApp</small>

                    </h4>
                    <Input
                        input={<input style={{ borderRadius: 25 }} />}
                        icon="search"
                        iconPosition="left"
                        className="search"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        value={this.state.searchValue}
                    />
                    <Dropdown.Menu scrolling style={{ maxHeight: 200, height: 200 }}>
                        {this.state.dropdownOptions.map((option) =>
                            <Dropdown.Item
                                key={option.value}
                                {...option}
                                as={'a'}
                                target="_blank"
                                href={generateWhatsappTranslateLink(videoId, option.value.split('-')[0])}
                            />
                        )}
                        {this.state.dropdownOptions.length === 0 && (
                            <Dropdown.Item
                            >
                                No items found
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}