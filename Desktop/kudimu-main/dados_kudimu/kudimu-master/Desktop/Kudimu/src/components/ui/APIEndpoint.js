import React from 'react';
import PropTypes from 'prop-types';
import { Card } from './index';

/**
 * APIEndpoint - Card para documentar endpoint da API
 */
const APIEndpoint = ({ method, path, description, params = [] }) => {
  const methodColors = {
    GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    POST: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <Card className="p-6 mb-4">
      <div className="flex items-start gap-4">
        {/* Method Badge */}
        <span
          className={`px-3 py-1 rounded-lg text-xs font-bold ${methodColors[method] || methodColors.GET}`}
        >
          {method}
        </span>

        {/* Endpoint Details */}
        <div className="flex-1">
          <code className="text-sm font-mono text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
            {path}
          </code>
          
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{description}</p>
          )}

          {/* Parameters */}
          {params.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-semibold mb-2">Parâmetros:</h5>
              <ul className="space-y-2">
                {params.map((param, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                      {param.name}
                    </code>
                    <span className="text-gray-600 dark:text-gray-400">{param.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

APIEndpoint.propTypes = {
  method: PropTypes.oneOf(['GET', 'POST', 'PUT', 'DELETE']).isRequired,
  path: PropTypes.string.isRequired,
  description: PropTypes.string,
  params: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ),
};

export default APIEndpoint;
