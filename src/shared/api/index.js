import querystring from 'querystring';
import { API_ROOT } from '../constants';

export default {
    video: {
        uploadVideo: `${API_ROOT}/video/upload`,
        getVideoById: (id) => `${API_ROOT}/video/${id}`,
        updateVideoById: (id) => `${API_ROOT}/video/${id}`,
        deleteById: (id) => `${API_ROOT}/video/${id}`,
        convertVideo: (id) => `${API_ROOT}/video/${id}/convert`,
        getVideos: (params = {}) => `${API_ROOT}/video?${querystring.encode(params)}`,
        getVideosCount: (params = {}) => `${API_ROOT}/video/count?${querystring.encode(params)}`,
        getOrganizationVideos: (id) => `${API_ROOT}/video?organization=${id}`,
        transcribeVideo: id => `${API_ROOT}/video/${id}/transcribe`,
        skipTranscribe: id => `${API_ROOT}/video/${id}/transcribe/skip`,
        uploadBackgroundMusic: id => `${API_ROOT}/video/${id}/backgroundMusic`,
        deleteBackgroundMusic: id => `${API_ROOT}/video/${id}/backgroundMusic`,
        extractVideoBackgroundMusic: id => `${API_ROOT}/video/${id}/backgroundMusic/extract`,
        updateReviewers: id => `${API_ROOT}/video/${id}/reviewers`,
        updateVerifiers: id => `${API_ROOT}/video/${id}/verifiers`,
        refreshMedia: (id) => `${API_ROOT}/video/${id}/refreshMedia`,
    },
    noiseCancellationVideos: {
        getVideos: (params = {}) => `${API_ROOT}/noiseCancellationVideo?${querystring.encode(params)}`,
        uploadVideo: () => `${API_ROOT}/noiseCancellationVideo`,
    },
    article: {
        getById: id => `${API_ROOT}/article/${id}`,
        deleteById: id => `${API_ROOT}/article/${id}`,
        getbyVideoId: id => `${API_ROOT}/article/by_video_id?videoId=${id}`,
        updateSubslide: (articleId, slidePosition, subslidePosition) => `${API_ROOT}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}`,
        splitSubslide: (articleId, slidePosition, subslidePosition) => `${API_ROOT}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}/split`,
        addSubslide: (articleId, slidePosition, subslidePosition) => `${API_ROOT}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}`,
        deleteSubslide: (articleId, slidePosition, subslidePosition) => `${API_ROOT}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}`,
        updateSpeakers: (articleId) => `${API_ROOT}/article/${articleId}/speakersProfile`,
        updateToEnglish: (articleId) => `${API_ROOT}/article/${articleId}/toEnglish`,
        markVideoAsDone: (articleId) => `${API_ROOT}/article/${articleId}/reviewCompleted`,
        updateTranslators: (articleId) => `${API_ROOT}/article/${articleId}/translators`,
        updateTranslatorsFinishDate: (articleId) => `${API_ROOT}/article/${articleId}/translators/finishDate`,
        updateVerifiers: (articleId) => `${API_ROOT}/article/${articleId}/verifiers`,
        updateVolume: (articleId) => `${API_ROOT}/article/${articleId}/volume`,
        updateNormalizeAudio: (articleId) => `${API_ROOT}/article/${articleId}/normalizeAudio`,
        getTranslatedArticles: (params) => `${API_ROOT}/article/translations?${querystring.encode(params)}`,
        getUserTranslations: (params) => `${API_ROOT}/article/translations/by_user?${querystring.encode(params)}`,
        findAndReplaceText: (articleId) => `${API_ROOT}/article/${articleId}/text/replace`,

    },
    comments: {
        getCommentsByArticleId: (articleId, params) => `${API_ROOT}/article/${articleId}/comments?${querystring.encode(params)}`,
        addComment: () => `${API_ROOT}/comment`,
    },
    translate: {
        getTranslatableArticle: (articleId, params) => `${API_ROOT}/translate/${articleId}?${querystring.encode(params)}`,
        getTranslatableArticleBaseLanguages: (articleId) => `${API_ROOT}/translate/${articleId}/languages`,
        generateTranslatableArticle: (originalArticleId) => `${API_ROOT}/translate/${originalArticleId}`,
        addTranslatedText: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/text`,
        findAndReplaceText: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/text/replace`,
        addRecordedTranslation: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/audio`,
        addTTSTranslation: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/audio/tts`,
        updateAudioFromOriginal: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/audio/original`,
        deleteRecordedTranslation: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/audio`,
        updateVideoSpeed: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/videoSpeed`,
    },
    translationExport: {
        getByArticleId: (articleId, params) => `${API_ROOT}/translationExport/by_article_id/${articleId}?${querystring.encode(params)}`,
        generateAudioArchive: (translationExportId) => `${API_ROOT}/translationExport/${translationExportId}/audios/generateArchive`,
        generateSubtitledVideo: (translationExportId) => `${API_ROOT}/translationExport/${translationExportId}/video/burnSubtitles`,
        generateSubtitles: (translationExportId) => `${API_ROOT}/translationExport/${translationExportId}/video/subtitles`,
        requestExportTranslationReview: () => `${API_ROOT}/translationExport/requestExport`,
        approveExportTranslation: (id) => `${API_ROOT}/translationExport/${id}/approve`,
        declineeExportTranslation: (id) => `${API_ROOT}/translationExport/${id}/decline`,
        updateAudioSettings: (id) => `${API_ROOT}/translationExport/${id}/audioSettings`,
    },
    authentication: {
        login: `${API_ROOT}/auth/login`,
        refreshToken: `${API_ROOT}/auth/refreshToken`,
        register: `${API_ROOT}/auth/register`,
        resetPassword: `${API_ROOT}/auth/resetPassword`
    },
    organization: {
        getOrganizationById: (id) => `${API_ROOT}/organization/${id}`,
        createOrganization: () => `${API_ROOT}/organization`,
        updateLogo: (orgId) => `${API_ROOT}/organization/${orgId}/logo`,
        getUsers: (params) => `${API_ROOT}/user/getOrgUsers?${querystring.encode(params)}`,
        inviteUser: (organizationId) => `${API_ROOT}/organization/${organizationId}/users`,
        removeUser: (organizationId, userId) => `${API_ROOT}/organization/${organizationId}/users/${userId}`,
        editPermissions: (organizationId, userId) => `${API_ROOT}/organization/${organizationId}/users/${userId}/permissions`,
        respondToOrganizationInvitation: (organizationId) => `${API_ROOT}/organization/${organizationId}/invitations/respond`,
    },
    user: {
        isValidToken: `${API_ROOT}/user/isValidToken`,
        subscribeToApiDocs: () => `${API_ROOT}/user/subscribe_api_docs`,
        resetPassword: () => `${API_ROOT}/user/resetPassword`,
        getUserDetails: () => `${API_ROOT}/user/getUserDetails`,
        updatePassword: (userId) => `${API_ROOT}/user/${userId}/password`,
        updateShowUserGuiding: () => `${API_ROOT}/user/showUserGuiding`,
    },
    invitations: {
        respondToOrganizationInvitation: (organizationId) => `${API_ROOT}/invitations/organization/${organizationId}/invitations/respond`,
        respondToTranslationInvitation: (articleId) => `${API_ROOT}/invitations/article/${articleId}/translators/invitation/respond`
    },
    notification: {
        getNotifications: (params) => `${API_ROOT}/notification?${querystring.encode(params)}`,
        setNotificationsRead: (params) => `${API_ROOT}/notification/read?${querystring.encode(params)}`,
        getUnreadCount: (params) => `${API_ROOT}/notification/unread/count?${querystring.encode(params)}`
    },
    subtitles: {
        getById: id => `${API_ROOT}/subtitles/${id}`,
        getByArticleId: id => `${API_ROOT}/subtitles/by_article_id/${id}`,
        updateSubtitle: (id, subtitlePosition) => `${API_ROOT}/subtitles/${id}/subtitles/${subtitlePosition}`,
        activateSubtitle: (id) => `${API_ROOT}/subtitles/${id}/activated`,
        addSubtitle: (id) => `${API_ROOT}/subtitles/${id}/subtitles`,
        deleteSubtitle: (id, subtitlePosition) => `${API_ROOT}/subtitles/${id}/subtitles/${subtitlePosition}`,
        resetSubtitles: (id) => `${API_ROOT}/subtitles/${id}/reset`,
        splitSubtitle: (id, subtitlePosition) => `${API_ROOT}/subtitles/${id}/subtitles/${subtitlePosition}/split`,
        combineSubtitles: (id) => `${API_ROOT}/subtitles/${id}/subtitles/combine`,
    },
    apiKeys: {
        get: (params) => `${API_ROOT}/apikey?${querystring.encode(params)}`,
        create: () => `${API_ROOT}/apikey`,
        delete: (id) => `${API_ROOT}/apikey/${id}`,
        getUserOrganizationApiKey: (organizationId) => `${API_ROOT}/apiKey/userKey?organization=${organizationId}`
    },
    videoTutorialContribution: {
        uploadVideo: () => `${API_ROOT}/videoTutorialContribution`,
        getVideos: () => `${API_ROOT}/videoTutorialContribution`,
    }
}