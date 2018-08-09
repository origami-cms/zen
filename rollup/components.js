import deepmerge from 'deepmerge';
import path from 'path';
import DEFAULT_BUILD, {components, SRC_COMPONENTS} from './base';

export default components.map(c => deepmerge(DEFAULT_BUILD, {
    input: path.join(SRC_COMPONENTS, c, `${c}.ts`),
    output: {
        file: path.resolve('./components', c, `${c}.js`)
    }
}));
