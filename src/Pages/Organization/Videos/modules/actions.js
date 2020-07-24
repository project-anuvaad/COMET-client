import { push } from 'connected-react-router';
import * as actionTypes from './types';
import Api from '../../../../shared/api';
import async from 'async';
import requestAgent from '../../../../shared/utils/requestAgent';
import NotificationService from '../../../../shared/utils/NotificationService';
import routes from '../../../../shared/routes';
import { setUploadVideoForm } from '../../../../actions/video';
import { signLangsArray } from '../../../../shared/utils/langs';
import * as utils from './utils';

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

export const setAddMultipleHumanVoiceModalVisible = visible => ({
    type: actionTypes.SET_ADD_MULTIPLE_HUMAN_VOICE_MODAL_VISIBLE,
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

export const setOpenedFolder = (openedFolder) => ({
    type: actionTypes.SET_OPENED_FOLDER,
    payload: openedFolder
})

export const setMainFolders = (folders) => ({
    type: actionTypes.SET_MAIN_FOLDERS,
    payload: folders
})

export const setMainFoldersLoading = (loading) =>({
    type: actionTypes.SET_MAIN_FOLDERS_LOADING,
    payload: loading
})

export const setMainFoldersCurrentPageNumber = (pageNumber) =>({
    type: actionTypes.SET_MAIN_FOLDERS_CURRENT_PAGE_NUMBER,
    payload: pageNumber
})

export const setMainFoldersTotalPagesCount = (pagesCount) =>({
    type: actionTypes.SET_MAIN_FOLDERS_TOTAL_PAGES_COUNT,
    payload: pagesCount
})

export const setBreadcrumbFolder = (folders) => ({
    type: actionTypes.SET_BREADCRUMB_FOLDER,
    payload: folders
})

export const setBreadcrumbLoading = (loading) =>({
    type: actionTypes.SET_BREADCRUMB_LOADING,
    payload: loading
})

export const setBreadcrumbCurrentPageNumber = (pageNumber) =>({
    type: actionTypes.SET_BREADCRUMB_CURRENT_PAGE_NUMBER,
    payload: pageNumber
})

export const setBreadcrumbTotalPagesCount = (pagesCount) =>({
    type: actionTypes.SET_BREADCRUMB_TOTAL_PAGES_COUNT,
    payload: pagesCount
})

export const setSubfolders = (folders) => ({
    type: actionTypes.SET_SUBFOLDERS,
    payload: folders
})

export const setSubfoldersLoading = (loading) => ({
    type: actionTypes.SET_SUBFOLDERS_LOADING,
    payload: loading
})

export const setSubfoldersTotalPagesCount = (pagesCount) => ({
    type: actionTypes.SET_SUBFOLDERS_TOTAL_PAGES_COUNT,
    payload: pagesCount
})

export const setMoveVideoMainFolders = (folders) => ({
    type: actionTypes.SET_MOVE_VIDEO_MAIN_FOLDERS,
    payload: folders
})

export const setMoveVideoOpenedFolder = (folder) => ({
    type: actionTypes.SET_MOVE_VIDEO_OPENED_FOLDER,
    payload: folder
})

export const setMoveVideoLoading = (loading) => ({
    type: actionTypes.SET_MOVE_VIDEO_LOADING,
    payload: loading
})

export const setMoveVideoCurrentPageNumber = (pageNumber) => ({
    type: actionTypes.SET_MOVE_VIDEO_CURRENT_PAGE_NUMBER,
    payload: pageNumber
})

export const setMoveVideoTotalPagesCount = (pagesCount) => ({
    type: actionTypes.SET_MOVE_VIDEO_TOTAL_PAGES_COUNT,
    payload: pagesCount
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
            dispatch(fetchTranslationsCount(videoId))
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
    const { currentPageNumber, searchFilter, openedFolder, totalPagesCount } = getState()[moduleName];
    const params = { organization: organization._id, page: currentPageNumber, search: searchFilter };
    if (openedFolder) params.folder = openedFolder;

    requestAgent
        .get(Api.article.getTranslatedArticles(params))
        .then((res) => {
            const { videos, pagesCount } = res.body;
            dispatch(setTranslatedArticles(videos));
            dispatch(setTotalPagesCount(pagesCount || 1));
            dispatch(setSelectedCount(0));
            cb()
            dispatch(setVideoLoading(false))
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
            cb();
        })
}

export const setTranslatedArticleStageFilter = stages => ({
    type: actionTypes.SET_SINGLE_TRANSLATED_ARTICLE_STAGE_FILTER,
    payload: stages,
})

export const setTranslatedArticleActiveTab = tab => ({
    type: actionTypes.SET_SINGLE_TRANSLATED_ARTICLE_ACTIVE_TAB,
    payload: tab,
})

export const fetchSigleTranslatedArticle = (videoId, { softLoad, cb } = {}) => (dispatch, getState) => {
    if (!cb) {
        cb = () => {};
    }
    if (!softLoad) {
        dispatch(setVideoLoading(true));
        dispatch(setSingleTranslatedArticle(null))
    }

    const { organization } = getState().organization;
    const { singleTranslatedArticleStageFilter } = getState()[moduleName];
    const query = {
        organization: organization._id,
        _id: videoId 
    }
    if (singleTranslatedArticleStageFilter && singleTranslatedArticleStageFilter.length > 0) {
        query.stage = singleTranslatedArticleStageFilter;
    }
    requestAgent
        .get(Api.article.getSingleTranslatedArticles(query))
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
const setTranslationsCount = (counts) => ({
    type: actionTypes.SET_TRANSLATIONS_COUNT,
    payload: counts
})
export const fetchTranslationsCount = (videoId) => (dispacth) => {
    requestAgent
        .get(Api.article.getTranslationsCount({ videoId }))
        .then((res) => {
            const counts = res.body;
            dispacth(setTranslationsCount(counts))
        })
        .catch((err) => {
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

export const updateTranslatorsV2 = (articleId, translators, textTranslators) => (dispatch, getState) => {
    console.log(translators, textTranslators);
    let updatedTranslators;
    let updatedTextTranslators;
    
    console.log(translators, textTranslators);
    requestAgent
        .put(Api.article.updateTranslators(articleId), { translators })
        .then((res) => {
            updatedTranslators = res.body.translators;
            
            return requestAgent.put(Api.article.updateTextTranslators(articleId), { textTranslators })
        })
        .then((res) => {
            updatedTextTranslators = res.body.textTranslators;
            const { singleTranslatedArticle } = getState()[moduleName];

            singleTranslatedArticle.articles.find((a) => a._id === articleId).translators = updatedTranslators.slice();
            singleTranslatedArticle.articles.find((a) => a._id === articleId).textTranslators = updatedTextTranslators.slice();

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

export const updateProjectLeaders = (articleId, projectLeaders) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    requestAgent
        .put(Api.article.updateProjectLeaders(articleId), { projectLeaders })
        .then((res) => {
            const { projectLeaders } = res.body;
            const { singleTranslatedArticle } = getState()[moduleName];
            singleTranslatedArticle.articles.find((a) => a._id === articleId).projectLeaders = projectLeaders.slice();

            dispatch(setSingleTranslatedArticle({ ...singleTranslatedArticle }))
            dispatch(setVideoLoading(false));
            NotificationService.success('Updated Successfully!');
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const updateVideoProjectLeaders = (videoId, projectLeaders) => (dispatch, getState) => {
    requestAgent
        .put(Api.video.updateProjectLeaders(videoId), { projectLeaders })
        .then((res) => {
            const { projectLeaders } = res.body;
            const { translatedArticles, singleTranslatedArticle } = getState()[moduleName];
            const translatedArticle = translatedArticles.find(a => a.video._id === videoId)
            if (translatedArticle) {
                translatedArticle.video.projectLeaders = projectLeaders;
                dispatch(setTranslatedArticles(translatedArticles.slice()))
            }
            if (singleTranslatedArticle && singleTranslatedArticle.video && singleTranslatedArticle.video._id === videoId) {
                singleTranslatedArticle.video.projectLeaders = projectLeaders;
                dispatch(setSingleTranslatedArticle({ ...singleTranslatedArticle }));
            }

            NotificationService.success('Updated Successfully!');
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const resendEmailToArticleVerifiers = (articleId, userId) => () => {
    requestAgent
        .post(Api.article.resendEmailToVerifier(articleId), { userId })
        .then(() => {
            NotificationService.success('Email sent successfully!');
        })
        .catch((err) => {
            NotificationService.responseError(err);
        })
}


export const updateVideoReviewers = (videoId, reviewers) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    requestAgent
        .put(Api.video.updateReviewers(videoId), { reviewers })
        .then((res) => {
            dispatch(setVideoLoading(false));
            NotificationService.success('Updated Successfully!');
            dispatch(fetchVideos());
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const updateVideosReviewers = (reviewers) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    const { videos } = getState()[moduleName];
    const updateVideosReviewersFuncArray = [];
    const selectedVideos = videos.filter(v => v.selected);

    selectedVideos.forEach(v => {
        updateVideosReviewersFuncArray.push(cb => {
            console.log('The video is ', v);
            
            requestAgent
                .put(Api.video.updateReviewers(v._id), { reviewers })
                .then(res => {
                    cb()
                })
                .catch(err => {
                    cb();
                })
        })        
    })

    async.series(updateVideosReviewersFuncArray, () => {
        dispatch(setVideoLoading(false));
        NotificationService.success('Updated Successfully!');
        dispatch(fetchVideos());
    })
}

export const updateVideoFolder = (videoId, folderId) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    requestAgent
        .put(Api.video.updateFolder(videoId), { folder: folderId })
        .then((res) => {
            dispatch(setVideoLoading(false));
            NotificationService.success('The video is moved successfully!');
            dispatch(fetchTranslatedArticles());
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false));
        })
}

export const updateVideosFolder = (folderId) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    const { translatedArticles } = getState()[moduleName];
    const selectedTranslatedArticles = translatedArticles.filter(
      (sta) => sta.video.selected
    );
    const updateVideosFolderFuncArray = [];
    
    selectedTranslatedArticles.forEach(article => {
        updateVideosFolderFuncArray.push(cb => {
            requestAgent
                .put(Api.video.updateFolder(article.video._id), { folder: folderId })
                .then((res) => {
                    cb();
                })
                .catch((err) => {
                    cb();
                    NotificationService.responseError(err);
                });
        });
    });

    async.series(updateVideosFolderFuncArray, () => {
        dispatch(setVideoLoading(false));
        NotificationService.success('The videos are moved successfully!');
        dispatch(fetchTranslatedArticles());
    })
}

export const resendEmailToVideoReviewer = (videoId, userId) => () => {
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
            dispatch(setVideoLoading(false));
            NotificationService.success('Updated Successfully!');
            dispatch(fetchVideos());
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const updateVideosVerifiers = (verifiers) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    const { videos } = getState()[moduleName];
    const updateVideosVerifiersFuncArray = [];
    const selectedVideos = videos.filter(v => v.selected);


    selectedVideos.forEach(v => {
        updateVideosVerifiersFuncArray.push(cb => {
            requestAgent
                .put(Api.video.updateVerifiers(v._id), { verifiers })
                .then(res => {
                    cb()
                })
                .catch(err => {
                    cb();
                })
        })        
    })


    async.series(updateVideosVerifiersFuncArray, () => {
        dispatch(setVideoLoading(false));
        NotificationService.success('Updated Successfully!');
        dispatch(fetchVideos());
    })
}

export const resendEmailToVideoVerifier = (videoId, userId) => () => {
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
                        dispatch(fetchTranslationsCount(singleTranslatedArticle.video._id))
                        dispatch(fetchSigleTranslatedArticle(singleTranslatedArticle.video._id, {softLoad: true, cb: () => {
                            // setTimeout(() => {
                            //     window.location.href = routes.translationArticle(createdArtcile._id)
                            // }, 1000);
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

export const generateTranslatableArticles = (videoId, originalArticleId, data, mode = 'single') => (dispatch, getState) => {
    const funcArray = []

    data.forEach(d => {
        funcArray.push(cb => {
            const langCode = d.language
            const langName = d.languageName
            const voiceTranslators = d.voiceTranslators
            const textTranslators = d.textTranslators
            const verifiers = d.verifiers

            utils.addHumanVoiceOver(originalArticleId, langCode, langName, voiceTranslators, textTranslators, verifiers)
                .then((createdArticle) => {
                    cb(null, createdArticle);
                })
                .catch((err) => {
                    cb();
                    console.log(err);
                    NotificationService.responseError(err);
                });
        });
    })

    async.series(funcArray, (err, createdArticles) => {
        dispatch(fetchTranslatedArticles({ softLoad: true, cb: () => {
            // Wait till the cached browser page reflects the current articles
                    const { singleTranslatedArticle } = getState()[moduleName];
                    if (singleTranslatedArticle) {
                        dispatch(fetchTranslationsCount(singleTranslatedArticle.video._id))
                        dispatch(fetchSigleTranslatedArticle(singleTranslatedArticle.video._id, {softLoad: true, cb: () => {
                            setTimeout(() => {
                            createdArticles = createdArticles.filter(a => a);
                                if (createdArticles.length > 1) {
                                    window.location.href = routes.organziationTranslationMetrics(videoId);
                                } else if (createdArticles.length > 0) {
                                    window.location.href = routes.translationArticle(createdArticles[0]._id);
                                } else {
                                    NotificationService.error('Something went wrong');
                                }
                            }, 1000);
                        }}))
                    } else {
                        setTimeout(() => {
                            createdArticles = createdArticles.filter(a => a);
                            if (createdArticles.length > 1) {
                                window.location.href = routes.organziationTranslationMetrics(videoId);
                            } else if (createdArticles.length > 0) {
                                window.location.href = routes.translationArticle(createdArticles[0]._id);
                            } else {
                                NotificationService.error('Something went wrong');
                            }
                        }, 1000);
                    }
        }}))
    })
}

export const submitMultipleLanguages = (codes) => (dispatch, getState) => {
    const { translatedArticles } = getState()[moduleName];
    const selectedTranslatedArticles = translatedArticles.filter(ta => ta.video.selected)
    const articlesFuncArray = []
    
    selectedTranslatedArticles.forEach(selectedTranslatedArticle => {
        articlesFuncArray.push(cb => {
            const langsFuncArray = []
            const existedCodes = selectedTranslatedArticle.articles.map(a => a.langCode)
            const filteredCodes = codes.filter(code => !existedCodes.includes(code))

            filteredCodes.forEach(filteredCode => {
                const params = {}
                const langCodeParts = filteredCode.split('-');
                if (langCodeParts.length === 1) {
                    if (signLangsArray.find(l => l.code === filteredCode)) {
                        params.signLang = true;
                    } 
                    params.lang = filteredCode;
                } else {
                    params.lang = langCodeParts[0];
                    if (langCodeParts[1] === 'tts') {
                        params.tts = true;
                    }
                }
                langsFuncArray.push(cb => {
                    requestAgent
                        .post(Api.translate.generateTranslatableArticle(selectedTranslatedArticle.originalArticle._id), params)
                        .then((res) => {cb()})
                        .catch(err => {
                            cb()
                            console.log(err);
                        })
                })
            })

            async.series(langsFuncArray, () => {
                cb()
            })
        })
    })

    async.series(articlesFuncArray, () => {
        window.location.href = routes.organziationTranslations();
    })
}

export const addUsersToMultipleVideos = (data) => (dispatch, getState) => {
    console.log('add to multiple videos', data)
    const { translatedArticles } = getState()[moduleName];
    const selectedTranslatedArticles = translatedArticles.filter(
      (sta) => sta.video.selected
    );
    let updateArticlesData = data
      .filter((d) => !d.new)
      .map((filtered) => ({ ...filtered, articlesToUpdate: [] }));
    let createNewArticlesData = data.filter((d) => d.new);
    updateArticlesData.forEach((d) => {
      selectedTranslatedArticles.forEach((sta) => {
        sta.articles.forEach((a) => {
        if (
            (d.language.split('-')[0] === a.langCode && d.tts === a.tts) ||
            (d.languageName && d.languageName === a.langName)
          ) {
            d.articlesToUpdate.push(a);
          }
        });
      });
    });
  
    let updateArticlesDataFuncArray = [];
    updateArticlesData.forEach((d) => {
      updateArticlesDataFuncArray.push((cb1) => {
        let articlesToUpdateFuncArray = [];
        d.articlesToUpdate.forEach((a) => {
          articlesToUpdateFuncArray.push((cb2) => {
            utils
              .updateTranslatedArticleUsers(
                a._id,
                [],
                d.textTranslators,
                d.verifiers
              )
              .then(() => {
                cb2();
              })
              .catch((err) => {
                cb2();
                console.log(err);
                NotificationService.responseError(err);
              });
          });
        });
  
        async
          .series(articlesToUpdateFuncArray)
          .then(() => {
            cb1();
          })
          .catch((err) => {
            cb1();
            console.log(err);
          });
      });
    });
  
    async
      .series(updateArticlesDataFuncArray)
      .then(() => {
        let selectedTranslatedArticlesFuncArray = [];
        selectedTranslatedArticles.forEach((a) => {
          selectedTranslatedArticlesFuncArray.push((cb3) => {
            const createNewArticlesDataFuncArray = [];
  
            createNewArticlesData.forEach((d) => {
              createNewArticlesDataFuncArray.push((cb4) => {
                const langCode = d.language;
                const langName = d.languageName;
                const textTranslators = d.textTranslators;
                const verifiers = d.verifiers;
  
                utils
                  .addHumanVoiceOver(
                    a.originalArticle._id,
                    langCode,
                    langName,
                    [],
                    textTranslators,
                    verifiers
                  )
                  .then(() => {
                    cb4();
                  })
                  .catch((err) => {
                    cb4();
                    console.log(err);
                    NotificationService.responseError(err);
                  });
              });
            });
  
            async
              .series(createNewArticlesDataFuncArray)
              .then(() => {
                cb3();
              })
              .catch((err) => {
                cb3();
                console.log(err);
              });
          });
        });
  
        async
          .series(selectedTranslatedArticlesFuncArray)
          .then(() => {
            window.location.href = routes.organziationTranslations();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
};  
  

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

export const setTranslatedArticleVideoSelected = (videoId, selected) => (dispatch, getState) => {
    const { translatedArticles } = getState()[moduleName];
    const translatedArticleIndex = translatedArticles.findIndex(ta => ta.video._id === videoId);
    if (translatedArticleIndex !== -1) {
        translatedArticles[translatedArticleIndex].video.selected = selected;
    }
    dispatch(setTranslatedArticles(translatedArticles.slice()));
    dispatch(setSelectedCount(translatedArticles.filter(ta => ta.video.selected).length));
}

export const setAllTranslatedArticleVideoSelected = (selected) => (dispatch, getState) => {
    const { translatedArticles } = getState()[moduleName];
    translatedArticles.forEach((ta) => {
        ta.video.selected = selected
    })
    dispatch(setTranslatedArticles(translatedArticles.slice()));
    if (selected) {
        dispatch(setSelectedCount(translatedArticles.length));
    } else {
        dispatch(setSelectedCount(0));
    }
}

export const exportMultipleVideos = (voiceVolume, normalizeAudio, downloadZip) => (dispatch, getState) => {
    const { translatedArticles } = getState()[moduleName];
    const selectedTranslatedArticles = translatedArticles.filter(
      (sta) => sta.video.selected
    );
    const ids = [];
    selectedTranslatedArticles.forEach(sta => {
        sta.articles.forEach(a => {
            ids.push(a._id);
        });
    });

    requestAgent
        .post(Api.translationExport.requestExportMultipleTranslationReview(), {articlesIds: ids, voiceVolume, normalizeAudio, downloadZip})
        .then((res) => {
            if (downloadZip) NotificationService.success("You'll receive an email with the download link shortly!");
            else NotificationService.success('The videos have been queued to be exported');
        })
        .catch(err => {
            NotificationService.responseError(err);
        });
}

export const createFolder = (name) => (dispatch, getState) => {
    const { openedFolder, mainFolders, subfolders } = getState()[moduleName];
    const parent = openedFolder ? openedFolder : null;
    requestAgent
        .post(Api.folder.createFolder(), { name, parent, organization: getState().organization.organization._id })
        .then((res) => {
            const { folder } = res.body;
            NotificationService.success('The folder is created successfully');
            if (openedFolder) {
                const folders = [...subfolders];
                folders.unshift(folder);
                dispatch(setSubfolders(folders)); 
                
            } else {
                const folders = [...mainFolders];
                folders.unshift(folder);
                dispatch(setMainFolders(folders)); 
            }
            
        })
        .catch((err) => {
            NotificationService.responseError(err);
        });
}

export const updateFolder = (name, folderId) => (dispatch, getState) => {
    const { openedFolder, mainFolders, subfolders, breadcrumbFolder } = getState()[moduleName];
    const id = folderId ? folderId : openedFolder;
    requestAgent
        .put(Api.folder.updateName(id), { name })
        .then((res) => {
            NotificationService.success('The folder is updated successfully');
            const { folder } = res.body;
            if (folderId) {
                const folders = [...subfolders];
                folders.find((f) => f._id === folder._id).name = folder.name;
                dispatch(setSubfolders(folders)); 
            } else {
                if (folder.parent) {
                    const bcf = {...breadcrumbFolder};
                    bcf.name = folder.name;
                    dispatch(setBreadcrumbFolder(bcf));
                } else {
                    const folders = [...mainFolders];
                    folders.find((f) => f._id === folder._id).name = folder.name;
                    dispatch(setMainFolders(folders)); 
                }
            }
        })
        .catch((err) => {
            NotificationService.responseError(err);
        });
}

export const fetchMainFolders = () => (dispatch, getState) => {
    dispatch(setMainFoldersLoading(true));

    const { organization } = getState().organization;

    requestAgent
        .get(Api.folder.getOrganizationMainFolders({ organization: organization._id, page: 1 }))
        .then((res) => {
            const { folders, pagesCount } = res.body;
            dispatch(setMainFolders(folders));
            dispatch(setMainFoldersCurrentPageNumber(1));
            dispatch(setMainFoldersTotalPagesCount(pagesCount || 1));
            dispatch(setMainFoldersLoading(false));
        })
        .catch((err) => {
            NotificationService.responseError(err);
        });
}

export const fetchSubfolders = () => (dispatch, getState) => {
    dispatch(setSubfoldersLoading(true));

    const { organization } = getState().organization;
    const { currentPageNumber, openedFolder } = getState()[moduleName];
    const params = { organization: organization._id, page: currentPageNumber };

    requestAgent
        .get(Api.folder.getSubfolders(openedFolder, params))
        .then((res) => {
            const { folders, pagesCount } = res.body;
            dispatch(setSubfolders(folders));
            dispatch(setSubfoldersTotalPagesCount(pagesCount || 1));
            dispatch(setSubfoldersLoading(false));
        })
        .catch((err) => {
            NotificationService.responseError(err);
        });
}

export const fetchBreadcrumbFolder = () => (dispatch, getState) => {
    dispatch(setBreadcrumbLoading(true));

    const { organization } = getState().organization;
    const { openedFolder } = getState()[moduleName];

    requestAgent
        .get(Api.folder.getBreadcrumbFolder(openedFolder, { organization: organization._id, page: 1 }))
        .then((res) => {
            const { folder, pagesCount } = res.body;
            dispatch(setBreadcrumbFolder(folder));
            dispatch(setBreadcrumbCurrentPageNumber(1));
            dispatch(setBreadcrumbTotalPagesCount(pagesCount || 1));
            dispatch(setBreadcrumbLoading(false));
        })
        .catch((err) => {
            NotificationService.responseError(err);
        });
}

export const loadMoreMainFolders = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    const { mainFoldersCurrentPageNumber } = getState()[moduleName];

    dispatch(setMainFoldersLoading(true))
    requestAgent
    .get(Api.folder.getOrganizationMainFolders({ organization: organization._id, page: mainFoldersCurrentPageNumber + 1 }))
    .then((res) => {
        const { folders: newFolders, pagesCount } = res.body;
        const { mainFolders } = getState()[moduleName];
        const finalMainFolders = mainFolders.concat(newFolders);
        dispatch(setMainFoldersCurrentPageNumber(mainFoldersCurrentPageNumber + 1))
        dispatch(setMainFolders(finalMainFolders))
        dispatch(setMainFoldersTotalPagesCount(pagesCount || 1))
        dispatch(setMainFoldersLoading(false))
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setMainFoldersLoading(false));
    })
}

export const loadMoreSiblingFolders = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    const { openedFolder, breadcrumbCurrentPageNumber } = getState()[moduleName];
    dispatch(setBreadcrumbLoading(true))
    requestAgent
    .get(Api.folder.getBreadcrumbFolder(openedFolder, { organization: organization._id, page: breadcrumbCurrentPageNumber + 1 }))
    .then((res) => {
        const { folder, pagesCount } = res.body;
        const { breadcrumbFolder } = getState()[moduleName];
        const oldBreadcrumbFolderCopy = JSON.parse(JSON.stringify(breadcrumbFolder));
        const oldSiblingsCopy = JSON.parse(JSON.stringify(oldBreadcrumbFolderCopy.siblings));
        const newSiblingsCopy = JSON.parse(JSON.stringify(folder.siblings));
        const finalSiblings = oldSiblingsCopy.concat(newSiblingsCopy);
        oldBreadcrumbFolderCopy.siblings = finalSiblings;
        dispatch(setBreadcrumbCurrentPageNumber(breadcrumbCurrentPageNumber + 1));
        dispatch(setBreadcrumbFolder(oldBreadcrumbFolderCopy));
        dispatch(setTotalPagesCount(pagesCount || 1));
        dispatch(setBreadcrumbLoading(false));
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setBreadcrumbLoading(false));
    })
}

export const fetchMoveVideoMainFolders = () => (dispatch, getState) => {
    dispatch(setMoveVideoLoading(true));

    const { organization } = getState().organization;

    requestAgent
        .get(Api.folder.getOrganizationMainFolders({ organization: organization._id, page: 1 }))
        .then((res) => {
            const { folders, pagesCount } = res.body;
            dispatch(setMoveVideoMainFolders(folders));
            dispatch(setMoveVideoCurrentPageNumber(1));
            dispatch(setMoveVideoTotalPagesCount(pagesCount || 1));
            dispatch(setMoveVideoLoading(false));
        })
        .catch((err) => {
            NotificationService.responseError(err);
        });
}

export const fetchMoveVideoOpenedFolder = (id) => (dispatch, getState) => {
    dispatch(setMoveVideoLoading(true));

    const { organization } = getState().organization;

    requestAgent
        .get(Api.folder.getMoveVideoOpenedFolder(id, { organization: organization._id, page: 1 }))
        .then((res) => {
            const { folder, pagesCount } = res.body;
            dispatch(setMoveVideoOpenedFolder(folder));
            dispatch(setMoveVideoCurrentPageNumber(1));
            dispatch(setMoveVideoTotalPagesCount(pagesCount || 1));
            dispatch(setMoveVideoLoading(false));
        })
        .catch((err) => {
            NotificationService.responseError(err);
        });
}

export const loadMoreMoveVideoFolders = () => (dispatch, getState) => {
    const { organization } = getState().organization;
    const { moveVideoMainFolders, moveVideoOpenedFolder, moveVideoCurrentPageNumber } = getState()[moduleName];

    dispatch(setMoveVideoLoading(true));

    if (!moveVideoOpenedFolder) {
        requestAgent
        .get(Api.folder.getOrganizationMainFolders({ organization: organization._id, page: moveVideoCurrentPageNumber + 1 }))
        .then((res) => {
            const { folders, pagesCount } = res.body;
            const finalFolders = moveVideoMainFolders.concat(folders);
            dispatch(setMoveVideoMainFolders(finalFolders));
            dispatch(setMoveVideoCurrentPageNumber(moveVideoCurrentPageNumber + 1));
            dispatch(setMoveVideoTotalPagesCount(pagesCount || 1));
            dispatch(setMoveVideoLoading(false));
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setMoveVideoLoading(false));
        });
    } else {
        requestAgent
        .get(Api.folder.getSubfolders(moveVideoOpenedFolder._id, { organization: organization._id, page: moveVideoCurrentPageNumber + 1 }))
        .then((res) => {
            const { folders, pagesCount } = res.body;
            const moveVideoOpenedFolderCopy = JSON.parse(JSON.stringify(moveVideoOpenedFolder));
            moveVideoOpenedFolderCopy.subfolders = moveVideoOpenedFolder.subfolders.concat(folders); 
            dispatch(setMoveVideoOpenedFolder(moveVideoOpenedFolderCopy));
            dispatch(setMoveVideoCurrentPageNumber(moveVideoCurrentPageNumber + 1));
            dispatch(setMoveVideoTotalPagesCount(pagesCount || 1));
            dispatch(setMoveVideoLoading(false));
        })
        .catch((err) => {
            NotificationService.responseError(err);
        });
    }
}