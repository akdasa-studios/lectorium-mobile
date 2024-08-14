import { FluentBundle, FluentResource } from '@fluent/bundle'

import common from './common.ftl?raw'

export const bundle = new FluentBundle('ru')
bundle.addResource(new FluentResource(common))