import React from "react";
import moment from "moment";
import { getUserNamePreview } from "../../utils/helpers";
import ShowMore from "../ShowMore";
import AnimatedButton from "../AnimatedButton";
import RoleRenderer from "../../containers/RoleRenderer";
import { Grid, Icon, Image, Card, Dropdown } from "semantic-ui-react";
import "./style.scss";

class ImageCard extends React.Component {
  state = {
    hovering: false,
  };

  renderOptions = () => {
    return (
      <RoleRenderer roles={[]}>
        <Dropdown
          direction="left"
          className="pull-right"
          icon={<Icon color="gray" name="ellipsis vertical" />}
        >
          <Dropdown.Menu>
            {this.props.options ? (
              this.props.options.map((option) => (
                <Dropdown.Item onClick={option.onClick}>
                  {option.content}
                </Dropdown.Item>
              ))
            ) : (
              <React.Fragment>
                <Dropdown.Item onClick={this.props.onEditClick}>
                  <Icon
                    color="blue"
                    name="edit"
                    size="small"
                    onClick={this.props.onEditClick}
                  />{" "}
                  Edit
                </Dropdown.Item>
              </React.Fragment>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </RoleRenderer>
    );
  };

  render() {
    const { image, rounded, selected } = this.props;
    return (
      <div
        className={`image-card ${rounded ? "rounded" : ""} ${
          selected ? "selected" : ""
        }`}
        style={{
          boxShadow: this.state.hovering
            ? "0 2px 34px 0 rgba(0, 0, 0, 0.2)"
            : "none",
        }}
      >
        <Card
          fluid
          style={{ boxShadow: "none" }}
          onMouseEnter={() => this.setState({ hovering: true })}
          onMouseLeave={() => this.setState({ hovering: false })}
        >
          <div>
            <div className="image-container">
              <Image src={image.url} />
            </div>
          </div>
          <Grid style={{ marginTop: 0, marginBottom: 0 }}>
            <Grid.Row style={{ alignItems: "center" }}>
              <Grid.Column width={14}>
                <h3 className="image-card__header">
                  <ShowMore length={55} text={image.title} />
                </h3>
              </Grid.Column>
              <Grid.Column width={2}>{this.renderOptions()}</Grid.Column>
            </Grid.Row>
          </Grid>
          {image.created_at && (
            <Card.Content extra>
              <small>
                Uploaded on {moment(image.created_at).format("MMMM Do YYYY")}
                {image.uploadedBy && (
                  <span> | By {getUserNamePreview(image.uploadedBy)}</span>
                )}
              </small>
            </Card.Content>
          )}

          <Grid style={{ margin: 0 }}>
            <Grid.Row style={{ alignItems: "center" }}>
              <Grid.Column width={this.props.showSkip ? 8 : 10}>
                <AnimatedButton
                  onClick={this.props.onButtonClick}
                  fluid
                  circular
                  basic={!this.state.hovering}
                  color={"blue"}
                  size="small"
                  disabled={false}
                  loading={false}
                  className={`action-button`}
                  animation="moema"
                  animating={this.props.animateButton}
                >
                  Annotate
                  <Icon name="chevron right" style={{ marginLeft: 10 }} />
                </AnimatedButton>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card>
      </div>
    );
  }
}

export default ImageCard;
