import { FluentBundle, FluentResource } from '@fluent/bundle'

import common from './common.ftl?raw'
import playlist from './playlist.ftl?raw'
import library from './library.ftl?raw'

export const bundle = new FluentBundle('ru')
bundle.addResource(new FluentResource(common))
bundle.addResource(new FluentResource(playlist))
bundle.addResource(new FluentResource(library))
