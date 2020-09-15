import { IMAGE_EXTENSIONS, VIDEOS_EXTESION, GIF_EXTESIONS, APP_ENV } from '../constants';
import routes from '../routes';
import { isoLangs, supportedLangs } from '../constants/langs'
import { signLangsArray } from './langs';

export const getUrlMediaType = function (url) {
  const extension = url.split('.').pop().toLowerCase();
  if (IMAGE_EXTENSIONS.indexOf(extension) !== -1) return 'image';
  if (VIDEOS_EXTESION.indexOf(extension) !== -1) return 'video';
  if (GIF_EXTESIONS.indexOf(extension) !== -1) return 'gif';
  return false;
}


export const generateConvertStages = function generateConvertStages() {
  return [{
    title: 'Step 1: Transcribing Video',
    completed: false,
    active: false,
  },
  {
    title: 'Step 2: Proof Reading Script',
    completed: false,
    active: false,
  },
  {
    title: 'Step 3: Converting to a VideoWiki video',
    completed: false,
    active: false,
  }]
}

export function formatTime(milliseconds) {
  if (!milliseconds) return '00:00';
  let seconds = milliseconds / 1000;
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - (hours * 3600)) / 60);
  let millisecs = milliseconds % 1000;
  seconds = seconds - (hours * 3600) - (minutes * 60);
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  let time = minutes + ':' + seconds;
  return time.substr(0, 5);
}

export function isTimeFormatValid(formattedTime) {
  if (!formattedTime) return false;
  return !!formattedTime.match(/^[0-9]?[0-9]?\:[0-9]{0,2}?$/gi);
}

export function unformatTime(formattedTime) {
  let [ minutes, seconds ] = formattedTime.split(':');
  minutes = parseInt(minutes);
  seconds = parseFloat(seconds);
  const totalSeconds = minutes * 60 + seconds;
  const totalMilliseconds = totalSeconds * 1000
  return { minutes, seconds, totalSeconds, totalMilliseconds };
}



export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function canUserAccess(user, organization, requiredRoles) {
  const userRole = user.organizationRoles.find((r) => r.organization._id === organization._id)
  let canView = false;
  if (userRole && userRole.organizationOwner) {
    canView = true;
  } else if (userRole) {
    if (userRole && userRole.permissions.some(p => requiredRoles.indexOf(p) !== -1)) {
      canView = true;
    }
  }
  return canView;
}

export function getUserOrganziationRole(user, organization) {
  if (!user || !organization || !user.organizationRoles) return null;
  return user.organizationRoles.find((r) => r.organization._id === organization._id);
}


export function getSlideAndSubslideIndexFromPosition(slides, slidePosition, subslidePosition) {
  const slideIndex = slides.findIndex((s) => parseInt(s.position) === parseInt(slidePosition));
  if (slideIndex === -1) return { };
  const subslideIndex = slides[slideIndex].content.findIndex((s) => parseInt(s.position) === parseInt(subslidePosition));
  return { slideIndex, subslideIndex };
}


export function removeExtension(fileName) {
  let newFileName = fileName.split('.');
  newFileName.pop();
  return newFileName.join('.');
}

export function removeExtensionAndLowercase(fileName) {
  return removeExtension(fileName).toLowerCase()
}


export function matchVideosWithSubtitels(videos, subtitlesFiles) {
  if (videos.length === 0) return videos;
  if (subtitlesFiles.length === 0) return videos;

  // Remove subtitlesFiles
  const subtitlesFilesNames = subtitlesFiles.map((s) => removeExtensionAndLowercase(s.name));
  videos.filter(v => !v.subtitle).forEach((video) => {
      console.log('video', video)
      const videoName = removeExtensionAndLowercase(video.content.name);
      if (subtitlesFilesNames.indexOf(videoName) !== -1) {
          video.hasSubtitle = true;
          video.subtitle = subtitlesFiles[subtitlesFilesNames.indexOf(videoName)];
      }
  })

  return videos;
}


export function showMoreText(text, length) {
  return text.length > length ? `${text.substr(0, length)} ...` : text;
}

export function getUsersByRoles (users, organization, roles) {
  return !users || !Array.isArray(users) ? [] : users.filter((user) => {
      const orgRole = user.organizationRoles.find(r => r.organization === organization._id);
      if (!orgRole) return false;

      if (roles.indexOf('owner') !== -1 && orgRole.organizationOwner) return true;

      if (orgRole.permissions.some(perm => roles.indexOf(perm) !== -1)) return true;
      return false;
  })
}

