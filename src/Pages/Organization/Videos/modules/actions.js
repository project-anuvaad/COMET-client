import { push } from 'connected-react-router';
import * as actionTypes from './types';
import Api from '../../../../shared/api';
import async from 'async';
import requestAgent from '../../../../shared/utils/requestAgent';
import NotificationService from '../../../../shared/utils/NotificationService';
import routes from '../../../../shared/routes';
import { setUploadVideoForm } from '../../../../actions/video';
import { signLangsArray } from '../../../../shared/utils/langs';

const moduleName = 'organizationVideos';

export const setVideoStatusFilter = filter => ({
    type: actionTypes.SET_VIDEO_STATUS_FILTER,
    payload: filter,
})

export const setCurrentPageNumber = pageNumber => ({
    type: actionTypes.SET_CURRENT_PAGE_NUMBER,
    payload: pageNumber,
})

export const setTotalPagesCount = pagesCount => ({
    type: actionTypes.SET_TOTAL_PAGES_COUNT,
    payload: pagesCount,
})

export const setActiveTabIndex = index => ({
    type: actionTypes.SET_ACTIVE_TAB_INDEX,
    payload: index,
})

export const setLanguageFilter = lang => ({
    type: actionTypes.SET_LANGUAGE_FILTER,
    payload: lang,
})

export const setSearchFilter = searchFilter => ({
    type: actionTypes.SET_VIDEO_SEARCH_FILTER,
    payload: searchFilter,
})

export const setVideoLoading = loading => ({
    type: actionTypes.SET_VIDEO_LOADING,
    payload: loading
})

export const setVideos = videos => ({
    type: actionTypes.SET_VIDEOS,
    payload: videos,
})

export const setSelectedVideo = video => ({
    type: actionTypes.SET_SELECTED_VIDEO,
    payload: video,
})

export const setAddHumanVoiceModalVisible = visible => ({
    type: actionTypes.SET_ADD_HUMAN_VOICE_MODAL_VISIBLE,
    payload: visible,
})

export const setTranslateOnWhatsappActive = active => ({
    type: actionTypes.SET_TRANSLATE_ON_WHATSAPP_ACTIVE,
    payload: active,
})

export const setTranslatedArticles = translatedArticles => ({
    type: actionTypes.SET_TRANSLATED_ARTICLES,
    payload: translatedArticles,
})

export const setSingleTranslatedArticle = (translatedArticle) => ({
    type: actionTypes.SET_SINGLE_TRANSLATED_ARTICLE,
    payload: translatedArticle,
})

export const updateLocalVideo = (videoId, newVideo) => (dispatch, getState) => {
    const { videos } = getState()[moduleName];
    const videoIndex = videos.findIndex((v) => v._id === videoId);
    if (videoIndex !== -1) {
        videos[videoIndex] = newVideo;
        dispatch(setVideos(videos));
    }
}

