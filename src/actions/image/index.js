import * as actionTypes from "./types";
import Api from "../../shared/api";
import requestAgent from "../../shared/utils/requestAgent";
import NotificationService from "../../shared/utils/NotificationService";
import asyncSeries from "async/series";
import organization from "../../reducers/organization";
import routes from "../../shared/routes";
import { SET_SEARCH_FILTER } from "../../Pages/Organization/Tasks/modules/types";

export const setUploadImageForm = (uploadImageForm) => ({
  type: actionTypes.SET_UPLOAD_IMAGE_FORM,
  payload: uploadImageForm,
});

export const setUploadActiveTabIndex = (activeTabIndex) => ({
  type: actionTypes.SET_UPLOAD_ACTIVE_TAB_INDEX,
  payload: activeTabIndex,
});

export const setCurrentPageNumber = (currentPageNumber) => ({
  type: actionTypes.SET_CURRENT_PAGE_NUMBER,
  payload: currentPageNumber,
});

export const setTotalPagesCount = (totalPagesCount) => ({
  type: actionTypes.SET_TOTAL_PAGES_COUNT,
  payload: totalPagesCount,
});

export const resetUploadImageForm = () => ({
  type: actionTypes.RESET_UPLOAD_IMAGE_FORM,
});

export const setImages = (images) => ({
  type: actionTypes.SET_IMAGES,
  payload: images,
});

export const setImagesLoading = (loading) => ({
  type: actionTypes.SET_IMAGES_LOADING,
  payload: loading,
});

export const setSearchFilter = (searchFilter) => ({
  type: actionTypes.SET_SEARCH_FILTER,
  payload: searchFilter,
});

export const uploadImages = (organization) => (dispatch, getState) => {
  const { uploadImageForm } = getState().image;
  const { images } = uploadImageForm;
  const uploadImageFuncArray = [];
  images.forEach((image) => {
    uploadImageFuncArray.push((cb) => {
      const { langCode, content, name } = image;
      requestAgent
        .post(Api.image.uploadImage())
        .field("title", name)
        .field("langCode", langCode)
        .field("organization", organization || "")
        .attach("image", content)
        .then((res) => {
          cb();
        })
        .catch((err) => {
          cb();
          console.log(err);
        });
    });
  });
  asyncSeries(uploadImageFuncArray, () => {
    NotificationService.success(`The images have been uploaded succeefully`);
    dispatch(setCurrentPageNumber(1));
    dispatch(fetchImages());
    dispatch(resetUploadImageForm());
  });
};

const setImage = (image) => ({
  type: actionTypes.SET_IMAGE,
  payload: image,
});

export const fetchImageById = (id) => (dispatch) => {
  dispatch(setImage(null));
  requestAgent
    .get(Api.image.getById(id))
    .then((res) => {
      const { image } = res.body;
      dispatch(setImage(image));
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Some thing went wrong");
      dispatch(setImagesLoading(false));
    });
};

export const updateImageGroups = (id, groups) => (dispatch) => {
  requestAgent
    .put(Api.image.updateImageGroups(id), {
      groups,
    })
    .then((res) => {
      const { image } = res.body;
      dispatch(setImage(image));
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Some thing went wrong");
      dispatch(setImagesLoading(false));
    });
};

export const setStatus = (status) => ({
  type: actionTypes.SET_STATUS,
  payload: status,
});

export const fetchImages = () => (dispatch, getState) => {
  const { organization } = getState().organization;
  const { currentPageNumber, searchFilter, status } = getState().image;
  dispatch(setImagesLoading(true));
  requestAgent
    .get(
      Api.image.getImages({
        organization: organization._id,
        page: currentPageNumber,
        search: searchFilter,
        status,
      })
    )
    .then((res) => {
      console.log(res.body);
      const { images, pagesCount } = res.body;
      dispatch(setImages(images));
      dispatch(setTotalPagesCount(pagesCount || 1));
      dispatch(setImagesLoading(false));
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Some thing went wrong");
      dispatch(setImagesLoading(false));
    });
};

export const fetchImagesTranslations = () => (dispatch, getState) => {
  const { organization } = getState().organization;
  const { currentPageNumber, searchFilter, status } = getState().image;
  dispatch(setImagesLoading(true));
  requestAgent
    .get(
      Api.image.getImagesTranslations({
        organization: organization._id,
        page: currentPageNumber,
        search: searchFilter,
        status,
      })
    )
    .then((res) => {
      console.log(res.body);
      const { images, pagesCount } = res.body;
      dispatch(setImages(images));
      dispatch(setTotalPagesCount(pagesCount || 1));
      dispatch(setImagesLoading(false));
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Some thing went wrong");
      dispatch(setImagesLoading(false));
    });
};
export const updateImage = (id, chnages) => (dispatch, getState) => {
  requestAgent
    .patch(Api.image.updateImageById(id), chnages)
    .then((res) => {
      const { image } = res.body;
      const oldImages = getState().image.images.slice();
      const oldImage = oldImages.find((i) => i._id === image._id);
      if (oldImage) {
        oldImage.title = image.title;
        oldImage.langCode = image.langCode;
        dispatch(setImages(oldImages));
        NotificationService.success(`The image has been updated succeefully`);
      }
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Some thing went wrong");
    });
};

export const updateImageStatus = (id, status) => (dispatch, getState) => {
  requestAgent
    .put(Api.image.updateImageStatus(id), { status })
    .then((res) => {
      const { image } = res.body;
      NotificationService.success("Recorded successfully");
      setTimeout(() => {
        window.location.href = routes.organizationImageAnnotation();
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Some thing went wrong");
    });
};

export const translateImage = (id, langCode) => (dispatch, getState) => {
  requestAgent
    .post(Api.image.translateImage(id), { langCode })
    .then((res) => {
      const { image } = res.body;
      console.log(image);
      NotificationService.success("Recorded successfully");
      setTimeout(() => {
        window.location.href = routes.organizationImageAnnotation();
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Some thing went wrong");
    });
};