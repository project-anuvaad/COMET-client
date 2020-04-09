import React, { Component } from 'react'
import { Button, Icon, Dropdown } from 'semantic-ui-react'
import moment from 'moment'
import PropTypes from 'prop-types';
import VoiceSpeedController from './VoiceSpeedController'
import { NotificationManager } from 'react-notifications';
import { displayArticleLanguage } from '../../utils/helpers';

export default class EditorFooter extends Component {
  _renderPlayIcon() {
    const { isPlaying } = this.props

    const icon = isPlaying ? 'pause' : 'play'

    return (
      <Icon name={icon} />
    )
  }

  _renderToggleButton() {
    return this.props.hideSidebarToggle ? null
      : (
        <Button
          basic
          icon
          className="c-editor__footer-sidebar c-editor__toolbar-publish"
          onClick={() => this.props.toggleSidebar()}
        >
          <Icon name="content" />
        </Button>
      )
  }

  render() {
    const {
      onSlideBack,
      onSlideForward,
      togglePlay,
      currentSlideIndex,
      totalSlideCount,
      updatedAt,
      uploadState,
      showSelectBaseLanguage,
      selectedBaseLanguage,
      baseLanguages,
    } = this.props
    const date = moment(updatedAt)

    return (
      <div className="c-editor__footer">
        {this._renderToggleButton()}

        <Button
          basic
          icon
          className="c-editor__toolbar-publish"
          onClick={this.props.onCCToggle}
        >
          <Icon name="cc" />
        </Button>
        {this.props.options.showVoiceSpeed && (
          <VoiceSpeedController
            onSpeedChange={(value) => this.props.onSpeedChange(value)}
          />
        )}
        <span className="c-editor__footer-controls">
          <Button
            basic
            icon
            className="c-editor__toolbar-publish"
            onClick={() => uploadState !== 'loading' ? onSlideBack()
              : NotificationManager.info('An upload is already in progress, please hold')
            }
            disabled={currentSlideIndex === 0}
          >
            <Icon name="step backward" />
          </Button>
          <Button
            basic
            icon
            className="c-editor__toolbar-publish"
            onClick={() => togglePlay()}
          >
            {this._renderPlayIcon()}
          </Button>
          <Button
            basic
            icon
            className="c-editor__toolbar-publish"
            onClick={() => uploadState !== 'loading' ? onSlideForward()
              : NotificationManager.info('An upload is already in progress, please hold')
            }
            disabled={currentSlideIndex + 1 === totalSlideCount}
          >
            <Icon name="step forward" />
          </Button>
        </span>
        {showSelectBaseLanguage && selectedBaseLanguage && (
          <Dropdown
            style={{ position: 'absolute', right: 10 }}
            placeholder="Select base language"
            text={baseLanguages && baseLanguages.length > 0 ?
              <span style={{ color: 'black' }}>{selectedBaseLanguage ? `Base Language: ${displayArticleLanguage(selectedBaseLanguage)}` : 'Select base language'}</span>
              : <span style={{ color: 'black' }}>No base languages available yet</span>
            }
          >
            <Dropdown.Menu>
              {baseLanguages && baseLanguages.length > 0 ? baseLanguages.map((lang, index) => (
                <Dropdown.Item
                  key={'base-language-dropdown' + index}
                  active={displayArticleLanguage(lang) === displayArticleLanguage(selectedBaseLanguage)}
                  onClick={() => this.props.onChangeBaseLanguage(lang)}
                >
                  {displayArticleLanguage(lang)}
                </Dropdown.Item>
              )) : (
                  <Dropdown.Item active>
                    No base languages available yet
                </Dropdown.Item>
                )}
            </Dropdown.Menu>
          </Dropdown>
        )}
        {updatedAt && (
          <span className="c-editor__last-updated">
            {`Last Updated: ${date.format('DD MMMM YYYY')}, at ${date.format('hh:mm')}`}
          </span>
        )}
      </div >
    )
  }
}

EditorFooter.defaultProps = {
  onCCToggle: () => { },
  onChangeBaseLanguage: () => { },
  options: {},
}

EditorFooter.propTypes = {
  currentSlideIndex: PropTypes.number.isRequired,
  totalSlideCount: PropTypes.number.isRequired,
  onSlideBack: PropTypes.func.isRequired,
  onSlideForward: PropTypes.func.isRequired,
  togglePlay: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  hideSidebarToggle: PropTypes.bool.isRequired,
  onSpeedChange: PropTypes.func.isRequired,
  updatedAt: PropTypes.string,
  uploadState: PropTypes.string,
  onCCToggle: PropTypes.func,
  options: PropTypes.object,
}