export function getUserNamePreview(user) {
  if (!user) return '';
  return user && user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.email;
}
export function getTranslationArticleUrl(articleId)  {
  return routes.translationArticle(articleId);
}


export const redirectToSwitchOrganization = (token, organization, redirectTo = '') => {
  const { protocol } = window.location;
  let targetLocation = `${protocol}//${organization.name.replace(/\s/g, '-')}.${APP_ENV.FRONTEND_HOST_NAME}${routes.loginRedirect()}?t=${token}&o=${organization._id}`;
  if (redirectTo) {
      targetLocation += `&redirectTo=${redirectTo}`;
  }
  window.location.href = targetLocation;
}

export const displayLanguage = function(langCode) {
  let displayedLangName = '';
  if (langCode) {
    if (isoLangs[langCode] && isoLangs[langCode].name) {
      displayedLangName += isoLangs[langCode].name;
    } else if (supportedLangs.find(l => l.code === langCode)) {
      displayedLangName += supportedLangs.find(l => l.code === langCode).name
    }
  }

  return displayedLangName
}
export const displayArticleLanguage = function(article) {
  let displayedLangName = '';
  if (article.langCode) {
    if (isoLangs[article.langCode] && isoLangs[article.langCode].name) {
      displayedLangName += isoLangs[article.langCode].name;
    } else if (supportedLangs.find(l => l.code === article.langCode)) {
      displayedLangName += supportedLangs.find(l => l.code === article.langCode).name
    }
  }
  if (article.tts) {
    displayedLangName += ' < TTS >';
  }
  if (article.langName) {
    displayedLangName += ` < ${article.langName} >`
  }
  if (article.signLang && signLangsArray.find(l => l.code === article.langCode)) {
    displayedLangName += signLangsArray.find(l => l.code === article.langCode).name
  }

  return displayedLangName
}


export function reduceSlidesSubslides(slides) {
  return slides.reduce((acc, slide, slideIndex) => !slide.content || slide.content.length === 0 ? acc : acc.concat(slide.content.map(((subslide, subslideIndex) => ({ ...subslide, slidePosition: slide.position, subslidePosition: subslide.position, slideIndex, subslideIndex })))), [])
}

export function getSubslideIndex(slides, slidePosition, subslidePosition) {
  const subslides = reduceSlidesSubslides(slides);
  return subslides.findIndex((s) => s.slidePosition === slidePosition && s.position === subslidePosition);
}

export function getSpeakersTranslatorsMap(speakersProfile, translators, users) {
  if (!translators || !users) return {};
  const translatorsMap = {};
  const assignedSpeakers = translators.map(t => t.speakerNumber);
  speakersProfile.forEach(spk => {
      const translatorIndex = assignedSpeakers.indexOf(spk.speakerNumber);
      if (translatorIndex !== -1 && translators[translatorIndex]) {
          const assignedUser = users.find(u => u._id === translators[translatorIndex].user);
          if (assignedUser) {
              translatorsMap[spk.speakerNumber] = assignedUser;
          }
      }
  });
  return translatorsMap;
}

export function getUserName(user) {
  if (!user) return ''
  return user.firstname && user.lastname ? `${user.firstname} ${user.lastname} (${user.email})` : user.email;
}

export function generateWhatsappTranscribeLink(videoId) {
  return `https://wa.me/${APP_ENV.VIDEOWIKI_WHATSAPP_NUMBER}?text=${`hi breakvideo-${videoId}`}`;
}

export function generateWhatsappProofreadLink(videoId) {
  return `https://wa.me/${APP_ENV.VIDEOWIKI_WHATSAPP_NUMBER}?text=${`hi transcribevideo-${videoId}`}`;
}


export function generateWhatsappTranslateLink(videoId, langTo) {
  return `https://wa.me/${APP_ENV.VIDEOWIKI_WHATSAPP_NUMBER}?text=${`hi translatevideo-${videoId}-${langTo}`}`;
}

export function getWhatsappNotifyOnProofreadingReady(videoId) {
  return `https://wa.me/${APP_ENV.VIDEOWIKI_WHATSAPP_NUMBER}?text=${`hi notifyonproofreadingready-${videoId}`}`;
}