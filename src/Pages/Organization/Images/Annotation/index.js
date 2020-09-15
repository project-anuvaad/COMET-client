import React from "react";
import { Grid, Input } from "semantic-ui-react";
import RoleRenderer from "../../../../shared/containers/RoleRenderer";
import { connect } from "react-redux";
import ImagesTabs from "../ImagesTabs";
import ClearPagination from "../../../../shared/components/ClearPagination";
import ImageCard from "../../../../shared/components/ImageCard";
import LoaderComponent from "../../../../shared/components/LoaderComponent";
import EditImageModal from "../../../../shared/components/EditImageModal";
import routes from "../../../../shared/routes";
import {
  fetchImages,
  setCurrentPageNumber,
  setSearchFilter,
  updateImage,
  setStatus,
} from "../../../../actions/image";
import { debounce } from "../../../../shared/utils/helpers";

class Annotation extends React.Component {
  state = {
    isEditImageModalOpen: false,
    selectedImage: null,
  };

  componentDidMount() {
    this.props.setSearchFilter("");
    this.props.setStatus("uploaded");
    this.props.fetchImages();
  }

  debouncedSearch = debounce(() => {
    this.props.setCurrentPageNumber(1);
    this.props.fetchImages();
  }, 500);

  onPageChange = (e, { activePage }) => {
    this.props.setCurrentPageNumber(activePage);
    this.props.fetchImages();
  };

  onSearchChange = (searchTerm) => {
    this.props.setSearchFilter(searchTerm);
    this.debouncedSearch();
  };

  onEditClick = (image) => {
    this.setState({
      isEditImageModalOpen: true,
      selectedImage: image,
    });
  };

  onAnnotate = (imageId) => {
    window.location.href = routes.annotateImage(imageId);
  };

  renderPagination = () => (
    <ClearPagination
      activePage={this.props.currentPageNumber}
      onPageChange={this.onPageChange}
      totalPages={this.props.totalPagesCount}
    />
  );

  renderEditVideoModal = () => {
    const { selectedImage } = this.state;
    if (!selectedImage) return null;
    return (
      <EditImageModal
        open={this.state.isEditImageModalOpen}
        initialValues={{
          title: selectedImage.title,
          langCode: selectedImage.langCode,
        }}
        onClose={() =>
          this.setState({ isEditImageModalOpen: false, selectedImage: null })
        }
        onSave={(changes) => {
          this.props.updateImage(this.state.selectedImage._id, changes);
          this.setState({ isEditImageModalOpen: false, selectedImage: null });
        }}
      />
    );
  };

  render() {
    return (
      <LoaderComponent active={this.props.imagesLoading}>
        <ImagesTabs />
        <Grid style={{ margin: "1rem" }}>
          <RoleRenderer roles={[]}>
            <Grid.Row>
              <Grid.Column width={5}>
                <Input
                  fluid
                  style={{ height: "100%" }}
                  type="text"
                  icon="search"
                  iconPosition="left"
                  input={
                    <input
                      type="text"
                      style={{
                        borderRadius: 20,
                        color: "#999999",
                        backgroundColor: "#d4e0ed",
                      }}
                    />
                  }
                  placeholder="Search by file name, video name, etc"
                  value={this.props.searchFilter}
                  onChange={(e, { value }) => this.onSearchChange(value)}
                />
              </Grid.Column>
              <Grid.Column width={11}>
                <div className="pull-right" style={{ marginLeft: "2rem" }}>
                  {this.renderPagination()}
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              {this.props.images.map((image) => (
                <Grid.Column width={4} style={{ marginBottom: 10 }}>
                  <ImageCard
                    image={image}
                    rounded
                    editable
                    buttonTitle="Annotate"
                    onEditClick={() => {
                      this.onEditClick(image);
                    }}
                    onButtonClick={() => {
                      this.onAnnotate(image._id);
                    }}
                  />
                </Grid.Column>
              ))}
            </Grid.Row>
          </RoleRenderer>
          {this.renderEditVideoModal()}
        </Grid>
      </LoaderComponent>
    );
  }
}

const mapStateToProps = ({ image, organization }) => ({
  organization: organization.organization,
  images: image.images,
  currentPageNumber: image.currentPageNumber,
  totalPagesCount: image.totalPagesCount,
  imagesLoading: image.imagesLoading,
  searchFilter: image.searchFilter,
});

const mapDispatchToProps = (dispatch) => ({
  setStatus: (status) => dispatch(setStatus(status)),
  fetchImages: () => dispatch(fetchImages()),
  updateImage: (imageId, changes) => dispatch(updateImage(imageId, changes)),
  setCurrentPageNumber: (pageNumber) =>
    dispatch(setCurrentPageNumber(pageNumber)),
  setSearchFilter: (searchFilter) => dispatch(setSearchFilter(searchFilter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Annotation);
