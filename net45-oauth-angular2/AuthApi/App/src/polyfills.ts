/**
 * Created by Fabian on 24/09/2016.
 */
import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');

if (process.env.ENV === 'production') {
     //Production
} else {

    require('zone.js/dist/long-stack-trace-zone');
    Error['stackTraceLimit'] = Infinity;
}