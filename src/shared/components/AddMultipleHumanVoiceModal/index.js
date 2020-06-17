import React from "react";
// import PropTypes from "prop-types";
import {
  Modal,
  ModalContent,
  ModalActions,
  Button,
  Dropdown,
  Input,
  Grid,
  Icon,
} from "semantic-ui-react";
import { filter, lowerCase } from "lodash";
import {
  isoLangsArray,
  isoLangs,
  TTSLangs,
  signLangsArray,
} from "../../utils/langs";
import AssignTranslateUsersForm from "../AssignTranslateUsersForm";
import { getUserName } from "../../utils/helpers";

const languagesOptions = isoLangsArray
  .concat([...TTSLangs, ...signLangsArray])
  .map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name}` }));

function filterDisabledLangs(langs, disabledLangs) {
  return langs.filter((lang) => disabledLangs.indexOf(lang.value) === -1);
}

class AddMultipleHumanVoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOptions: languagesOptions.slice(),
      isDisabledAddLang: true,
      selectedVideosAllLangs: [],
      data: [
        {
          language: "",
          languageName: "",
          searchValue: "",
          tts: false,
          voiceTranslators: [],
          textTranslators: [],
          verifiers: [],
          new: false,
        },
      ],
    };
  }

  componentDidMount() {
    if (
      this.props.disabledLanguages &&
      this.props.disabledLanguages.length > 0
    ) {
      const availableLangs = this.state.dropdownOptions.filter(
        (lang) => this.props.disabledLanguages.indexOf(lang.value) === -1
      );
      this.setState({ dropdownOptions: availableLangs });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedTranslatedArticles !==
        this.props.selectedTranslatedArticles &&
      nextProps.selectedTranslatedArticles &&
      nextProps.selectedTranslatedArticles.length > 0
    ) {
      let data = [];
      let languages = [];
      nextProps.selectedTranslatedArticles.forEach((ta) => {
        ta.articles.forEach((a) => {
          languages.push({
            language: a.tts ? `${a.langCode}-tts` : a.langCode,
            languageName: a.langName,
            tts: a.tts ? true : false,
          });
        });
      });

      languages = Array.from(new Set(languages.map(JSON.stringify))).map(
        JSON.parse
      );

      languages.forEach((l) => {
        data.push({
          ...l,
          searchValue: "",
          tts: l.tts,
          voiceTranslators: [],
          textTranslators: [],
          verifiers: [],
          new: false,
        });
      });

      if (languages.length !== 0) {
        this.setState({
          data,
          isDisabledAddLang: false,
          selectedVideosAllLangs: languages,
        }); // selectedVideosAllLangs when multiVideos prop equals true
      }
    }
  }

  componentWillUpdate = (nextProps) => {
    if (this.props.open !== nextProps.open && nextProps.open) {
      const availableLangs = filterDisabledLangs(
        this.state.dropdownOptions,
        nextProps.disabledLanguages
      );
      this.setState({ dropdownOptions: availableLangs });
    }
  };

  onInputClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onChange(e, i) {
    const data = this.state.data.slice();
    const searchQuery = e.target.value;
    const selectedLangs = this.state.data
      .map((d) => d.language)
      .filter((l) => l);

    if (searchQuery === "") {
      data[i].searchValue = "";
      this.setState({
        dropdownOptions: filterDisabledLangs(
          languagesOptions,
          this.props.disabledLanguages.concat(selectedLangs)
        ),
        data,
      });
      return;
    }
    const r = filter(
      languagesOptions,
      (o) => lowerCase(o.text).indexOf(lowerCase(searchQuery)) !== -1
    );
    // const r = filter(languagesOptions, (o) => startsWith(lowerCase(o.text), lowerCase(searchQuery)));
    data[i].searchValue = searchQuery;
    this.setState({
      dropdownOptions: filterDisabledLangs(
        r,
        this.props.disabledLanguages.concat(selectedLangs)
      ),
      data,
    });
  }

  onLanguageSelect = (i, langCode, languageName = "") => {
    if (!langCode && languageName) {
      // Try to find language similar to the language name
      const tmpLangCode = languagesOptions.find(
        (l) => languageName.toLowerCase().indexOf(l.text.toLowerCase()) !== -1
      );
      if (tmpLangCode) {
        langCode = tmpLangCode.value;
      }
    }
    let tts = false;
    if (langCode && langCode.split("-").pop() === "tts") {
      tts = true;
    }
    let data = this.state.data.slice();
    data[i].language = langCode;
    data[i].languageName = languageName;
    data[i].searchValue = "";
    data[i].tts = tts;

    let langCodeExists;
    let langNameExists;

    if (langCode) {
      langCodeExists = this.state.selectedVideosAllLangs.find(
        (l) => langCode === l.language
      );
    } else if (languageName) {
      langNameExists = this.state.selectedVideosAllLangs.find(
        (l) => langCode === l.languageName
      );
    }

    langCodeExists || langNameExists
      ? (data[i].new = false)
      : (data[i].new = true);

    this.setState({ data });
    const selectedLangs = this.state.data
      .map((d) => d.language)
      .filter((l) => l);
    const isDisabledAddLang = this.isDisabledAddLang();
    this.setState({
      dropdownOptions: filterDisabledLangs(
        languagesOptions,
        this.props.disabledLanguages.concat(selectedLangs)
      ),
      isDisabledAddLang,
    });
  };

  getDropdownText = (i) => {
    const data = this.state.data.slice();
    const language = data[i].language;
    const languageName = data[i].languageName;

    if (languageName) return languageName;
    if (language && isoLangs[language] && isoLangs[language].name)
      return isoLangs[language].name;
    if (language && TTSLangs.find((l) => l.code === language))
      return TTSLangs.find((l) => l.code === language).name;
    if (language && signLangsArray.find((l) => l.code === language))
      return signLangsArray.find((l) => l.code === language).name;

    return "Select Language";
  };

  onSubmit = () => {
    this.props.onSubmit(
      this.state.data.filter((d) => d.language || d.languageName)
    );
  };

  addNewRow = () => {
    let data = this.state.data.slice();
    data.push({
      language: "",
      languageName: "",
      searchValue: "",
      tts: false,
      textTranslators: [],
      voiceTranslators: [],
      verifiers: [],
    });
    this.setState({ data, isDisabledAddLang: true });
  };

  isDisabledAddLang = () => {
    const lastDataItem = this.state.data[this.state.data.length - 1];
    if (lastDataItem.language || lastDataItem.languageName) return false;
    return true;
  };

  onDeleteRow = (i) => {
    let data = this.state.data.slice();
    const removedLang = data[i].language;
    data.splice(i, 1);
    const selectedLangs = data.map((d) => d.language).filter((l) => l);
    let disabledLangs = this.props.disabledLanguages;
    if (this.props.multiVideos && disabledLangs.includes(removedLang)) {
      disabledLangs.splice(disabledLangs.indexOf(removedLang), 1);
    }
    disabledLangs = disabledLangs.concat(selectedLangs);
    this.setState({
      data,
      dropdownOptions: filterDisabledLangs(languagesOptions, disabledLangs),
    });
  };

  render() {
    const verifiersOptions = this.props.verifiers
      ? this.props.verifiers.map((user) => ({
          text: getUserName(user),
          value: user._id,
          key: `user-list-${user._id}`,
        }))
      : [];
    const { users } = this.props;
    const textTranslatorOptions = !users
      ? []
      : users.map((user) => ({
          value: user._id,
          text: `${user.firstname} ${user.lastname} (${user.email})`,
        }));
    return (
      <Modal size="large" open={this.props.open} onClose={this.props.onClose}>
        <Modal.Header>
          <h3>Add Human Voice Over In:</h3>
        </Modal.Header>
        <ModalContent>
          <Grid columns="three">
            <Grid.Row>
              <Grid.Column>
                <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
                  Language <small>(Required)</small>
                </h4>
              </Grid.Column>
              <Grid.Column>
                <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
                  Translator <small>(Optional)</small>
                </h4>
              </Grid.Column>
              <Grid.Column>
                <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
                  Approver <small>(Optional)</small>
                </h4>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns="three" divided="vertically">
            {this.state.data.map((d, i) => {
              return (
                <Grid.Row key={`AddMultipleHumanVoiceModal-languageRow-${i}`}>
                  <Grid.Column>
                    <Dropdown
                      fluid
                      text={this.getDropdownText(i)}
                      disabled={this.props.disabled}
                      className="icon"
                      onChange={(e) => {
                        this.onChange(e, i);
                      }}
                      noResultsMessage="Try another search."
                    >
                      <Dropdown.Menu style={{ width: "100%" }}>
                        <Input
                          icon="search"
                          iconPosition="left"
                          className="search"
                          onClick={this.onInputClick}
                          value={d.searchValue}
                        />
                        <Dropdown.Menu scrolling>
                          {this.state.dropdownOptions.map((option) => (
                            <Dropdown.Item
                              key={option.value}
                              {...option}
                              onClick={() =>
                                this.onLanguageSelect(i, option.value)
                              }
                            />
                          ))}
                          {this.state.dropdownOptions.length === 0 && (
                            <Dropdown.Item
                              onClick={() =>
                                this.onLanguageSelect(i, "", d.searchValue)
                              }
                            >
                              <Icon color="green" name="plus" />
                              {d.searchValue}
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Grid.Column>
                  {(d.language || d.languageName) && (
                    <React.Fragment>
                      <Grid.Column>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width={4}>Text</Grid.Column>
                            <Grid.Column
                              width={12}
                              style={{ textAlign: "left" }}
                            >
                              <Dropdown
                                fluid
                                search
                                selection
                                clearable
                                options={textTranslatorOptions}
                                className="translate-users-dropdown"
                                value={
                                  d.textTranslators.length > 0
                                    ? d.textTranslators[0]
                                    : null
                                }
                                placeholder="Translator"
                                onChange={(_, { value }) => {
                                  let data = this.state.data.slice();
                                  let textTranslators = [];
                                  textTranslators.push(value);
                                  data[i].textTranslators = textTranslators;
                                  this.setState({ data });
                                }}
                              />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                        {!this.props.multiVideos && !d.tts && (
                          <AssignTranslateUsersForm
                            users={this.props.users}
                            speakersProfile={this.props.speakersProfile}
                            translators={d.voiceTranslators}
                            tts={d.tts}
                            onChange={(translators) => {
                              let data = this.state.data.slice();
                              data[i].voiceTranslators = translators;
                              this.setState({ data });
                            }}
                          />
                        )}
                      </Grid.Column>
                      <Grid.Column>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width={13}>
                              <Dropdown
                                clearable
                                fluid
                                multiple
                                search
                                selection
                                options={verifiersOptions}
                                value={d.verifiers}
                                onChange={(_, { value }) => {
                                  let data = this.state.data.slice();
                                  data[i].verifiers = value;
                                  this.setState({ data });
                                }}
                                placeholder="Select users"
                              />
                            </Grid.Column>
                            <Grid.Column width={3}>
                              <Button
                                basic
                                circular
                                icon="trash"
                                color="red"
                                size="tiny"
                                onClick={() => this.onDeleteRow(i)}
                              />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Grid.Column>
                    </React.Fragment>
                  )}
                </Grid.Row>
              );
            })}
            <Grid.Row>
              <Grid.Column>
                <Button
                  color="blue"
                  onClick={this.addNewRow}
                  disabled={this.state.isDisabledAddLang}
                >
                  Add Language
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </ModalContent>
        <ModalActions>
          {this.props.skippable ? (
            <Button onClick={() => this.props.onSkip()}>Skip</Button>
          ) : (
            <Button onClick={this.props.onClose}>Cancel</Button>
          )}
          <Button color="blue" onClick={this.onSubmit}>
            Go
          </Button>
        </ModalActions>
      </Modal>
    );
  }
}

export default AddMultipleHumanVoiceModal;
