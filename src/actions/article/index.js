import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import { SPEAKER_BACKGROUND_COLORS, SPEAKER_TEXT_COLORS } from '../../shared/constants';
import NotificationService from '../../shared/utils/NotificationService';
import { getSlideAndSubslideIndexFromPosition } from '../../shared/utils/helpers';

function formatSubslideToSubtitle(subslide) {
    return ({ ...subslide, startTime: subslide.startTime * 1000, endTime: subslide.endTime * 1000, text: subslide.text, speakerNumber: subslide.speakerProfile.speakerNumber, backgroundColor: SPEAKER_BACKGROUND_COLORS[subslide.speakerProfile.speakerNumber], color: SPEAKER_TEXT_COLORS[subslide.speakerProfile.speakerNumber] })
}

function generateSubtitlesFromSlides(slides) {
    let speakersIndexesMap = {};
    slides.reduce((acc, s) => acc.concat(s.content), []).map(s => s.speakerProfile).filter(s => s).forEach((s) => {
        speakersIndexesMap[s.speakerNumber] = 0;
    })
    return slides.
        reduce((acc, slide, slideIndex) => acc.concat(slide.content.map((s, subslideIndex) => ({ ...s, index: s.speakerProfile && typeof s.speakerProfile.speakerNumber === 'number' ? speakersIndexesMap[s.speakerProfile.speakerNumber] ++ : null,  slidePosition: slide.position, subslidePosition: s.position, slideIndex, subslideIndex }))), [])
        .filter((s) => !s.silent)
        .map(formatSubslideToSubtitle);
}

const fetchArticleLoading = () => ({
    type: actionTypes.FETCH_ARTICLE_LOADING,
})

const setArticle = article => ({
    type: actionTypes.SET_ARTICLE,
    payload: article,
})

const fetchArticleSuccess = article => ({
    type: actionTypes.FETCH_ARTICLE_SUCCESS,
    payload: article,
})

const fetchArticleFailed = (err) => ({
    type: actionTypes.FETCH_ARTICLE_FAILED,
    payload: err,
})

const updateSubslideLoading = () => ({
    type: actionTypes.UPDATE_SUBSLIDE_LOADING,
})

const updateSubslideSuccess = (updatedArticle) => ({
    type: actionTypes.UPDATE_SUBSLIDE_SUCCESS,
    payload: updatedArticle
})

const updateSubslideFailed = (err) => ({
    type: actionTypes.UPDATE_SUBSLIDE_FAILED,
    payload: err,
})

export const reset = () => ({
    type: actionTypes.RESET,
})

export const setToEnglish = toEnglish => ({
    type: actionTypes.SET_TO_ENGLISH,
    payload: toEnglish,
})

export const setNameSlides = nameSlides => ({
    type: actionTypes.SET_NAME_SLIDES,
    payload: nameSlides,
})

export const setSubtitles = (subtitles) => ({
    type: actionTypes.SET_SUBTITLES,
    payload: [...subtitles],
})

export const setSelectedSubtitle = (subtitle, subtitleIndex) => ({
    type: actionTypes.SET_SELECTED_SUBTITLE,
    payload: {
        subtitle,
        subtitleIndex
    }
})

export const setSlidesToSubtitles = (slides) => (dispatch, getState) => {
    const subtitles = generateSubtitlesFromSlides(slides);
    dispatch(setSubtitles(subtitles));
    const { selectedSubtitle } = getState().article;
    if (selectedSubtitle && selectedSubtitle.subtitle) {
        const subtitleIndex = subtitles.findIndex((s) => s.slidePosition === selectedSubtitle.subtitle.slidePosition && s.subslidePosition === selectedSubtitle.subtitle.subslidePosition);
        if (subtitleIndex !== -1) {
            dispatch(setSelectedSubtitle(subtitles[subtitleIndex], subtitleIndex));
        }
    }
}

export const fetchArticleById = id => dispatch => {
    dispatch(fetchArticleLoading());
    requestAgent
        .get(Api.article.getById(id))
        .then((res) => {
            console.log('res', res.body)
            const { article } = res.body;
            dispatch(fetchArticleSuccess(article));
        })
        .catch(err => {
            console.log(err)
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.error(reason)
            dispatch(fetchArticleFailed(reason));
        })
}

export const fetchArticleByVideoId = videoId => dispatch => {
    dispatch(fetchArticleLoading());
    requestAgent
        .get(Api.article.getbyVideoId(videoId))
        .then((res) => {
            const article = res.body;
            dispatch(fetchArticleSuccess(article));
        })
        .catch(err => {
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.error(reason)
            dispatch(fetchArticleFailed(reason));
        })
}

export const deleteSubslide = (slidePosition, subslidePosition) => (dispatch, getState) => {
    dispatch(updateSubslideLoading());
    const article = { ...getState().article.article };
    requestAgent
        .delete(Api.article.deleteSubslide(article._id, slidePosition, subslidePosition))
        .then((res) => {
            const { article } = res.body;
            dispatch(setSlidesToSubtitles(article.slides));
            dispatch(updateSubslideSuccess(article));
            dispatch(setSelectedSubtitle(null, null));
        })
        .catch(err => {
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.responseError(err)
            dispatch(updateSubslideFailed(reason));
        })
}

