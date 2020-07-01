// import env from '/assets/app_env.json';

export const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'svg', 'tif', 'tiff', 'webp', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd'];
export const VIDEOS_EXTESION = ['webm', 'mp4', 'ogg', 'ogv'];
export const GIF_EXTESIONS = ['gif'];
export const VIDEO_PLAYER_THUMBNAIL_IMAGE = 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/video-placeholder.jpg';
export const SPEAKER_BACKGROUND_COLORS = {
    [-1]: 'white',
    0: '#800080',
    1: 'blue',
    2: 'green',
    3: 'yellow',
    4: 'orange',
    5: '#4c4c4c',
    6: '#9a0000',
    7: 'purple',
    8: '#038284',
    9: '#3e3e71',
    10: '#6435c9',
}

export const SPEAKER_TEXT_COLORS = {
    [-1]: 'white',
    0: 'white',
    1: 'white',
    2: 'white',
    3: 'black',
    4: 'white',
    5: 'white',
    6: 'white',
    7: 'white',
    8: 'white',
    9: 'white',
    10: 'white',
}

export function populateAppEnv() {
    return new Promise((resolve, reject) => {
        fetch('/app_env.json')
            .then(response => response.json())
            .then(data => {
                resolve(data);
                // SET ENV VARIABLES ON APP_ENV
                try {
                    Object.keys(data).forEach(key => {
                        APP_ENV[key] = data[key];
                    })
                } catch (err) {
                    console.log(err);
                }
            })
            .catch(reject)
    })
}
export const USER_ROLES = [
    {
        name: 'Admin',
        value: 'admin',
        single: true,
    },
    {
        name: 'Project Leader',
        value: 'project_leader',
        single: true,
    },
    {
        name: 'Uploader',
        value: 'uploader'
    },
    {
        name: 'Transcribe',
        value: 'review',
        subroles: [
            {
                name: 'Break Videos',
                value: 'break_videos',
            },
            {
                name: 'Transcribing Text',
                value: 'transcribe_text',
            },
            {
                name: 'Transcribing Approver',
                value: 'approve_transcriptions',

            }
        ]
    },
    {
        name: 'Translation',
        value: 'translate',
        subroles: [
            {
                name: 'Translating Text',
                value: 'translate_text',
            },
            {
                name: 'Voice-over Artist',
                value: 'voice_over_artist',
            },
            {
                name: 'Translation Approver',
                value: 'approve_translations',

            }
        ]
    },
]
export const USER_ROLES_TITLE_MAP = USER_ROLES.reduce((acc, role) => {
    acc[role.value] = role.name;
    if (role.subroles) {
        role.subroles.forEach(subrole => {
            acc[subrole.value] = subrole.name;
        })
    }

    return acc;
}, {})

export const APP_ENV = {
    API_ROOT: '',
    VIDEOWIKI_WHATSAPP_NUMBER: '',
    WEBSOCKET_SERVER_URL: '',
    FRONTEND_HOST_NAME: '',
}
