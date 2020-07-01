import React from 'react';
import { Pagination, Icon } from 'semantic-ui-react'
import './style.scss'
export default class ClearPagination extends React.Component {
    render() {
        const {
            activePage,
            onPageChange,
            totalPages,
        } = this.props;

        return (
            <Pagination
                activePage={activePage || 1}
                onPageChange={onPageChange}
                totalPages={totalPages || 1}
                firstItem={null}
                // id="videos-pagination"
                className='clear-pagination'
                lastItem={null}
                prevItem={{ content: <div><Icon name='angle left' /> Previous</div> }}
                nextItem={{ content: <div>Next <Icon name='angle right' /></div> }}
            />
        )
    }
}