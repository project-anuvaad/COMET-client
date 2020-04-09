import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalContent, ModalActions, Button, Dropdown, Input, Grid, Icon } from 'semantic-ui-react';
import { filter, startsWith, lowerCase } from 'lodash';
import { isoLangsArray, isoLangs, TTSLangs, signLangsArray } from '../utils/langs'
import AssignTranslateUsersForm from './AssignTranslateUsersForm';
import { getUserName } from '../utils/helpers';

const languagesOptions = isoLangsArray.concat([...TTSLangs, ...signLangsArray ]).map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name}` }));
function filterDisabledLangs(langs, disabledLangs) {
  return langs.filter((lang) => disabledLangs.indexOf(lang.value) === -1)
}

class AddHumanVoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: props.defaultValue,
      languageName: props.defaultLanguageName,
      dropdownOptions: languagesOptions.slice(),
      searchValue: '',
      otherLangVisible: '',
      tts: false,
      translators: [],
      verifiers: [],
    }
  }

  componentDidMount() {
    if (this.props.disabledLanguages && this.props.disabledLanguages.length > 0) {
      const availableLangs = this.state.dropdownOptions.filter((lang) => this.props.disabledLanguages.indexOf(lang.value) === -1);
      this.setState({ dropdownOptions: availableLangs });
    }
  }

  componentWillUpdate = (nextProps) => {
    if (this.props.open !== nextProps.open && nextProps.open) {
      const availableLangs = filterDisabledLangs(this.state.dropdownOptions, nextProps.disabledLanguages);
      this.setState({ dropdownOptions: availableLangs, translators: [], verifiers: [], tts: false });
    }
  }

  onInputClick(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  onChange(e) {
    const searchQuery = e.target.value;
    if (searchQuery === '') {
      this.setState({ dropdownOptions: filterDisabledLangs(languagesOptions, this.props.disabledLanguages), searchValue: '' })
      return;
    }
    const r = filter(languagesOptions, o => lowerCase(o.text).indexOf(lowerCase(searchQuery)) !== -1);
    // const r = filter(languagesOptions, (o) => startsWith(lowerCase(o.text), lowerCase(searchQuery)));
    this.setState({ dropdownOptions: filterDisabledLangs(r, this.props.disabledLanguages), searchValue: searchQuery });
  }

  onLanguageSelect = (langCode, languageName = '') => {
    if (!langCode && languageName) {
      // Try to find language similar to the language name
      const tmpLangCode = languagesOptions.find((l) => languageName.toLowerCase().indexOf(l.text.toLowerCase()) !== -1);
      if (tmpLangCode) {
        langCode = tmpLangCode.value;
      }
    }
    let tts = false;
    if (langCode && langCode.split('-').pop() === 'tts') {
      tts = true;
    }
    console.log('selected', langCode, languageName)
    this.setState({ language: langCode, languageName, searchValue: '', dropdownOptions: languagesOptions, tts });
  }

  getDropdownText = () => {
    if (this.state.languageName) return this.state.languageName;
    if ((this.state.language && isoLangs[this.state.language] && isoLangs[this.state.language].name)) return isoLangs[this.state.language].name;
    if (this.state.language && TTSLangs.find(l => l.code === this.state.language)) return TTSLangs.find((l) => l.code === this.state.language).name;
    if (this.state.language && signLangsArray.find(l => l.code === this.state.language)) return signLangsArray.find((l) => l.code === this.state.language).name;

    return 'Select Language';
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.language, this.state.languageName, this.state.translators, this.state.verifiers)
  }

  render() {
    const verifiersOptions = this.props.verifiers ? this.props.verifiers.map((user) => ({ text: getUserName(user), value: user._id, key: `user-list-${user._id}` })) : [];
    return (
      <Modal size="tiny" open={this.props.open} onClose={this.props.onClose}>
        <Modal.Header>
          <h3>Add Human Voice Over In:</h3>
        </Modal.Header>
        <ModalContent  >
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Dropdown
                  fluid
                  text={this.getDropdownText()}
                  disabled={this.props.disabled}
                  className='icon'
                  onChange={this.onChange.bind(this)}
                  noResultsMessage='Try another search.'
                >
                  <Dropdown.Menu style={{ width: '100%' }}>
                    <Input icon="search" iconPosition="left" className="search" onClick={this.onInputClick.bind(this)} value={this.state.searchValue} />
                    <Dropdown.Menu scrolling>
                      {this.state.dropdownOptions.map((option) =>
                        <Dropdown.Item key={option.value} {...option} onClick={() => this.onLanguageSelect(option.value)} />
                      )}
                      {this.state.dropdownOptions.length === 0 && (
                        <Dropdown.Item
                          onClick={() => this.onLanguageSelect('', this.state.searchValue)}
                        >
                          <Icon color="green" name="plus" />
                          {this.state.searchValue}
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown.Menu>
                </Dropdown>
              </Grid.Column>
            </Grid.Row>
            {(this.state.language || this.state.languageName) && (
              <React.Fragment>

                <Grid.Row>
                  <Grid.Column width={16}>
                    <h4
                      style={{ textAlign: 'center', marginBottom: '1rem' }}
                    >
                      Assing users <small>(Optional)</small>
                    </h4>
                  </Grid.Column>
                  <Grid.Column width={16}>
                    <AssignTranslateUsersForm
                      users={this.props.users}
                      speakersProfile={this.props.speakersProfile}
                      translators={this.state.translators}
                      tts={this.state.tts}
                      onChange={(translators) => this.setState({ translators })}
                    />
                  </Grid.Column>
                </Grid.Row>


                <Grid.Row>
                  <Grid.Column width={16}>
                    <h4
                      style={{ textAlign: 'center', marginBottom: '1rem' }}
                    >
                      Assing Verifiers <small>(Optional)</small>
                    </h4>
                  </Grid.Column>
                  <Grid.Column width={16}>
                  <Dropdown
                        clearable
                        fluid
                        multiple
                        search
                        selection
                        options={verifiersOptions}
                        value={this.state.verifiers}
                        onChange={(_, { value }) => this.setState({ verifiers: value })}
                        placeholder='Select users'
                    />
                  </Grid.Column>
                </Grid.Row>
              </React.Fragment>
            )}
          </Grid>
        </ModalContent>
        <ModalActions>
          {this.props.skippable ? (
            <Button onClick={() => this.props.onSkip()} >Skip</Button>
          ) : (
              <Button onClick={this.props.onClose}>Cancel</Button>
            )}
          <Button color="blue" onClick={this.onSubmit} >Go</Button>
        </ModalActions>
      </Modal>
    )
  }
}

AddHumanVoiceModal.defaultProps = {
  open: false,
  skippable: true,
  onClose: () => { },
  onSkip: () => { },
  onSubmit: () => { },
  disabledLanguages: [],
  disabled: false,
  defaultValue: '',
}

AddHumanVoiceModal.propTypes = {
  open: PropTypes.bool,
  disabled: PropTypes.bool,
  onClose: PropTypes.func,
  onSkip: PropTypes.func,
  onSubmit: PropTypes.func,
  skippable: PropTypes.bool,
  disabledLanguages: PropTypes.array,
  defaultValue: PropTypes.string,
}

export default AddHumanVoiceModal;
