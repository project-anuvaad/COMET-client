import querystring from 'querystring';

export default {
    home: () => '/',
    faq: () => '/faq',
    api: () => '/api',
    loginRedirect: () => '/lr',
    resetPassword: () => '/rp',
    logout: () => '/logout',
    demo: () => '/demo',
    convertProgress: (videoId = ':videoId') => `/convert/${videoId}`,
    convertProgressV2: (videoId) => `/convert${videoId ? `?video=${videoId}` : ''}`,
    
    // Organization
    organizationHome: () => '/organization',
    organizationFAQs: () => '/organization/faq',
    organizationUsers: () => '/organization/users',
    organizationAPIKeys: () => '/organization/apikeys',
    organizationTips: () => '/organization/tips',
    noiseCancellation: () => '/organization/noisecancellation',
    organizationVideos: () => '/organization/videos',
    organizationImages: () => '/organization/images',
    organizationArticle: (articleId = ':articleId') => `/organization/article/${articleId}`,
    organizationArchive: () => `/organization/archive`,

    organziationReview: () => `/organization/videos/review`,
    organziationTranslations: (params) => `/organization/videos/translations${params ? `?${querystring.encode(params)}` : ''}`,

    organizationImageAnnotation: () => '/organization/images/annotations',
    organizationImageTranslation: () => '/organization/images/translations',
    
    // organizationTasks: () => '/organization/tasks',
    organziationTasksReview: () => `/organization/tasks/review`,
    organziationTasksTranslations: () => `/organization/tasks/translations`,
    
    organziationTranslationMetrics: (videoId = ':videoId') => `/organization/videos/translations/${videoId}`,
    // Translation
    translationArticle: (articleId = ':articleId', langCode) => `/translation/article/${articleId}${langCode ? `?lang=${langCode}` : ''}`,

    translationInvitation: () => `/invitations/translate`,
    textTranslationInvitation: () => `/invitations/translateText`,
    invitationsRoute: (organizationId = ':organizationId') => `/invitations/${organizationId}`,

    annotateImage: (imageId) => `/annotate${imageId ? `?image=${imageId}` : ''}`,
    translateImage: (imageId) => `/organization/images/translations/${imageId}`,
}