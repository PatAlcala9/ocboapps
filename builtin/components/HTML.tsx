import { type Element, Show } from 'solid-js'
import background1 from '../../images/background.avif'
import background2 from '../../images/background.webp'
import site from 'configs/site.config.mts'
import { HydrationScript } from '@solidjs/web'

interface Props {
  children: Element
  preloadBackground?: boolean
}

export default (props: Props) => {
  return (
    <html lang='en'>
      <head>
        <base href='/' />
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='name' content={site.website.name} />
        <meta name='description' content={site.website.description} />
        <meta name='title' property='og:title' content={site.website.name} />
        <meta name='keywords' content='HTML, CSS, JavaScript' />
        <meta name='developer' content={site.website.developer} />
        <meta name='designer' content={site.website.designer} />
        <meta property='og:description' content={site.website.description} />
        <meta property='og:type' content='website' />
        <link rel='icon' type='image/png' href='/favicon.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <Show when={site.font.local === false}>
          <link rel='preconnect' href='https://cdn.jsdelivr.net' />
        </Show>
        <Show when={props.preloadBackground}>
          <link rel='preload' href={background1} as='image' type='image/svg+xml' />
          <link rel='preload' href={background2} as='image' type='image/svg+xml' />
        </Show>
        <HydrationScript />
      </head>

      <body>
        <div id='app'>{props.children}</div>
      </body>
    </html>
  )
}
