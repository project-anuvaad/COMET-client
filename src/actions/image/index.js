import * as actionTypes from "./types";
import Api from "../../shared/api";
import requestAgent from "../../shared/utils/requestAgent";
import NotificationService from "../../shared/utils/NotificationService";
import asyncSeries from "async/series";
import routes from "../../shared/routes";

const moduleName = 'image';

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
        window.location.href = routes.translateImage(image._id);
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Some thing went wrong");
    });
};

export const setTranslationActiveTabIndex = index => ({
  type: actionTypes.SET_TRANSLATION_ACTIVE_TAB_INDEX,
  payload: index,
})

export const exportImageTranslation = (id) => (dispatch, getState) => {
  requestAgent
    .post(Api.imageTranslationExport.exportImageTranslation(), { image: id })
    .then((res) => {
      NotificationService.success("Recorded successfully");
      dispatch(setTranslationActiveTabIndex(1));
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Something went wrong");
    });
};

export const setTranslationExportsCurrentPage = (page) => ({
  type: actionTypes.SET_TRANSLATION_EXPORTS_CURRENT_PAGE,
  payload: page,
})

export const setTranslationExportsTotalPages = (pagesCount) => ({
  type: actionTypes.SET_TRANSLATION_EXPORTS_TOTAL_PAGES,
  payload: pagesCount,
})

const setImageTranslationExports = ts => ({
  type: actionTypes.SET_IMAGE_TRANSLATION_EXPORTS,
  payload: ts,
})

export const fetchImageTranslationExports = (id) => (dispatch, getState) => {
  const { translationExportsCurrentPage } = getState()[moduleName];
  requestAgent
    .get(Api.imageTranslationExport.get({ image: id, page: translationExportsCurrentPage }))
    .then((res) => {
      const { imageTranslationExports, pagesCount } = res.body;
      dispatch(setImageTranslationExports(imageTranslationExports));
      dispatch(setTranslationExportsTotalPages(pagesCount));
    })
    .catch((err) => {
      console.log(err);
      NotificationService.error("Something went wrong");
    });
};