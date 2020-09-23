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
  setCurrentPageNumber,
  setSearchFilter,
  updateImage,
  setStatus,
  translateImage,
  fetchImagesTranslations,
} from "../../../../actions/image";
import { debounce } from "../../../../shared/utils/helpers";
import SelectLanguageModal from "../../../../shared/components/SelectLanguageModal";

class ImageTranslations extends React.Component {
  state = {
    isEditImageModalOpen: false,
    selectedImage: null,
    isTranslateImageModalOpen: false,
  };

  componentDidMount() {
    this.props.setSearchFilter("");
    this.props.setStatus("done");
    this.props.fetchImagesTranslations();
  }

  debouncedSearch = debounce(() => {
    this.props.setCurrentPageNumber(1);
    this.props.fetchImagesTranslations();
  }, 500);

  onPageChange = (e, { activePage }) => {
    this.props.setCurrentPageNumber(activePage);
    this.props.fetchImagesTranslations();
  };

  onSearchChange = (searchTerm) => {
    this.props.setSearchFilter(searchTerm);
    this.debouncedSearch();
  };

  onTranslate = (image) => {
    this.setState({ selectedImage: image, isTranslateImageModalOpen: true });
  };

  onTranslateSubmit = (langCode) => {
    const { selectedImage } = this.state;
    this.setState({ isTranslateImageModalOpen: false, selectedImage: null });
    this.props.translateImage(selectedImage._id, langCode)
  };

  renderPagination = () => (
    <ClearPagination
      activePage={this.props.currentPageNumber}
      onPageChange={this.onPageChange}
      totalPages={this.props.totalPagesCount}
    />
  );

  renderSelectLanguageModal = () => {
    const { selectedImage, isTranslateImageModalOpen } = this.state;
    if (!isTranslateImageModalOpen) return null;

    return (
      <SelectLanguageModal
        open={isTranslateImageModalOpen}
        onClose={() =>
          this.setState({
            isTranslateImageModalOpen: false,
            selectedImage: null,
          })
        }
        onSubmit={this.onTranslateSubmit}
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
                <Grid.Column width={4} key={`images-list-${image._id}`} style={{ marginBottom: '2rem' }}>
                  <ImageCard
                    image={image}
                    rounded
                    buttonTitle="Translate"
                    onButtonClick={() => {
                      this.onTranslate(image);
                    }}
                    translations={image.translations || []}
                  />
                </Grid.Column>
              ))}
              {this.renderSelectLanguageModal()}
            </Grid.Row>
          </RoleRenderer>
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
 fetchImagesTranslations: () => dispatch(fetchImagesTranslations()),
  updateImage: (imageId, changes) => dispatch(updateImage(imageId, changes)),
  setCurrentPageNumber: (pageNumber) =>
    dispatch(setCurrentPageNumber(pageNumber)),
  setSearchFilter: (searchFilter) => dispatch(setSearchFilter(searchFilter)),
  translateImage: (id, langCode) => dispatch(translateImage(id, langCode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageTranslations);