export const fetchVideos = () => (dispatch, getState) => {
    // const { }
    dispatch(setVideos([]))
    const { videoStatusFilter, currentPageNumber, languageFilter, searchFilter } = getState()[moduleName];
    const { organization } = getState().organization;
    dispatch(setVideoLoading(true));
    requestAgent
        .get(Api.video.getVideos({ organization: organization._id, langCode: languageFilter, status: videoStatusFilter, page: currentPageNumber, search: searchFilter }))
        .then((res) => {
            const { videos, pagesCount } = res.body;
            dispatch(setVideos(videos));
            dispatch(setVideoLoading(false))
            dispatch(setTotalPagesCount(pagesCount || 1));
            dispatch(setSelectedCount(0));
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

const setVideosCounts = counts => ({
    type: actionTypes.SET_VIDEOS_COUNTS,
    payload: counts,
})

export const fetchVideosCount = (organizationId) => (dispatch, getState) => {
    const { organization } = getState().organization;
    requestAgent
        .get(Api.video.getVideosCount({ organization: organization._id }))
        .then((res) => {
            dispatch(setVideosCounts(res.body))
        })
        .catch((err) => {
            NotificationService.responseError(err);
        })
}

export const deleteVideo = (videoId) => (dispatch) => {
    dispatch(setVideoLoading(true));
    requestAgent
        .delete(Api.video.deleteById(videoId))
        .then(res => {
            dispatch(setVideoLoading(false));
            NotificationService.success('Deleted successfully!');
            dispatch(fetchVideos());
            dispatch(fetchVideosCount())
        })
        .catch(err => {
            dispatch(setVideoLoading(false));
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const deleteSelectedVideos = () => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    const { videos } = getState()[moduleName];
    const deleteVidFuncArray = [];
    const selectedVideos = videos.filter(v => v.selected);
    selectedVideos.forEach(v => {
        deleteVidFuncArray.push(cb => {
            requestAgent
            .delete(Api.video.deleteById(v._id))
            .then(res => {
                cb()
            })
            .catch(err => {
                cb();
            })
        })        
    })

    async.series(deleteVidFuncArray, () => {
        dispatch(setVideoLoading(false));
        NotificationService.success(`${selectedVideos.length} Video${selectedVideos.length > 1 ? 's' : ''} deleted`);
        dispatch(fetchVideos());
        dispatch(fetchVideosCount())
    })
}

export const updateVideo = (videoId, changes) => (dispatch) => {
    dispatch(setVideoLoading(true));
    const req = requestAgent
        .patch(Api.video.updateVideoById(videoId));
    Object.keys(changes).forEach(key => {
        if (typeof changes[key] === 'object') {
            req.attach(key, changes[key])
        } else {
            req.field(key, changes[key]);
        }
    })

    req.then(res => {
        dispatch(setVideoLoading(false));
        NotificationService.success('Updated successfully!');
        dispatch(fetchVideos());
        dispatch(fetchVideosCount())
    })
        .catch(err => {
            dispatch(setVideoLoading(false));
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const deleteArticle = (articleId, videoId) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    dispatch(setTranslatedArticles([]))
    requestAgent
        .delete(Api.article.deleteById(articleId))
        .then((res) => {
            NotificationService.success('Deleted succesfully')
            dispatch(fetchTranslatedArticles());
            dispatch(fetchSigleTranslatedArticle(videoId))
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const fetchTranslatedArticles = ({ softLoad, cb} = {}) => (dispatch, getState) => {
    if (!softLoad) {
        dispatch(setVideoLoading(true));
        dispatch(setTranslatedArticles([]))
    }
    if (!cb) {
        cb = () => {};
    }

    const { organization } = getState().organization;
    const { currentPageNumber, searchFilter } = getState()[moduleName];

    requestAgent
        .get(Api.article.getTranslatedArticles({ organization: organization._id, page: currentPageNumber, search: searchFilter }))
        .then((res) => {
            const { videos, pagesCount } = res.body;
            dispatch(setTranslatedArticles(videos));
            dispatch(setTotalPagesCount(pagesCount || 1));
            cb()
            dispatch(setVideoLoading(false))
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
            cb();
        })
}

export const fetchSigleTranslatedArticle = (videoId, { softLoad, cb } = {}) => (dispatch, getState) => {
    if (!cb) {
        cb = () => {};
    }
    if (!softLoad) {
        dispatch(setVideoLoading(true));
        dispatch(setSingleTranslatedArticle(null))
    }

    const { organization } = getState().organization;

    requestAgent
        .get(Api.article.getTranslatedArticles({ organization: organization._id, _id: videoId }))
        .then((res) => {
            const { videos } = res.body;
            dispatch(setSingleTranslatedArticle(videos[0]))
            cb();
            dispatch(setVideoLoading(false))
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
            cb()
        })
}

export const transcribeVideo = video => (dispatch, getState) => {
    const { organization } = getState().organization;
    dispatch(setVideoLoading(true));
    requestAgent
        .post(Api.video.transcribeVideo(video._id), { organization: organization._id })
        .then((res) => {
            console.log(res);
            dispatch(setVideoLoading(false));
            const { success, queued } = res.body;
            if (queued) {
                dispatch(fetchVideos())
                dispatch(fetchVideosCount())
                if (video._id === 'all') {
                    NotificationService.success('Your videos are being worked on by the AI!');
                } else {
                    NotificationService.success('Your video is being worked on by the AI!');
                }
            } else {
                window.location.href = routes.convertProgressV2(video._id) 
                // dispatch(push());
            }
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const transcribeSelectedVideos = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    const { videos } = getState()[moduleName];
    dispatch(setVideoLoading(true));
    const trancribeFuncArray = [];
    videos.filter(v => v.selected).forEach((video) => {
        trancribeFuncArray.push(cb => {
            requestAgent
                .post(Api.video.transcribeVideo(video._id), { organization: organization._id })
                .then((res) => {
                    cb();
                })
                .catch((err) => {
                    cb();
                })
        })
    })

    async.series(trancribeFuncArray, () => {
        NotificationService.success('Videos have been queued successfully!');
        dispatch(setVideoLoading(false));
        dispatch(fetchVideos());        
    })

}

export const skipTranscribe = (video, cuttingBy) => (dispatch, getState) => {
    const { organization } = getState().organization;
    dispatch(setVideoLoading(true));
    requestAgent
        .post(Api.video.skipTranscribe(video._id), { organization: organization._id, cuttingBy })
        .then((res) => {
            if (cuttingBy === 'self') {
                window.location.href = routes.convertProgressV2(video._id); 
            } else {
                NotificationService.success('Videowiki\'s team will get it done shortly!')
                dispatch(fetchVideos())
            }
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const uploadBackgroundMusic = (videoId, blob) => (dispatch, getState) => {
    const { organization } = getState().organization;
    dispatch(setVideoLoading(true));

    requestAgent
        .patch(Api.video.uploadBackgroundMusic(videoId))
        .field('organization', organization._id)
        .attach('file', blob)
        .then((res) => {
            const { video } = res.body;
            const { singleTranslatedArticle } = getState()[moduleName];
            dispatch(setSingleTranslatedArticle({ ...singleTranslatedArticle, video }))
            dispatch(setVideoLoading(false));
            NotificationService.success('Uploaded Successfully');
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}



export const deleteVideoBackgroundMusic = (videoId) => (dispatch, getState) => {
    requestAgent
        .delete(Api.video.deleteBackgroundMusic(videoId))
        .then((res) => {
            const { video } = res.body;
            const { singleTranslatedArticle } = getState()[moduleName];
            dispatch(setSingleTranslatedArticle({ ...singleTranslatedArticle, video }))
            dispatch(setVideoLoading(false));
            NotificationService.success('Deleted Successfully');
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const extractVideoBackgroundMusic = videoId => (dispatch, getState) => {
    requestAgent
        .post(Api.video.extractVideoBackgroundMusic(videoId))
        .then((res) => {
            const { video } = res.body;
            const { singleTranslatedArticle } = getState()[moduleName];
            dispatch(setSingleTranslatedArticle({ ...singleTranslatedArticle, video }))

            dispatch(setVideoLoading(false));
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const updateTranslators = (articleId, translators) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    requestAgent
        .put(Api.article.updateTranslators(articleId), { translators })
        .then((res) => {
            const { translators } = res.body;
            const { singleTranslatedArticle } = getState()[moduleName];
            singleTranslatedArticle.articles.find((a) => a._id === articleId).translators = translators.slice();

            dispatch(setSingleTranslatedArticle({ ...singleTranslatedArticle }))
            dispatch(setVideoLoading(false));
            NotificationService.success('Updated Successfully!');
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}


export const updateVerifiers = (articleId, verifiers) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    console.log('verifier', verifiers)
    requestAgent
        .put(Api.article.updateVerifiers(articleId), { verifiers })
        .then((res) => {
            const { verifiers } = res.body;
            const { singleTranslatedArticle } = getState()[moduleName];
            singleTranslatedArticle.articles.find((a) => a._id === articleId).verifiers = verifiers.slice();

            dispatch(setSingleTranslatedArticle({ ...singleTranslatedArticle }))
            dispatch(setVideoLoading(false));
            NotificationService.success('Updated Successfully!');
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const updateVideoReviewers = (videoId, reviewers) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    requestAgent
        .put(Api.video.updateReviewers(videoId), { reviewers })
        .then((res) => {
            const { reviewers } = res.body;
            const { videos } = getState()[moduleName];
            videos.find((v) => v._id === videoId).reviewers = reviewers.slice();
            dispatch(setVideos(videos.slice()));
            dispatch(setVideoLoading(false));
            NotificationService.success('Updated Successfully!');
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const resendEmailToReviewer = (videoId, userId) => () => {
    requestAgent
        .post(Api.video.resendEmailToReviewer(videoId), { userId })
        .then(() => {
            NotificationService.success('Email sent successfully!');
        })
        .catch((err) => {
            NotificationService.responseError(err);
        })
}

export const updateVideoVerifiers = (videoId, verifiers) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    requestAgent
        .put(Api.video.updateVerifiers(videoId), { verifiers })
        .then((res) => {
            const { verifiers } = res.body;
            const { videos } = getState()[moduleName];
            videos.find((v) => v._id === videoId).verifiers = verifiers.slice();
            dispatch(setVideos(videos.slice()));
            dispatch(setVideoLoading(false));
            NotificationService.success('Updated Successfully!');
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const resendEmailToVerifier = (videoId, userId) => () => {
    requestAgent
        .post(Api.video.resendEmailToVerifier(videoId), { userId })
        .then(() => {
            NotificationService.success('Email sent successfully!');
        })
        .catch((err) => {
            NotificationService.responseError(err);
        })
}


export const generateTranslatableArticle = (originalArticleId, langCode, langName, translators = [], verifiers = [], mode = 'single') => (dispatch, getState) => {
    const params = {}

    if (langCode) {
        const langCodeParts = langCode.split('-');
        if (langCodeParts.length === 1) {
            // Check to see if it's sign language
            if (signLangsArray.find(l => l.code === langCode)) {
                params.signLang = true;
            } 
            params.lang = langCode;
        } else {
            params.lang = langCodeParts[0];
            if (langCodeParts[1] === 'tts') {
                params.tts = true;
            }
        }
    }
    if (langName) {
        params.langName = langName;
    }
    let createdArtcile;
    requestAgent
        .post(Api.translate.generateTranslatableArticle(originalArticleId), params)
        .then((res) => {
            const { article } = res.body;
            createdArtcile = article;
            // Update translators if any
            return new Promise((resolve, reject) => {

                if (!translators || translators.length === 0) {
                    return resolve();
                }
                requestAgent
                    .put(Api.article.updateTranslators(article._id), { translators })
                    .then((res) => {
                        return resolve();
                    })
                    .catch((err) => {
                        NotificationService.responseError(err);
                        return resolve();
                    })
            })
        })
        .then(() => {
            // Update verifiers if any
            return new Promise((resolve) => {
                if (!verifiers || verifiers.length === 0) {
                    return resolve();
                }
                requestAgent
                    .put(Api.article.updateVerifiers(createdArtcile._id), { verifiers })
                    .then((res) => {
                        return resolve();
                    })
                    .catch((err) => {
                        console.log('error updating verifiers', err);
                        return resolve();
                    })
            })
        })
        .then(() => {
            if (createdArtcile) {
                if (mode === 'multi') {
                    dispatch(fetchTranslatedArticles({ softLoad: true, cb: () => {
                        window.location.href = routes.translationArticle(createdArtcile._id)
                    }}))
                } else {
                    const { singleTranslatedArticle } = getState()[moduleName];
                    if (singleTranslatedArticle) {
                        dispatch(fetchSigleTranslatedArticle(singleTranslatedArticle.video._id, {softLoad: true, cb: () => {
                            window.location.href = routes.translationArticle(createdArtcile._id)
                        }}))
                    } else {
                        window.location.href = routes.translationArticle(createdArtcile._id)
                    }
                }
            }
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const setSelectedCount = count => ({
    type: actionTypes.SET_SELECTED_COUNT,
    payload: count,
})

export const setVideoSelected = (videoId, selected) => (dispatch, getState) => {
    const { videos } = getState()[moduleName];
    const videoIndex = videos.findIndex(v => v._id === videoId);
    if (videoIndex !== -1) {
        videos[videoIndex].selected = selected;
    }
    dispatch(setVideos(videos.slice()));
    dispatch(setSelectedCount(videos.filter(v => v.selected).length));
}
export const setAllVideoSelected = (selected) => (dispatch, getState) => {
    const { videos } = getState()[moduleName];
    videos.forEach((video) => {
        video.selected = selected
    })
    dispatch(setVideos(videos.slice()));
    if (selected) {
        dispatch(setSelectedCount(videos.length));
    } else {
        dispatch(setSelectedCount(0));
    }
}
