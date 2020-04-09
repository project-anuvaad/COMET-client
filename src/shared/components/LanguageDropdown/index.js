import React from 'react';
import { Dropdown, Input, Icon } from 'semantic-ui-react';
import './style.scss';

export default class LanguageDropdown extends React.Component {
    state = {
        options: [],
        search: '',
        value: '',
        open: false,
    }

    componentDidMount = () => {
        if (this.props.options) {
            this.setState({ options: this.props.options });
        }
    }

    onSearchChange = (e) => {
        const search = e.target.value;
        if (!search) {
            return this.setState({ options: this.props.options, search: '' });
        }
        const newOptions = this.props.options.filter((op) => op.text.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        this.setState({ options: newOptions, search });
    }

    onChange = option => {
        this.props.onChange(option.value);
        this.setState({ search: '', options: this.props.options });
    }

    getLabel = () => {
        if (!this.props.value || !this.props.options) return 'All Languages';
        const currentLanguage = this.props.options.find(o => o.value === this.props.value);
        if (currentLanguage) return `${currentLanguage.text}`
    }

    render() {
        const { options, open } = this.state;
        const { clearable } = this.props;
        let langOptions = clearable ? [{ value: '', text: 'All languages' }] : [];
        if (options) {
            langOptions = langOptions.concat(options);
        }

        return (
            <Dropdown
                className={`language-search ${this.props.className || ''} ${this.props.selection ? 'custom-selection' : ''}`}
                text={this.getLabel()}
                direction="left"
                fluid={this.props.fluid || false}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
                // icon={`chevron ${open ? 'up' : 'down'}`}
            >
                <Dropdown.Menu>
                    <Input
                        clearable
                        icon='search'
                        iconPosition='left'
                        className='search'
                        value={this.state.search}
                        fluid
                        placeholder="Search language"
                        onChange={this.onSearchChange}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {this.state.open && (
                        <Dropdown.Menu scrolling>
                            {langOptions.map((option) => (
                                <Dropdown.Item
                                    key={option.value}
                                    active={option.value === this.props.value}
                                    onClick={() => this.onChange(option)}
                                >
                                    {option.text} <Icon name="chevron right" />
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}