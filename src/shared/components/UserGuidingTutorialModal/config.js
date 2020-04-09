
export const NUMBER_OF_STEPS = 6;

export const STAGES = [
    {
        title: 'Upload',
        activeRange: [1, 1]
    },
    {
        title: 'Transcribe',
        activeRange: [2, 3]
    },
    {
        title: 'Translate',
        activeRange: [4, 6]
    }
]

export const STEP_CONTENT = {
    1: {
        title: 'Upload your videos',
        description: 'Click the ‘Upload’ button to upload single or multiple videos.',
        image: '/img/onboarding/1/1.png',
    },
    2: {
        title: 'Transcribe videos through AI',
        description: 'Click on the ‘Transcribe’ button to auto-transcribe the video. Our AI will help transcribe your video with 90% accuracy if it’s in English or Hindi.',
        image: '/img/onboarding/2/2.png',
    },
    3: {
        title: 'Edit the AI transcript',
        description: 'Edit the transcription done by our AI as per your need and requirements.',
        image: '/img/onboarding/3/3.png',
    },
    4: {
        title: 'Translate videos in any Language',
        description: 'Click on the Add voiceover button to translate the video in your preffered language.',
        image: '/img/onboarding/4/4.png',
    },
    5: {
        title: 'Edit translated voiceover text',
        description: 'Edit the text you have translated for each slide of your video.',
        image: '/img/onboarding/5/5.png',
    },
    6: {
        title: 'Add voiceover to each slide',
        description: 'VideoWiki will apply machine learning to remove any background noise in your audio.',
        image: '/img/onboarding/6/6.png',
    }
}
