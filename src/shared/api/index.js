import querystring from "querystring";
import { APP_ENV } from "../constants";

export default {
  video: {
    uploadVideo: () => `${APP_ENV.API_ROOT}/video/upload`,
    getVideoById: (id) => `${APP_ENV.API_ROOT}/video/${id}`,
    updateVideoById: (id) => `${APP_ENV.API_ROOT}/video/${id}`,
    deleteById: (id) => `${APP_ENV.API_ROOT}/video/${id}`,
    convertVideo: (id) => `${APP_ENV.API_ROOT}/video/${id}/convert`,
    getVideos: (params = {}) =>
      `${APP_ENV.API_ROOT}/video?${querystring.encode(params)}`,
    getVideosCount: (params = {}) =>
      `${APP_ENV.API_ROOT}/video/count?${querystring.encode(params)}`,
    getOrganizationVideos: (id) =>
      `${APP_ENV.API_ROOT}/video?organization=${id}`,
    transcribeVideo: (id) => `${APP_ENV.API_ROOT}/video/${id}/transcribe`,
    skipTranscribe: (id) => `${APP_ENV.API_ROOT}/video/${id}/transcribe/skip`,
    uploadBackgroundMusic: (id) =>
      `${APP_ENV.API_ROOT}/video/${id}/backgroundMusic`,
    deleteBackgroundMusic: (id) =>
      `${APP_ENV.API_ROOT}/video/${id}/backgroundMusic`,
    extractVideoBackgroundMusic: (id) =>
      `${APP_ENV.API_ROOT}/video/${id}/backgroundMusic/extract`,
    updateReviewers: (id) => `${APP_ENV.API_ROOT}/video/${id}/reviewers`,
    resendEmailToReviewer: (id) =>
      `${APP_ENV.API_ROOT}/video/${id}/reviewers/resendEmail`,
    updateVerifiers: (id) => `${APP_ENV.API_ROOT}/video/${id}/verifiers`,
    resendEmailToVerifier: (id) =>
      `${APP_ENV.API_ROOT}/video/${id}/verifiers/resendEmail`,
    refreshMedia: (id) => `${APP_ENV.API_ROOT}/video/${id}/refreshMedia`,
    updateProjectLeaders: (videoId) =>
      `${APP_ENV.API_ROOT}/video/${videoId}/projectLeaders`,
    updateFolder: (id) => `${APP_ENV.API_ROOT}/video/${id}/folder`,
  },
  noiseCancellationVideos: {
    getVideos: (params = {}) =>
      `${APP_ENV.API_ROOT}/noiseCancellationVideo?${querystring.encode(
        params
      )}`,
    uploadVideo: () => `${APP_ENV.API_ROOT}/noiseCancellationVideo`,
  },
  image: {
    uploadImage: () => `${APP_ENV.API_ROOT}/image/upload`,
    getImages: (params = {}) =>
      `${APP_ENV.API_ROOT}/image?${querystring.encode(params)}`,
    getImagesTranslations: (params = {}) =>
      `${APP_ENV.API_ROOT}/image/translations?${querystring.encode(params)}`,
    getById: (id) => `${APP_ENV.API_ROOT}/image/${id}`,
    updateImageGroups: (id) => `${APP_ENV.API_ROOT}/image/${id}/groups`,
    updateImageById: (id) => `${APP_ENV.API_ROOT}/image/${id}`,
    updateImageStatus: (id) => `${APP_ENV.API_ROOT}/image/${id}/status`,
    translateImage: (id) => `${APP_ENV.API_ROOT}/image/${id}/translate`,
    getPixelColor: (id, params) =>
      `${APP_ENV.API_ROOT}/image/${id}/pixelColor?${querystring.encode(
        params
      )}`,
    getColors: (id, params) =>
      `${APP_ENV.API_ROOT}/image/${id}/colors?${querystring.encode(params)}`,
    getText: (id, params) =>
      `${APP_ENV.API_ROOT}/image/${id}/text?${querystring.encode(params)}`,
  },
  imageTranslationExport: {
    exportImageTranslation: () => `${APP_ENV.API_ROOT}/imageTranslationExport`,
    get: (params) =>
      `${APP_ENV.API_ROOT}/imageTranslationExport?${querystring.encode(
        params
      )}`,
  },
  article: {
    getById: (id) => `${APP_ENV.API_ROOT}/article/${id}`,
    deleteById: (id) => `${APP_ENV.API_ROOT}/article/${id}`,
    getbyVideoId: (id) =>
      `${APP_ENV.API_ROOT}/article/by_video_id?videoId=${id}`,
    updateSubslide: (articleId, slidePosition, subslidePosition) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}`,
    splitSubslide: (articleId, slidePosition, subslidePosition) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}/split`,
    addSubslide: (articleId, slidePosition, subslidePosition) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}`,
    deleteSubslide: (articleId, slidePosition, subslidePosition) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}`,
    updateSpeakers: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/speakersProfile`,
    updateToEnglish: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/toEnglish`,
    markVideoAsDone: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/reviewCompleted`,
    updateTranslatorsFinishDate: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/translators/finishDate`,
    updateTranslators: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/translators`,
    updateTextTranslators: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/textTranslators`,
    // resendEmailToTranslator: (articleId) => `${APP_ENV.API_ROOT}/article/${articleId}/translators/resendEmail`,
    updateVerifiers: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/verifiers`,
    updateProjectLeaders: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/projectLeaders`,
    resendEmailToVerifier: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/verifiers/resendEmail`,

    updateVolume: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/volume`,
    updateNormalizeAudio: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/normalizeAudio`,
    getTranslatedArticles: (params) =>
      `${APP_ENV.API_ROOT}/article/translations?${querystring.encode(params)}`,
    getSingleTranslatedArticles: (params) =>
      `${APP_ENV.API_ROOT}/article/translations/single?${querystring.encode(
        params
      )}`,
    getTranslationsCount: (params) =>
      `${APP_ENV.API_ROOT}/article/translations/count?${querystring.encode(
        params
      )}`,
    getUserTranslations: (params) =>
      `${APP_ENV.API_ROOT}/article/translations/by_user?${querystring.encode(
        params
      )}`,
    findAndReplaceText: (articleId) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/text/replace`,
  },
  comments: {
    getCommentsByArticleId: (articleId, params) =>
      `${APP_ENV.API_ROOT}/article/${articleId}/comments?${querystring.encode(
        params
      )}`,
    addComment: () => `${APP_ENV.API_ROOT}/comment`,
  },
  translate: {
    getTranslatableArticle: (articleId, params) =>
      `${APP_ENV.API_ROOT}/translate/${articleId}?${querystring.encode(
        params
      )}`,
    getTranslatableArticleBaseLanguages: (articleId) =>
      `${APP_ENV.API_ROOT}/translate/${articleId}/languages`,
    generateTranslatableArticle: (originalArticleId) =>
      `${APP_ENV.API_ROOT}/translate/${originalArticleId}`,
    addTranslatedText: (translateableArticleId) =>
      `${APP_ENV.API_ROOT}/translate/${translateableArticleId}/text`,
    findAndReplaceText: (translateableArticleId) =>
      `${APP_ENV.API_ROOT}/translate/${translateableArticleId}/text/replace`,
    addRecordedTranslation: (translateableArticleId) =>
      `${APP_ENV.API_ROOT}/translate/${translateableArticleId}/audio`,
    addTTSTranslation: (translateableArticleId) =>
      `${APP_ENV.API_ROOT}/translate/${translateableArticleId}/audio/tts`,
    updateAudioFromOriginal: (translateableArticleId) =>
      `${APP_ENV.API_ROOT}/translate/${translateableArticleId}/audio/original`,
    deleteRecordedTranslation: (translateableArticleId) =>
      `${APP_ENV.API_ROOT}/translate/${translateableArticleId}/audio`,
    updateVideoSpeed: (translateableArticleId) =>
      `${APP_ENV.API_ROOT}/translate/${translateableArticleId}/videoSpeed`,
  },
  translationExport: {
    getByArticleId: (articleId, params) =>
      `${
        APP_ENV.API_ROOT
      }/translationExport/by_article_id/${articleId}?${querystring.encode(
        params
      )}`,
    generateAudioArchive: (translationExportId) =>
      `${APP_ENV.API_ROOT}/translationExport/${translationExportId}/audios/generateArchive`,
    generateSubtitledVideo: (translationExportId) =>
      `${APP_ENV.API_ROOT}/translationExport/${translationExportId}/video/burnSubtitles`,
    generateSubtitles: (translationExportId) =>
      `${APP_ENV.API_ROOT}/translationExport/${translationExportId}/video/subtitles`,
    requestExportTranslationReview: () =>
      `${APP_ENV.API_ROOT}/translationExport/requestExport`,
    approveExportTranslation: (id) =>
      `${APP_ENV.API_ROOT}/translationExport/${id}/approve`,
    declineeExportTranslation: (id) =>
      `${APP_ENV.API_ROOT}/translationExport/${id}/decline`,
    updateAudioSettings: (id) =>
      `${APP_ENV.API_ROOT}/translationExport/${id}/audioSettings`,
    requestExportMultipleTranslationReview: () =>
      `${APP_ENV.API_ROOT}/translationExport/requestExportMultiple`,
  },
  authentication: {
    login: () => `${APP_ENV.API_ROOT}/auth/login`,
    refreshToken: () => `${APP_ENV.API_ROOT}/auth/refreshToken`,
    register: () => `${APP_ENV.API_ROOT}/auth/register`,
    resetPassword: () => `${APP_ENV.API_ROOT}/auth/resetPassword`,
  },
  organization: {
    getOrganizationById: (id) => `${APP_ENV.API_ROOT}/organization/${id}`,
    createOrganization: () => `${APP_ENV.API_ROOT}/organization`,
    updateLogo: (orgId) => `${APP_ENV.API_ROOT}/organization/${orgId}/logo`,
    getUsers: (params) =>
      `${APP_ENV.API_ROOT}/user/getOrgUsers?${querystring.encode(params)}`,
    getUsersCounts: (params) =>
      `${APP_ENV.API_ROOT}/user/count?${querystring.encode(params)}`,
    inviteUser: (organizationId) =>
      `${APP_ENV.API_ROOT}/organization/${organizationId}/users`,
    removeUser: (organizationId, userId) =>
      `${APP_ENV.API_ROOT}/organization/${organizationId}/users/${userId}`,
    editPermissions: (organizationId, userId) =>
      `${APP_ENV.API_ROOT}/organization/${organizationId}/users/${userId}/permissions`,
    respondToOrganizationInvitation: (organizationId) =>
      `${APP_ENV.API_ROOT}/organization/${organizationId}/invitations/respond`,
    respondToOrganizationInvitationAuth: (organizationId) =>
      `${APP_ENV.API_ROOT}/organization/${organizationId}/invitations/respondAuth`,
  },
  user: {
    searchUsers: (params) =>
      `${APP_ENV.API_ROOT}/user?${querystring.encode(params)}`,
    isValidToken: () => `${APP_ENV.API_ROOT}/user/isValidToken`,
    subscribeToApiDocs: () => `${APP_ENV.API_ROOT}/user/subscribe_api_docs`,
    resetPassword: () => `${APP_ENV.API_ROOT}/user/resetPassword`,
    getUserDetails: () => `${APP_ENV.API_ROOT}/user/getUserDetails`,
    getIsSuperUser: () => `${APP_ENV.API_ROOT}/user/isSuperUser`,
    updatePassword: (userId) => `${APP_ENV.API_ROOT}/user/${userId}/password`,
    updateShowUserGuiding: () => `${APP_ENV.API_ROOT}/user/showUserGuiding`,
  },
  invitations: {
    respondToOrganizationInvitation: (organizationId) =>
      `${APP_ENV.API_ROOT}/invitations/organization/${organizationId}/invitations/respond`,
    respondToTranslationInvitation: (articleId) =>
      `${APP_ENV.API_ROOT}/invitations/article/${articleId}/translators/invitation/respond`,
    respondToTextTranslationInvitation: (articleId) =>
      `${APP_ENV.API_ROOT}/invitations/article/${articleId}/textTranslators/invitation/respond`,
  },
  notification: {
    getNotifications: (params) =>
      `${APP_ENV.API_ROOT}/notification?${querystring.encode(params)}`,
    setNotificationsRead: (params) =>
      `${APP_ENV.API_ROOT}/notification/read?${querystring.encode(params)}`,
    getUnreadCount: (params) =>
      `${APP_ENV.API_ROOT}/notification/unread/count?${querystring.encode(
        params
      )}`,
  },
  subtitles: {
    getById: (id) => `${APP_ENV.API_ROOT}/subtitles/${id}`,
    getByArticleId: (id) => `${APP_ENV.API_ROOT}/subtitles/by_article_id/${id}`,
    updateSubtitle: (id, subtitlePosition) =>
      `${APP_ENV.API_ROOT}/subtitles/${id}/subtitles/${subtitlePosition}`,
    activateSubtitle: (id) => `${APP_ENV.API_ROOT}/subtitles/${id}/activated`,
    addSubtitle: (id) => `${APP_ENV.API_ROOT}/subtitles/${id}/subtitles`,
    deleteSubtitle: (id, subtitlePosition) =>
      `${APP_ENV.API_ROOT}/subtitles/${id}/subtitles/${subtitlePosition}`,
    resetSubtitles: (id) => `${APP_ENV.API_ROOT}/subtitles/${id}/reset`,
    splitSubtitle: (id, subtitlePosition) =>
      `${APP_ENV.API_ROOT}/subtitles/${id}/subtitles/${subtitlePosition}/split`,
    combineSubtitles: (id) =>
      `${APP_ENV.API_ROOT}/subtitles/${id}/subtitles/combine`,
  },
  apiKeys: {
    get: (params) => `${APP_ENV.API_ROOT}/apikey?${querystring.encode(params)}`,
    create: () => `${APP_ENV.API_ROOT}/apikey`,
    delete: (id) => `${APP_ENV.API_ROOT}/apikey/${id}`,
    getUserOrganizationApiKey: (organizationId) =>
      `${APP_ENV.API_ROOT}/apikey/userKey?organization=${organizationId}`,
  },
  videoTutorialContribution: {
    uploadVideo: () => `${APP_ENV.API_ROOT}/videoTutorialContribution`,
    getVideos: () => `${APP_ENV.API_ROOT}/videoTutorialContribution`,
  },
  folder: {
    createFolder: () => `${APP_ENV.API_ROOT}/folder`,
    updateName: (id) => `${APP_ENV.API_ROOT}/folder/${id}/name`,
    getBreadcrumbFolder: (folderId, params) =>
      `${APP_ENV.API_ROOT}/folder/${folderId}/breadcrumb/?${querystring.encode(
        params
      )}`,
    getOrganizationMainFolders: (params) =>
      `${APP_ENV.API_ROOT}/folder/mainFolders?${querystring.encode(params)}`,
    getSubfolders: (folderId, params) =>
      `${APP_ENV.API_ROOT}/folder/${folderId}/subfolders?${querystring.encode(
        params
      )}`,
    getMoveVideoOpenedFolder: (folderId, params) =>
      `${APP_ENV.API_ROOT}/folder/${folderId}/moveVideo?${querystring.encode(
        params
      )}`,
  },
};
