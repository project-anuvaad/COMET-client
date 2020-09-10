import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import routes from "../../../shared/routes";
import UploadNewImageModal from "./UploadNewImageModal";
import NotificationService from "../../../shared/utils/NotificationService";

// import * as videoActions from "./modules/actions";
import AnimatedButton from "../../../shared/components/AnimatedButton";
const items = [{ title: "Annotate" }, { title: "Translations" }];

class ImagesTabs extends React.Component {
  state = {
    currentTitle: "",
    tabItems: [],
    uploadFormOpen: false,
    animating: false,
  };

  componentDidMount = () => {
    const { pathname } = this.props.location;
    const tabItems = [...items];

    this.setState({ tabItems });
    if (pathname.indexOf(routes.organizationImageAnnotation()) !== -1) {
      this.setState({ currentTitle: "Annotate" });
    } else if (pathname.indexOf(routes.organizationImageTranslation()) !== -1) {
      this.setState({ currentTitle: "Translations" });
    } else {
      this.setState({ currentTitle: "Annotate" });
    }
  };

  // componentWillReceiveProps = (nextProps) => {
  //   if (
  //     this.props.uploadState === "loading" &&
  //     nextProps.uploadState === "done"
  //   ) {
  //     NotificationService.success("Uploaded successfully");
  //     this.setState({ uploadFormOpen: false });
  //     this.props.fetchVideos();
  //     this.props.fetchVideosCount();
  //   }
  //   if (
  //     this.props.uploadState === "loading" &&
  //     nextProps.uploadState === "failed"
  //   ) {
  //     NotificationService.error(nextProps.uploadError);
  //     this.setState({ uploadFormOpen: false });
  //   }
  //   if (nextProps.videosCounts) {
  //     if (nextProps.videosCounts.total === 0 && !this.state.animating) {
  //       this.setState({ animating: true });
  //     } else if (this.state.animating && nextProps.videosCounts.total !== 0) {
  //       this.setState({ animating: false });
  //     }
  //   }
  // };

  componentWillUnmount = () => {
    if (this.animateInterval) {
      clearInterval(this.animateInterval);
      this.animateInterval = null;
    }
  };

  canUpload = () => {
    return true;
  };

  onActiveIndexChange = (val) => {
    const currentTitle = this.state.tabItems[val].title;
    this.setState({ currentTitle });
    switch (currentTitle.toLowerCase()) {
      case "annotate":
        return this.props.history.push(routes.organizationImageAnnotation());
      case "translations":
        this.props.history.push(routes.organizationImageTranslation());
        return;
      default:
        break;
    }
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
                opacity: this.state.currentTitle === item.title ? 1 : 0.5,
              }}
            >
              {item.title}
            </span>
          ))}
          {this.canUpload() && (
            <React.Fragment>
              <AnimatedButton
                style={{
                  position: "absolute",
                  right: 0,
                  marginRight: "2rem",
                  marginTop: "-1rem",
                }}
                animating={this.state.animating}
                animation="moema"
                animationInterval={4000}
                primary
                circular
                size="large"
                icon="upload"
                content="Upload"
                onClick={() => this.setState({ uploadFormOpen: true })}
              />
              <UploadNewImageModal
                open={this.state.uploadFormOpen}
                onClose={() => this.setState({ uploadFormOpen: false })}
              />
            </React.Fragment>
          )}
        </div>
        {this.props.extraContent || null}
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, organization }) => ({
  user: authentication.user,
  organization: organization.organization,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ImagesTabs));