export const updateSubslide = (slidePosition, subslidePosition, changes) => (dispatch, getState) => {
    dispatch(updateSubslideLoading());
    const article = { ...getState().article.article };
    const { selectedSubtitle } = getState().article;
    const { slideIndex, subslideIndex } = getSlideAndSubslideIndexFromPosition(article.slides, slidePosition, subslidePosition);
    requestAgent
        .patch(Api.article.updateSubslide(article._id, slidePosition, subslidePosition), changes)
        .then((res) => {
            // const article = res.body;
            Object.keys(res.body.changes).forEach(key => {
                article.slides[slideIndex].content[subslideIndex][key] = res.body.changes[key];
                if (selectedSubtitle && selectedSubtitle.subtitle && selectedSubtitle.subtitle.slideIndex === slideIndex && selectedSubtitle.subtitle.subslideIndex === subslideIndex) {
                    selectedSubtitle.subtitle[key] = res.body.changes[key];
                }
            })
            if (selectedSubtitle && selectedSubtitle.subtitle && selectedSubtitle.subtitle.slideIndex === slideIndex && selectedSubtitle.subtitle.subslideIndex === subslideIndex) {
                dispatch(setSelectedSubtitle({ ...selectedSubtitle.subtitle }, selectedSubtitle.subtitleIndex));
            }
            dispatch(setSlidesToSubtitles(article.slides));
            dispatch(updateSubslideSuccess(article));

        })
        .catch(err => {
            console.log(err);
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.responseError(err)

            if (selectedSubtitle && selectedSubtitle.subtitle && selectedSubtitle.subtitle.slideIndex === slideIndex && selectedSubtitle.subtitle.subslideIndex === subslideIndex) {
                dispatch(setSelectedSubtitle({ ...selectedSubtitle.subtitle }, selectedSubtitle.subtitleIndex));
            }
            dispatch(setSlidesToSubtitles(article.slides));
            dispatch(updateSubslideFailed(reason));
        })
}

export const splitSubslide = (slidePosition, subslidePosition, wordIndex, time) => (dispatch, getState) => {
    dispatch(updateSubslideLoading());
    const article = { ...getState().article.article };
    requestAgent
    .post(Api.article.splitSubslide(article._id, slidePosition, subslidePosition), { wordIndex, time })
    .then((res) => {
        const { article } = res.body;
        dispatch(updateSubslideSuccess(article));
        dispatch(setArticle(article));
        dispatch(setSlidesToSubtitles(article.slides));
        dispatch(setSelectedSubtitle(null, null));

    })
    .catch(err => {

        const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
        NotificationService.responseError(err)
        dispatch(updateSubslideFailed(reason));
    })

}

export const addSubslide = (subslide) => (dispatch, getState) => {
    const article = { ...getState().article.article };
    const { slidePosition, subslidePosition } = subslide;
    requestAgent
        .post(Api.article.addSubslide(article._id, slidePosition, subslidePosition), subslide)
        .then((res) => {
            const { article } = res.body;
            dispatch(updateSubslideSuccess(article));
            dispatch(setSlidesToSubtitles(article.slides));

        })
        .catch(err => {
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.responseError(err);
            dispatch(updateSubslideFailed(reason));
        })
}

export const updateSpeakers = speakersProfile => (dispatch, getState) => {
    const article = { ...getState().article.article };
    requestAgent
        .put(Api.article.updateSpeakers(article._id), { speakersProfile })
        .then((res) => {
            article.speakersProfile = speakersProfile;
            dispatch(setArticle(article));
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const updateToEnglish = (toEnglish) => (dispatch, getState) => {
    const article = { ...getState().article.article };
    requestAgent
        .put(Api.article.updateToEnglish(article._id), { toEnglish })
        .then((res) => {
            article.toEnglish = toEnglish;
            dispatch(setArticle(article));
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const markVideoAsDone = (videoId, articleId) => (dispatch, getState) => {
    requestAgent
        .put(Api.article.markVideoAsDone(articleId), { reviewCompleted: true })
        .then((res) => {
            const article = { ...getState().article.article };
            article.reviewCompleted = true;
            NotificationService.success('Marked as done successfully');
            dispatch(setArticle(article));
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}



export const refreshArticleMedia = (videoId, articleId) => (dispatch, getState) => {
    const article = { ...getState().article.article };
    requestAgent
        .post(Api.video.refreshMedia(videoId), { articleId })
        .then((res) => {
            article.refreshing = true;
            dispatch(setArticle(article));
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const findAndReplaceText = (find, replace) => (dispatch, getState) => {
    const article = { ...getState().article.article };

    requestAgent
        .post(Api.article.findAndReplaceText(article._id), { find, replace })
        .then((res) => {
            dispatch(fetchArticleByVideoId(article.video))
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}