import React from 'react';
import Helmet from 'react-helmet';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { VioletDataTable, VioletPaginator } from 'violet-paginator';
//  VioletPaginator is a react-redux package allowing users to manage arbitrarily many filtered, paginated lists of records. https://github.com/sslotsky/violet-paginator
//  https://www.npmjs.com/package/violet-paginator
import './violet.min.scss';
import './Pagination.scss';

function paginate(list, page, pageSize) {
  return list.skip((page - 1) * pageSize).take(pageSize);
}
//  Jumps to the order of item in the list based on which page is clicked and then pageSize determines how many should be on the page. Still don't know how "skip" and "take" are in javaScript.

function order(list, sort, sortOrder) {
  if (sort) {
    const sorted = list.sortBy(item => item[sort]);
    //  sortBy(item => item[sort]) is a sorting function
    if (sortOrder === 'desc') {
      return sorted.reverse();
    }

    return sorted;
  }

  return list;
}
//  This function just makes sure that the list is returned but in case there is some instruction on ascending or descing, it takes care of it.


function mockFetch({ query: { pageSize, page, sort, sortOrder } }) {
//   mockFetch function is saved in the redux store
//  Ideally, the list should be a seperate component
  const records = List([{
    country: 'United States',
    gdp: '18,561.934'
  }, {
    country: 'China',
    gdp: '11,391.619'
  }, {
    country: 'Japan',
    gdp: '4,730.300'
  }, {
    country: 'Germany',
    gdp: '3,494.898'
  }, {
    country: 'United Kingdom',
    gdp: '2,649.893'
  }, {
    country: 'France',
    gdp: '2,488.284'
  }, {
    country: 'India',
    gdp: '2,250.987'
  }, {
    country: 'Italy',
    gdp: '1,852.499'
  }]);
//  records is the list that gets saved as part of filtered and then gets passed to "order" function.
  const filtered = paginate(
    order(records, sort, sortOrder),
    page,
    pageSize
  );
//  the const filtered is just saving the results of the Paginate function with only the relevant section the list

  return () => Promise.resolve({
    data: {
      results: filtered.toJS(),
      total_count: records.count()
    }
  });
}


// Paginatin is the main function to export
export function Pagination({ fetch }) {
//  The fetch function that you supply to the paginator is an action creator that returns a promise.
  const headers = [{
    field: 'country',
    text: 'Country'
  }, {
    field: 'gdp',
    text: 'GDP (billions of $)'
  }];

  const config = {
    fetch,
    listId: 'recipes',
    //  now sure why the listId needs to be "recipes"
    pageSize: 4
  };
//  pageSize is mentioned under config
  return (
    <section style={{ width: '60%' }}>
      <h1>Pagination</h1>
      <Helmet title="Pagination" />

      <VioletPaginator {...config} />
    {/*  3 props are being sent to ViolentPagination: fetch function, listId and pageSize */}
      <VioletDataTable
        {...config}
        headers={headers}
      />
    </section>
  );
}

export default connect(
  undefined,
  { fetch: mockFetch }
)(Pagination);
