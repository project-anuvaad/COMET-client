import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { showMoreText } from '../../utils/helpers';

export default class ShowMore extends React.Component {
    render() {
        const { text, length } = this.props;
        if (text.length <= length ) {
            return (
                <span>{text}</span>
            )
        }
        return (
            <Popup content={text} trigger={<span>{showMoreText(text, length)}</span>} />
        )
    }
}

ShowMore.propTypes = {
    text: PropTypes.string,
    length: PropTypes.number,
}