import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Icon, Input, Dropdown, Popup, Grid, Progress } from 'semantic-ui-react';
import './style.scss';
import moment from 'moment';
import RoleRenderer from '../../containers/RoleRenderer';
import ShowMore from '../ShowMore';
import ReactPlayer from 'react-player';
import { formatTime } from '../../utils/helpers';
import { getUserNamePreview } from '../../utils/helpers';
import ReactAvatar from 'react-avatar';
import VideoPlayer from '../VideoPlayer';
import AnimatedButton from '../AnimatedButton';

class VideoCard extends React.Component {
    state = {
        hovering: false,
    }

    isHovering = () => {
        return this.state.hovering || this.props.focused;
    }

    renderTopBar = () => {
        return (
            <div className="topbar-container">
                <div>
                    {this.props.selectable && (
                        <input type="checkbox" checked={this.props.selected || false} onChange={() => this.props.onSelectChange(!this.props.selected)} className="select-checkbox" />
                    )}
                </div>
                <div>
                    <a href={this.props.url} target="_blank">
                        <Button circular size="tiny" icon="download" />
                    </a>
                    {this.props.deleteable && (
                        <Button circular size="tiny" icon="trash alternate" onClick={this.props.onDeleteVideoClick} />
                    )}
                </div>
            </div>
        )
    }

    renderOptions = () => {
        return (
            <RoleRenderer roles={['admin']}>
                <Dropdown
                    direction="left"
                    className="pull-right"
                    icon={<Icon color="gray" name="ellipsis vertical" />}
                // className="video-card__dropdown-options"
                >
                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={this.props.onEditClick}
                        >
                            <Icon
                                color="blue"
                                name="edit"
                                size="small"
                                onClick={this.props.onEditClick}
                            /> Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={this.props.onAddClick}
                        >
                            <Icon
                                color="green"
                                name="add"
                                size="small"
                                onClick={this.props.onAddClick}
                            /> Add Transcribers
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={this.props.onAddVerifiersClick}
                        >
                            <Icon
                                color="green"
                                name="add"
                                size="small"
                                onClick={this.props.onAddVerifiersClick}
                            /> Add Approvers
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </RoleRenderer>

        )
    }

