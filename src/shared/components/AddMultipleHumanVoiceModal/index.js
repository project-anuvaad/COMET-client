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
      initialCodesSaved: false,
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
    if (
      this.props.selectedTranslatedArticles &&
      this.props.selectedTranslatedArticles.length > 0
    ) {
      let data = [];
      let languages = [];
      this.props.selectedTranslatedArticles.forEach((ta) => {
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
        });
      }
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (
  //     nextProps.selectedTranslatedArticles !==
  //       this.props.selectedTranslatedArticles &&
  //     nextProps.selectedTranslatedArticles &&
  //     nextProps.selectedTranslatedArticles.length > 0
  //   ) {
  //     let data = [];
  //     let languages = [];
  //     nextProps.selectedTranslatedArticles.forEach((ta) => {
  //       ta.articles.forEach((a) => {
  //         languages.push({
  //           language: a.tts ? `${a.langCode}-tts` : a.langCode,
  //           languageName: a.langName,
  //           tts: a.tts ? true : false,
  //         });
  //       });
  //     });

  //     languages = Array.from(new Set(languages.map(JSON.stringify))).map(
  //       JSON.parse
  //     );

  //     console.log('clearing', nextProps.selectedTranslatedArticles, this.props.selectedTranslatedArticles)
  //     languages.forEach((l) => {
  //       data.push({
  //         ...l,
  //         searchValue: "",
  //         tts: l.tts,
  //         voiceTranslators: [],
  //         textTranslators: [],
  //         verifiers: [],
  //         new: false,
  //       });
  //     });

  //     if (languages.length !== 0) {
  //       this.setState({
  //         data,
  //         isDisabledAddLang: false,
  //         selectedVideosAllLangs: languages,
  //       }); // selectedVideosAllLangs when multiVideos prop equals true
  //     }
  //   }
  // }

  componentWillUpdate = (nextProps) => {
    if (this.props.open !== nextProps.open && nextProps.open) {
      const availableLangs = filterDisabledLangs(
        this.state.dropdownOptions,
        nextProps.disabledLanguages
      );
      this.setState({ dropdownOptions: availableLangs });
    }

    if (!nextProps.multiVideos && !this.state.initialCodesSaved) {
      let data = [];
      nextProps.initialCodes.forEach((langCode) => {
        data.push({
          language: langCode,
          languageName: "",
          tts: langCode.split("-").pop() === "tts" ? true : false,
          searchValue: "",
          voiceTranslators: [],
          textTranslators: [],
          verifiers: [],
          new: false,
        });
      });
      const isDisabledAddLang = data.length > 0 ? false : true;
      data =
        data.length > 0
          ? data
          : [
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
            ];
      this.setState({ data, isDisabledAddLang, initialCodesSaved: true });
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
    const data = this.state.data.slice();
    data.forEach((d) => {
      d.textTranslators = d.textTranslators.map((t) => t._id);
      d.verifiers = d.verifiers.map((v) => v._id);
    });
    this.props.onSubmit(data.filter((d) => d.language || d.languageName));
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

  getTextTranslatorOptions = (selectedTextTranslators) => {
    const { users } = this.props;
    const usersIds = users.map((u) => u._id);

    return selectedTextTranslators
      .filter((t) => !usersIds.includes(t._id))
      .map((t) => ({
        value: t._id,
        text: `${t.firstname} ${t.lastname} (${t.email})`,
      }))
      .concat(
        !users
          ? []
          : users.map((u) => ({
              value: u._id,
              text: `${u.firstname} ${u.lastname} (${u.email})`,
            }))
      );
  };

  getVerifiersOptions = (selectedVerifiers) => {
    const { verifiers } = this.props;
    const verifiersIds = verifiers.map((v) => v._id);

    return selectedVerifiers
      .filter((v) => !verifiersIds.includes(v._id))
      .map((v) => ({
        text: getUserName(v),
        value: v._id,
        key: `user-list-${v._id}`,
      }))
      .concat(
        !verifiers
          ? []
          : verifiers.map((v) => ({
              text: getUserName(v),
              value: v._id,
              key: `user-list-${v._id}`,
            }))
      );
  };

  render() {
    return (
      <Modal size="large" open={this.props.open} onClose={this.props.onClose}>
        <Modal.Header>
          <h3>{this.props.title || "Add Human Voice Over In:"}</h3>
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
                                options={this.getTextTranslatorOptions(
                                  d.textTranslators
                                )}
                                className="translate-users-dropdown"
                                value={
                                  d.textTranslators.length > 0
                                    ? d.textTranslators[0]._id
                                    : null
                                }
                                placeholder="Translator"
                                onChange={(_, { value }) => {
                                  let data = this.state.data.slice();
                                  if (value) {
                                    const userObj = this.props.users.find(
                                      (u) => u._id === value
                                    );
                                    data[i].textTranslators = [userObj];
                                  } else {
                                    data[i].textTranslators = [];
                                  }
                                  this.setState({ data });
                                }}
                                onSearchChange={(e, { searchQuery }) => {
                                  this.props.onSearchUsersChange(searchQuery);
                                }}
                                onBlur={this.props.onBlur}
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
                            onSearchUsersChange={(searchQuery) => {
                              this.props.onSearchUsersChange(searchQuery);
                            }}
                            onBlur={this.props.onBlur}
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
                                options={this.getVerifiersOptions(d.verifiers)}
                                value={d.verifiers.map((v) => v._id)}
                                onChange={(_, { value }) => {
                                  let verifiers = [];
                                  let data = this.state.data.slice();
                                  value.forEach((v) => {
                                    const userObj =
                                      this.props.verifiers.find(
                                        (u) => u._id === v
                                      ) || d.verifiers.find((u) => u._id === v);
                                    verifiers.push(userObj);
                                  });
                                  data[i].verifiers = verifiers;
                                  this.setState({ data });
                                }}
                                onSearchChange={(e, { searchQuery }) => {
                                  this.props.onSearchUsersChange(searchQuery);
                                }}
                                placeholder="Select users"
                                onBlur={this.props.onBlur}
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
