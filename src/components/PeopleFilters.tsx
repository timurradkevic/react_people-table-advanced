import classNames from 'classnames';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

type Param = string | number;
type Params = {
  [key: string]: Param[] | Param | null;
};

export function getSearchWith(
  params: Params,
  search?: string | URLSearchParams,
) {
  const newParams = new URLSearchParams(search);

  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.delete(key);
      value.forEach(item => newParams.append(key, item.toString()));
    } else {
      newParams.set(key, value.toString());
    }
  }

  return newParams.toString();
}

type Props = {
  query: string;
  centuries: string[];
  sex: string;
};

export const PeopleFilters: React.FC<Props> = ({ query, centuries, sex }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  function setSearchWith(params: Params) {
    const search = getSearchWith(params, searchParams);

    setSearchParams(search);
  }

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchWith({ query: event.target.value || null });
  }

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <Link
          className={classNames({
            'is-active': sex === '',
          })}
          to={{ search: getSearchWith({ sex: null }, searchParams) }}
        >
          All
        </Link>
        <Link
          className={classNames({
            'is-active': sex === 'm',
          })}
          to={{ search: getSearchWith({ sex: 'm' }, searchParams) }}
        >
          Male
        </Link>
        <Link
          className={classNames({
            'is-active': sex === 'f',
          })}
          to={{ search: getSearchWith({ sex: 'f' }, searchParams) }}
        >
          Female
        </Link>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={query}
            onChange={handleQueryChange}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {[16, 17, 18, 19, 20].map(century => (
              <Link
                key={century}
                data-cy="century"
                className={classNames('button mr-1', {
                  'is-info': centuries.includes(String(century)),
                })}
                to={{
                  search: getSearchWith(
                    {
                      centuries: centuries.includes(String(century))
                        ? centuries.filter(cent => String(century) !== cent)
                        : [...centuries, century],
                    },
                    searchParams,
                  ),
                }}
              >
                {century}
              </Link>
            ))}
          </div>

          <div className="level-right ml-4">
            <Link
              data-cy="centuryALL"
              className={classNames('button is-success', {
                'is-outlined': centuries.length !== 0,
              })}
              to={{ search: getSearchWith({ centuries: null }, searchParams) }}
            >
              All
            </Link>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <Link
          className="button is-link is-outlined is-fullwidth"
          to={{
            search: getSearchWith(
              { centuries: null, sex: null, query: null },
              searchParams,
            ),
          }}
        >
          Reset all filters
        </Link>
      </div>
    </nav>
  );
};
