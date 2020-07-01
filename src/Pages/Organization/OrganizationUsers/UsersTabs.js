import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Icon } from "semantic-ui-react";
import InviteModal from "./InviteModal";

class UsersTabs extends React.Component {
  state = {
    tabItems: [{ title: "ORGANIZATION USERS" }],
    isInviteUsersModalVisible: false,
  };

  render() {
    return (
      <div
        style={{
          color: "white",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textTransform: "uppercase",
          backgroundColor: "#12181f",
          padding: "3rem",
          paddingBottom: this.props.extraContent ? 0 : "3rem",
          paddingTop: "4rem",
          marginLeft: "-1rem",
          marginRight: "-1rem",
        }}
      >
        <div
          style={{
            marginBottom: this.props.extraContent ? "2rem" : 0,
          }}
        >
          {this.state.tabItems.map((item, index) => (
            <span
              key={`tabs-item-${item.title}`}
              onClick={() => this.onActiveIndexChange(index)}
              style={{
                display: "inline-block",
                cursor: "pointer",
                marginRight: "2rem",
              }}
            >
              {item.title}
            </span>
          ))}
          <Button
            primary
            circular
            size="large"
            style={{
              position: "absolute",
              right: 0,
              marginRight: "2rem",
              marginTop: "-1rem",
            }}
            onClick={() => this.setState({ isInviteUsersModalVisible: true })}
          >
            <Icon name="plus" /> Invite new user
          </Button>
        </div>
        <InviteModal
          open={this.state.isInviteUsersModalVisible}
          onClose={() => this.setState({ isInviteUsersModalVisible: false })}
        />
        {this.props.extraContent || null}
      </div>
    );
  }
}

const mapStateToProps = ({
  authentication,
  organizationVideos,
  organization,
  video,
}) => ({
  user: authentication.user,
  organization: organization.organization,
  uploadState: video.uploadState,
  videosCounts: organizationVideos.videosCounts,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UsersTabs));
