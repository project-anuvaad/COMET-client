import { combineReducers } from 'redux'
import poller from './poller';
import video from './video';
import image from './image';
import article from './article';
import authentication from './authentication';
import organization from './organization';
import notification from './notification';

import organizationVideos from '../Pages/Organization/Videos/modules/reducer';
// import translateArticle from '../Pages/Translation/TranslateArticle/modules/reducer';
import organizationArchive from '../Pages/Organization/Archive/modules/reducers';
import organizationTasks from '../Pages/Organization/Tasks/modules/reducers';
import invitations from '../Pages/Invitations/modules/reducer';
import noiseCancellationVideos from '../Pages/Organization/NoiseCancellation/modules/reducers';
import apiKeys from '../Pages/Organization/APIKeys/modules/reducers';
// import proofread from '../Pages/Convert/modules/reducers';

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    // state: (state = {}) => state,
    video,
    image,
    article,
    authentication,
    organization,
    poller,
    organizationVideos,
    organizationArchive,
    invitations,
    organizationTasks,
    notification,
    noiseCancellationVideos,
    apiKeys,
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}
