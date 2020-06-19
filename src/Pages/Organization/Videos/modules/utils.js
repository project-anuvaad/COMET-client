import Api from "../../../../shared/api";
import requestAgent from "../../../../shared/utils/requestAgent";
import NotificationService from "../../../../shared/utils/NotificationService";
import { signLangsArray } from "../../../../shared/utils/langs";

export const addHumanVoiceOver = (
  originalArticleId,
  langCode,
  langName,
  voiceTranslators,
  textTranslators,
  verifiers
) => {
  return new Promise((resolve, reject) => {
    let createdArticle;
    const params = getLangParams(langCode, langName);
    requestAgent
      .post(
        Api.translate.generateTranslatableArticle(originalArticleId),
        params
      )
      .then((res) => {
        const { article } = res.body;
        createdArticle = article;
        return updateTranslatedArticleUsers(
          article._id,
          voiceTranslators,
          textTranslators,
          verifiers
        );
      })
      .then(() => {
        return resolve(createdArticle);
      })
      .catch(reject);
  });
};

export const updateTranslatedArticleUsers = (
  translatedArticleId,
  voiceTranslators,
  textTranslators,
  verifiers
) => {
  return new Promise((resolve, reject) => {
    // Update voice translators if any
    return new Promise((resolve, reject) => {
      if (!voiceTranslators || voiceTranslators.length === 0) {
        return resolve();
      }
      requestAgent
        .put(Api.article.updateTranslators(translatedArticleId), {
          translators: voiceTranslators,
        })
        .then((res) => {
          return resolve();
        })
        .catch((err) => {
          NotificationService.responseError(err);
          return resolve();
        });
    })
      .then((res) => {
        // Update text translators if any
        return new Promise((resolve, reject) => {
          if (!textTranslators || textTranslators.length === 0) {
            return resolve();
          }
          requestAgent
            .put(Api.article.updateTextTranslators(translatedArticleId), {
              textTranslators,
            })
            .then((res) => {
              return resolve();
            })
            .catch((err) => {
              NotificationService.responseError(err);
              return resolve();
            });
        });
      })
      .then(() => {
        // Update verifiers if any
        return new Promise((resolve) => {
          if (!verifiers || verifiers.length === 0) {
            return resolve();
          }
          requestAgent
            .put(Api.article.updateVerifiers(translatedArticleId), {
              verifiers,
            })
            .then((res) => {
              return resolve();
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

export const getLangParams = (langCode, langName) => {
  const params = {};
  if (langCode) {
    const langCodeParts = langCode.split("-");
    if (langCodeParts.length === 1) {
      // Check to see if it's sign language
      if (signLangsArray.find((l) => l.code === langCode)) {
        params.signLang = true;
      }
      params.lang = langCode;
    } else {
      params.lang = langCodeParts[0];
      if (langCodeParts[1] === "tts") {
        params.tts = true;
      }
    }
  }
  if (langName) {
    params.langName = langName;
  }
  return params;
};
