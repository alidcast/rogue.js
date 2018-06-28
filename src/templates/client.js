import { hydrateApp } from 'rogue'
<% if (loadables) { %>import { loadComponents } from 'loadable-components'<% } %>

import App from '<%= appPath %>'

<% if (loadables) { %>loadComponents().then(() =><% } %>
  hydrateApp(App)
<% if (loadables) { %>)<% } %>