    render() {
        const {
            showOptions,
            reviewers,
            verifiers,
            title,
            url,
            thumbnailUrl,
            buttonTitle,
            loading,
            disabled,
            onButtonClick,
            duration,
            created_at,
            uploadedBy,
            selected,
            titleRoute,
            rounded,
        } = this.props;

        const isHovering = this.isHovering();

        return (
            <div className={`video-card ${rounded ? 'rounded' : ''} ${selected ? 'selected' : ''}`} style={{
                boxShadow: isHovering ? '0 2px 34px 0 rgba(0, 0, 0, 0.2)' : 'none'
            }}>
                <Card fluid
                    style={{ boxShadow: 'none' }}
                    onMouseEnter={() => this.setState({ hovering: true })}
                    onMouseLeave={() => this.setState({ hovering: false })}
                >
                    <div className="video-container">
                        <VideoPlayer
                            thumbnail={thumbnailUrl}
                            duration={duration}
                            src={url}
                            videoProps={{ width: '100%', height: '150px' }}
                        />
                        {isHovering && this.renderTopBar()}
                    </div>
                    <Grid style={{ marginTop: 0, marginBottom: 0 }}>
                        <Grid.Row style={{ alignItems: 'center' }}>
                            <Grid.Column width={showOptions ? 14 : 16}>

                                {titleRoute ? (
                                    <Link to={titleRoute}>
                                        <h3 className="video-card__header">
                                            <ShowMore length={55} text={title} />
                                        </h3>
                                    </Link>
                                ) : (

                                        <h3 className="video-card__header">
                                            <ShowMore length={55} text={title} />
                                        </h3>
                                    )}
                            </Grid.Column>
                            {showOptions && (
                                <Grid.Column width={2}>
                                    {this.renderOptions()}
                                </Grid.Column>
                            )}
                        </Grid.Row>
                    </Grid>
                    {created_at && (
                        <Card.Content extra>
                            <small>
                                Uploaded on {moment(created_at).format('MMMM Do YYYY')}
                                {uploadedBy && (
                                    <span> | By {getUserNamePreview(uploadedBy)}</span>
                                )}
                            </small>
                        </Card.Content>
                    )}
                    {/* <video src={url} controls preload={'false'} width={'100%'} /> */}
                    {this.props.extra ? this.props.extra : ''}
                    {(reviewers || verifiers) && (

                        <div style={{ margin: 20 }}>
                            {reviewers && reviewers.length > 0 && (
                                <div>
                                    Review: {reviewers.map((reviewer) => (
                                        <Popup
                                            trigger={
                                                <span>
                                                    <ReactAvatar
                                                        name={getUserNamePreview(reviewer)}
                                                        style={{ margin: '0 10px', display: 'inline-block' }}
                                                        size={30}
                                                        round
                                                    />
                                                </span>
                                            }
                                            content={getUserNamePreview(reviewer)}
                                        />
                                    ))}</div>
                            )}
                            {verifiers && verifiers.length > 0 && (
                                <div style={{ marginTop: reviewers && reviewers.length > 0 ? 10 : 0 }}>
                                    Verify: &nbsp;&nbsp;{verifiers.map((reviewer) => (
                                        <Popup
                                            trigger={
                                                <span>
                                                    <ReactAvatar
                                                        name={getUserNamePreview(reviewer)}
                                                        style={{ margin: '0 10px', display: 'inline-block' }}
                                                        size={30}
                                                        round
                                                    />
                                                </span>
                                            }
                                            content={getUserNamePreview(reviewer)}
                                        />
                                    ))}</div>
                            )}
                        </div>
                    )}
                    <Grid style={{ margin: 0 }}>
                        <Grid.Row style={{ alignItems: 'center' }}>
                            <Grid.Column width={this.props.showSkip ? 8 : 10}>
                                <AnimatedButton
                                    onClick={onButtonClick}
                                    fluid
                                    circular
                                    basic={!isHovering}
                                    color={'blue'}
                                    size="small"
                                    disabled={loading}
                                    loading={disabled}
                                    className={`action-button`}
                                    animation="moema"
                                    animating={this.props.animateButton}
                                >
                                    {buttonTitle}
                                    <Icon name="chevron right" style={{ marginLeft: 10 }} />
                                </AnimatedButton>
                            </Grid.Column>
                            {this.props.showSkip && (
                                <Grid.Column width={8}>
                                    <div className="pull-right">
                                        <Popup
                                            content="Skip AI transcribe and proofread directly"
                                            trigger={<Icon name="info circle" style={{ color: 'gray' }} />}
                                        />
                                        <a href="javascript:void(0)" onClick={() => this.props.onSkipClick()} >Skip Transcribe</a>
                                    </div>
                                </Grid.Column>
                            )}
                        </Grid.Row>
                    </Grid>
                    {this.props.showWhatsappIcon && (
                        <Card.Content extra style={{ backgroundColor: '#ecf5fe' }}>
                            <p>
                                {typeof this.props.whatsappIconContent === 'string' ? (
                                    <a style={{ paddingLeft: 10, paddingRight: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} target="_blank" rel="noopener noreferrer" href={this.props.whatsappIconTarget || ''} >
                                        <div>
                                            <Icon name="whatsapp" color="green" size="large" />
                                            <span>
                                                {this.props.whatsappIconContent || ''}
                                            </span>
                                        </div>
                                        <Icon name="chevron right" className="pull-right" />
                                    </a>
                                ) : (
                                        <a style={{ paddingLeft: 10, paddingRight: 10, display: 'block' }} >
                                            {this.props.whatsappIconContent || ''}
                                        </a>
                                    )}
                                {/* <Icon name="whatsapp" /> */}
                            </p>
                        </Card.Content>
                    )}
                </Card>
            </div >
        );
    }
}

export default VideoCard;