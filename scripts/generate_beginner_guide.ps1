$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

# -------------------- XML helpers -------------------------------------------
function Esc([string]$s) {
  if ($null -eq $s) { return '' }
  return $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;')
}

$BRAND = '0F4C75'
$SOFT  = '555C66'
$CODEBG = 'F4F4EE'
$CALLOUTBG = 'E7F1F7'
$HEADBG = '0F4C75'

function MakeRun([string]$text, [hashtable]$opts = @{}) {
  $rPr = ''
  if ($opts.Bold)   { $rPr += '<w:b/>' }
  if ($opts.Italic) { $rPr += '<w:i/>' }
  if ($opts.Size)   { $rPr += "<w:sz w:val=`"$($opts.Size)`"/>" }
  if ($opts.Color)  { $rPr += "<w:color w:val=`"$($opts.Color)`"/>" }
  if ($opts.Font)   {
    $rPr += "<w:rFonts w:ascii=`"$($opts.Font)`" w:hAnsi=`"$($opts.Font)`" w:cs=`"$($opts.Font)`"/>"
  }
  $rPrXml = if ($rPr) { "<w:rPr>$rPr</w:rPr>" } else { '' }
  return "<w:r>$rPrXml<w:t xml:space=`"preserve`">$(Esc $text)</w:t></w:r>"
}

function Para([string]$text, [hashtable]$opts = @{}) {
  $align = ''
  if ($opts.Align) { $align = "<w:jc w:val=`"$($opts.Align)`"/>" }
  $spacing = '<w:spacing w:after="120"/>'
  return "<w:p><w:pPr>$spacing$align</w:pPr>$(MakeRun $text $opts)</w:p>"
}

function Heading([string]$text, [int]$level) {
  $size = switch ($level) { 1 {40} 2 {32} 3 {26} default {22} }
  $spacing = '<w:spacing w:before="240" w:after="120"/>'
  $rPr = "<w:b/><w:sz w:val=`"$size`"/><w:color w:val=`"$BRAND`"/>"
  return "<w:p><w:pPr>$spacing</w:pPr><w:r><w:rPr>$rPr</w:rPr><w:t xml:space=`"preserve`">$(Esc $text)</w:t></w:r></w:p>"
}

function Title([string]$text) {
  $rPr = "<w:b/><w:sz w:val=`"60`"/><w:color w:val=`"$BRAND`"/>"
  return "<w:p><w:pPr><w:jc w:val=`"center`"/><w:spacing w:before=`"480`" w:after=`"120`"/></w:pPr><w:r><w:rPr>$rPr</w:rPr><w:t xml:space=`"preserve`">$(Esc $text)</w:t></w:r></w:p>"
}

function Subtitle([string]$text) {
  $rPr = "<w:sz w:val=`"40`"/><w:color w:val=`"$SOFT`"/>"
  return "<w:p><w:pPr><w:jc w:val=`"center`"/><w:spacing w:after=`"120`"/></w:pPr><w:r><w:rPr>$rPr</w:rPr><w:t xml:space=`"preserve`">$(Esc $text)</w:t></w:r></w:p>"
}

function Tagline([string]$text) {
  $rPr = "<w:i/><w:sz w:val=`"24`"/><w:color w:val=`"$SOFT`"/>"
  return "<w:p><w:pPr><w:jc w:val=`"center`"/><w:spacing w:after=`"360`"/></w:pPr><w:r><w:rPr>$rPr</w:rPr><w:t xml:space=`"preserve`">$(Esc $text)</w:t></w:r></w:p>"
}

function Bullet([string]$text) {
  $pPr = '<w:pPr><w:ind w:left="360" w:hanging="220"/><w:spacing w:after="60"/></w:pPr>'
  $bullet = '<w:r><w:rPr><w:rFonts w:ascii="Segoe UI Symbol" w:hAnsi="Segoe UI Symbol"/></w:rPr><w:t xml:space="preserve">&#8226;   </w:t></w:r>'
  $body = "<w:r><w:t xml:space=`"preserve`">$(Esc $text)</w:t></w:r>"
  return "<w:p>$pPr$bullet$body</w:p>"
}

$script:NumberCounter = 0
function ResetNum { $script:NumberCounter = 0 }
function NumItem([string]$text) {
  $script:NumberCounter++
  $pPr = '<w:pPr><w:ind w:left="480" w:hanging="340"/><w:spacing w:after="60"/></w:pPr>'
  $n = "<w:r><w:t xml:space=`"preserve`">$($script:NumberCounter).   </w:t></w:r>"
  $body = "<w:r><w:t xml:space=`"preserve`">$(Esc $text)</w:t></w:r>"
  return "<w:p>$pPr$n$body</w:p>"
}

function CodeBlock([string]$text) {
  $lines = $text -split "`r?`n"
  $paras = ''
  foreach ($line in $lines) {
    $rPr = '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="20"/>'
    $r = "<w:r><w:rPr>$rPr</w:rPr><w:t xml:space=`"preserve`">$(Esc $line)</w:t></w:r>"
    $paras += "<w:p><w:pPr><w:spacing w:after=`"0`"/></w:pPr>$r</w:p>"
  }
  $shading = "<w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"$CODEBG`"/>"
  $tcPr = "<w:tcPr><w:tcW w:type=`"dxa`" w:w=`"9000`"/>$shading</w:tcPr>"
  $cell = "<w:tc>$tcPr$paras</w:tc>"
  $tblPr = '<w:tblPr><w:tblW w:type="dxa" w:w="9000"/></w:tblPr><w:tblGrid><w:gridCol w:w="9000"/></w:tblGrid>'
  $tbl = "<w:tbl>$tblPr<w:tr>$cell</w:tr></w:tbl>"
  return $tbl + (Para ' ')
}

function Callout([string]$title, [string]$body) {
  $titleRun = "<w:p><w:pPr><w:spacing w:after=`"40`"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val=`"$BRAND`"/></w:rPr><w:t xml:space=`"preserve`">$(Esc $title)</w:t></w:r></w:p>"
  $bodyRun  = "<w:p><w:pPr><w:spacing w:after=`"40`"/></w:pPr><w:r><w:rPr><w:color w:val=`"$SOFT`"/></w:rPr><w:t xml:space=`"preserve`">$(Esc $body)</w:t></w:r></w:p>"
  $shading = "<w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"$CALLOUTBG`"/>"
  $tcPr = "<w:tcPr><w:tcW w:type=`"dxa`" w:w=`"9000`"/>$shading</w:tcPr>"
  $cell = "<w:tc>$tcPr$titleRun$bodyRun</w:tc>"
  $tblPr = '<w:tblPr><w:tblW w:type="dxa" w:w="9000"/></w:tblPr><w:tblGrid><w:gridCol w:w="9000"/></w:tblGrid>'
  $tbl = "<w:tbl>$tblPr<w:tr>$cell</w:tr></w:tbl>"
  return $tbl + (Para ' ')
}

function BuildTable($headers, $rows) {
  $cols = $headers.Count
  $totalWidth = 9000
  $colWidth = [int]($totalWidth / $cols)
  $gridXml = ''
  for ($i=0; $i -lt $cols; $i++) {
    $gridXml += "<w:gridCol w:w=`"$colWidth`"/>"
  }
  $borderColor = 'BFC7CF'
  $tblPr = @"
<w:tblPr>
  <w:tblW w:type="dxa" w:w="$totalWidth"/>
  <w:tblBorders>
    <w:top w:val="single" w:sz="4" w:space="0" w:color="$borderColor"/>
    <w:left w:val="single" w:sz="4" w:space="0" w:color="$borderColor"/>
    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="$borderColor"/>
    <w:right w:val="single" w:sz="4" w:space="0" w:color="$borderColor"/>
    <w:insideH w:val="single" w:sz="4" w:space="0" w:color="$borderColor"/>
    <w:insideV w:val="single" w:sz="4" w:space="0" w:color="$borderColor"/>
  </w:tblBorders>
</w:tblPr>
"@
  $headerCells = ''
  foreach ($h in $headers) {
    $shading = "<w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"$HEADBG`"/>"
    $tcPr = "<w:tcPr><w:tcW w:type=`"dxa`" w:w=`"$colWidth`"/>$shading</w:tcPr>"
    $para = "<w:p><w:pPr><w:spacing w:after=`"0`"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val=`"FFFFFF`"/></w:rPr><w:t xml:space=`"preserve`">$(Esc $h)</w:t></w:r></w:p>"
    $headerCells += "<w:tc>$tcPr$para</w:tc>"
  }
  $headerRow = "<w:tr>$headerCells</w:tr>"

  $bodyRows = ''
  foreach ($row in $rows) {
    $cellsXml = ''
    foreach ($value in $row) {
      $tcPr = "<w:tcPr><w:tcW w:type=`"dxa`" w:w=`"$colWidth`"/></w:tcPr>"
      $para = "<w:p><w:pPr><w:spacing w:after=`"0`"/></w:pPr><w:r><w:rPr><w:sz w:val=`"20`"/></w:rPr><w:t xml:space=`"preserve`">$(Esc $value)</w:t></w:r></w:p>"
      $cellsXml += "<w:tc>$tcPr$para</w:tc>"
    }
    $bodyRows += "<w:tr>$cellsXml</w:tr>"
  }

  $gridBlock = "<w:tblGrid>$gridXml</w:tblGrid>"
  $tbl = "<w:tbl>$tblPr$gridBlock$headerRow$bodyRows</w:tbl>"
  return $tbl + (Para ' ')
}

function PageBreak {
  return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
}

# -------------------- Build content -----------------------------------------
$sb = New-Object System.Text.StringBuilder

function Add($xml) { [void]$sb.Append($xml) }

# Cover
Add (Title 'Urban Sanctuary Booking Portal')
Add (Subtitle 'Beginner Developer Guide')
Add (Tagline 'How the app works, what every file does, and where to make changes.')
Add (Callout 'Who this guide is for' 'Junior developers, new teammates, or anyone who needs to understand or modify the booking portal frontend. No prior React experience is assumed; key terms are explained when first used.')
Add (Callout 'How to read this guide' 'Start with sections 1 to 5 for the big picture. Section 11 lists every page and tells you which file to open for a given change. Sections 14 and 15 are the practical parts: common change recipes and what is already connected to the backend.')
Add (PageBreak)

# 1. What this app does
Add (Heading '1. What this app does' 1)
Add (Para 'Urban Sanctuary is a booking portal for short-stay apartments in Douala, Cameroon. It is a single-page React web app that talks to a backend REST API. The backend handles real authentication, real properties, real bookings, and real payments via Mobile Money. The frontend only displays data and submits requests; it never stores secrets on its own.')

Add (Heading 'What a guest user can do' 2)
foreach ($b in @(
  'Browse curated apartments (Discover page).',
  'Filter apartments by neighborhood, category, amenity, and guest count (Neighborhoods page).',
  'Open one apartment to read details, gallery, amenities, and reviews (Apartment Details page).',
  'Pick dates and guests, then create a booking (Booking page).',
  'Pay with Mobile Money, Bank Card, or Cash on Arrival (Payment page).',
  'See a confirmation screen after a successful payment (Success page).',
  'View past, upcoming, and cancelled bookings (Reservations page).',
  'Open a single reservation for details (Reservation Details page).',
  'Cancel an upcoming booking that is still "pending" or "confirmed".',
  'Save places to revisit later (Saved page, currently uses sample data).',
  'Edit profile, change password, set up two-factor authentication (Profile page).',
  'Sign up and log in (Register / Login pages).'
)) { Add (Bullet $b) }

Add (Heading 'What an admin user can do' 2)
Add (Para 'When the JWT token says the user has the "admin" role, Login redirects to /admin. The admin portal is separate from the guest booking pages and has its own layout under src/components/adminpage/. It currently connects to admin endpoints for dashboard totals, users, properties, bookings, support tickets, permissions, config, and audit-log export. Some editor-style controls are still UI placeholders until their matching backend endpoints are confirmed.')

Add (Heading 'Pages at a glance' 2)
Add (BuildTable @('Route','Page file','Who can see it') @(
  ,@('/ and /discover','src/pages/Discover.jsx','Anyone')
  ,@('/apartments','src/pages/Neighborhoods.jsx','Anyone')
  ,@('/apartments/:id','src/pages/ApartmentDetails.jsx','Anyone')
  ,@('/booking/:id','src/pages/Booking.jsx','Logged-in users')
  ,@('/payment/:id','src/pages/Payment.jsx','Logged-in users')
  ,@('/success','src/pages/Success.jsx','Logged-in users')
  ,@('/dashboard','src/pages/Dashboard.jsx','Logged-in users')
  ,@('/history','src/pages/Reservations.jsx','Logged-in users')
  ,@('/reservations/:id','src/pages/ReservationDetails.jsx','Logged-in users')
  ,@('/profile','src/pages/Profile.jsx','Logged-in users')
  ,@('/saved','src/pages/Saved.jsx','Logged-in users')
  ,@('/support','src/pages/Support.jsx','Anyone')
  ,@('/login','src/pages/Login.jsx','Logged-out users only')
  ,@('/register','src/pages/Register.jsx','Logged-out users only')
  ,@('/admin','src/components/adminpage/AdminDashboard.jsx','Admin users only')
  ,@('/admin/users','src/components/adminpage/AdminUsers.jsx','Admin users only')
  ,@('/admin/properties','src/components/adminpage/AdminProperties.jsx','Admin users only')
  ,@('/admin/bookings','src/components/adminpage/AdminBooking.jsx','Admin users only')
  ,@('/admin/content','src/components/adminpage/AdminContent.jsx','Admin users only')
  ,@('/admin/security','src/components/adminpage/AdminSettingss.jsx','Admin users only')
  ,@('/admin/support','src/components/adminpage/AdminSupport.jsx','Admin users only')
))
Add (PageBreak)

# 2. Tech stack
Add (Heading '2. Tech stack and key libraries' 1)
Add (Para 'The frontend is intentionally minimal. There is no Redux, no Zustand, no React Query. State lives in React itself, and HTTP calls go through a single fetch wrapper.')
Add (BuildTable @('Tool','Why it is used') @(
  ,@('React 19','The UI framework. Builds the interactive pages from components.')
  ,@('React Router 7','Manages page-to-page navigation in the browser.')
  ,@('Vite 8','Dev server and production bundler. Provides the npm scripts.')
  ,@('Tailwind CSS 3','Utility classes used directly inside JSX for styling.')
  ,@('axios (installed)','Listed in package.json but the app uses native fetch through apiClient.')
))
Add (Heading 'Important runtime configuration' 2)
Add (Para 'The backend URL is read from an environment variable so the same code can point at staging or production without changes.')
Add (CodeBlock ".env`r`nVITE_API_BASE_URL=https://your-backend.example.com/api/v1")
Add (Callout 'Where this is used' 'Read in src/services/apiClient.js as import.meta.env.VITE_API_BASE_URL. Every HTTP request is built on top of that base URL.')
Add (PageBreak)

# 3. How to run locally
Add (Heading '3. How to run the project locally' 1)
ResetNum
foreach ($n in @(
  'Install Node.js 20 or newer.',
  'From the project root, run npm install to install all dependencies.',
  'Create a .env file at the project root with VITE_API_BASE_URL set to your backend.',
  'Run npm run dev to start the dev server (Vite usually opens http://localhost:5173).',
  'Run npm run lint to check for code issues before committing.',
  'Run npm run build to create a production bundle in dist/.',
  'Run npm run preview to test the built bundle locally.'
)) { Add (NumItem $n) }

Add (Heading 'npm scripts' 2)
Add (BuildTable @('Script','What it does') @(
  ,@('npm run dev','Starts Vite with hot reload.')
  ,@('npm run lint','Runs ESLint on the whole project.')
  ,@('npm run build','Builds the production bundle into dist/.')
  ,@('npm run preview','Serves the built bundle locally for a final check.')
))

Add (Callout 'If something does not load' 'Check the browser console (F12). Most issues show up either as a CORS error (backend rejects the request), a 401 (token missing or expired), or a TypeError (the API returned a shape the adapter did not expect). The adapters in src/lib/ are the safest place to add a new fallback.')
Add (PageBreak)

# 4. Project map
Add (Heading '4. Project file map' 1)
Add (Para 'Everything that ships to users lives under src/. The other folders are configuration, dependencies, or build output.')
Add (CodeBlock @"
booking-portal/
  .env                      Backend base URL
  package.json              Dependencies and scripts
  vite.config.js            Vite settings
  tailwind.config.js        Tailwind configuration
  postcss.config.js         PostCSS plugins
  eslint.config.js          ESLint rules
  index.html                The HTML shell Vite uses
  docs/                     Documentation (this guide, swagger.yaml)
  public/                   Static assets served as-is
  dist/                     Production build output (generated)
  scripts/                  Helper scripts (e.g. this guide generator)
  src/
    main.jsx                Entry point that mounts <App />
    App.jsx                 Wraps the router in providers
    index.css               Tailwind directives only
    routes/                 React Router setup
    pages/                  One file per route
    components/             Reusable building blocks
    hooks/                  Custom hooks (data + shared logic)
    context/                React context (apartments and admin portal state)
    services/               Thin wrappers around backend endpoints
    lib/                    Pure helpers (format, adapters, filters)
    data/                   Hard-coded sample data
    assets/                 Images, fonts, etc.
"@)
Add (PageBreak)

# 5. Boot flow
Add (Heading '5. How the app boots' 1)
Add (Para 'When the user opens the site, the chain of files runs in this order:')
ResetNum
foreach ($n in @(
  'index.html loads and mounts a single <div id="root"></div>.',
  'src/main.jsx creates the React root and renders <App />.',
  'src/App.jsx wraps the app in <ApartmentsProvider> (context) and renders <AppRouter />.',
  'src/routes/AppRouter.jsx reads the URL and decides which page component to mount.',
  'Pages call hooks (useBookings, useProfile, ...). Hooks call services. Services call the backend.',
  'Data flows back: services return JSON, hooks normalize it through adapters, pages pass it to components as props.'
)) { Add (NumItem $n) }
Add (Callout 'Mental model' 'URL -> Router -> Page -> Hook -> Service -> Backend, then the data goes back through Hook -> Page -> Component. If you can keep this picture in your head, you can find any file in the project in seconds.')
Add (PageBreak)

# 6. Routing
Add (Heading '6. Routing and protected routes' 1)
Add (Para 'All routes are declared in one file: src/routes/AppRouter.jsx. There are two small wrapper components in that file that decide who can see what.')

Add (Heading 'ProtectedRoute' 2)
Add (Para 'Wraps a page that requires login. It checks the JWT token in localStorage. If there is no token, it sends the user to /login. If allowedRoles is set (for example ["admin"]) and the role does not match, it sends them to /apartments instead.')

Add (Heading 'PublicOnlyRoute' 2)
Add (Para 'Wraps the Login and Register pages. If the user is already logged in, regular users are redirected to /apartments and admins are redirected to /admin so they do not log in twice.')

Add (Heading 'Adding a new route' 2)
ResetNum
foreach ($n in @(
  'Create the page file under src/pages/, for example src/pages/Inbox.jsx.',
  'Import it at the top of src/routes/AppRouter.jsx.',
  'Add a <Route path="/inbox" element={...} /> inside the right <Route element={<MainLayout />}>.',
  'If the page needs login, wrap it in <ProtectedRoute>...</ProtectedRoute>.',
  'If a link should appear in the top nav, also add it to the navLinks array in src/components/Navbar.jsx.'
)) { Add (NumItem $n) }
Add (PageBreak)

# 7. Auth
Add (Heading '7. Authentication' 1)
Add (Para 'Authentication uses a JSON Web Token (JWT). After login, the token is saved in localStorage under the key "access_token". Every backend request automatically attaches it as the Authorization header.')

Add (Heading 'Files that own the auth logic' 2)
Add (BuildTable @('File','Responsibility') @(
  ,@('src/hooks/useAuthToken.js','Read, save, and clear the JWT. Decode it to read the role.')
  ,@('src/hooks/useUserRole.js','Returns { role, isAdmin } for any page that needs it.')
  ,@('src/services/authApi.js','POST endpoints for /auth/login, /auth/register, and 2FA.')
  ,@('src/pages/Login.jsx','Login form; saves the token via useAuthToken.saveToken.')
  ,@('src/pages/Register.jsx','Sign-up form; redirects to Login on success.')
  ,@('src/routes/AppRouter.jsx','ProtectedRoute / PublicOnlyRoute guards.')
))

Add (Heading 'The login flow, step by step' 2)
ResetNum
foreach ($n in @(
  'User types email and password and clicks Log In.',
  'Login.jsx calls loginUser({ email, password }) from authApi.js.',
  "authApi.js calls apiRequest('/auth/login', { method: 'POST', body }).",
  'apiClient.js sends the fetch and unwraps the JSON envelope.',
  'Login.jsx extracts the token using getAccessToken (handles several payload shapes).',
  'useAuthToken.saveToken(token) stores it in localStorage.',
  'Login.jsx reads the token role. Admins go to /admin; regular users go to /discover.',
  'On every later request, apiClient.js automatically attaches the Authorization header.'
)) { Add (NumItem $n) }

Add (Callout 'Where to change auth behavior' 'Want regular users to redirect to /dashboard instead of /discover after login? Edit the navigate(role === "admin" ? "/admin" : "/discover") line in Login.jsx. Want to add a third role like "host"? Edit useUserRole.js and any ProtectedRoute that uses allowedRoles.')
Add (PageBreak)

# 8. API layer
Add (Heading '8. The API layer' 1)
Add (Para 'The browser never talks to the backend directly. Every request goes through src/services/apiClient.js. Every page goes through a service wrapper. This means you can change the backend URL or auth header in one place.')

Add (Heading 'apiClient.js' 2)
foreach ($b in @(
  'Reads VITE_API_BASE_URL from environment.',
  'Adds Authorization: Bearer <token> if a token exists.',
  'Sets Content-Type: application/json when a body is present.',
  'Unwraps the JSON envelope: throws an error if !response.ok or payload.success === false.',
  'Returns payload.data so callers can use the data directly.',
  'Exposes buildQueryString(params) so services do not duplicate URLSearchParams plumbing.'
)) { Add (Bullet $b) }

Add (Heading 'Service files' 2)
Add (BuildTable @('File','Endpoints it wraps') @(
  ,@('src/services/authApi.js','POST /auth/login, /auth/register, /auth/2fa/enable, /auth/2fa/confirm')
  ,@('src/services/usersApi.js','GET/PATCH /users/me, PATCH /users/me/password, GET /users/me/notifications')
  ,@('src/services/propertiesApi.js','GET /properties, GET /properties/:id')
  ,@('src/services/bookingsApi.js','GET /users/me/bookings or /admin/bookings, POST /bookings, POST /bookings/:id/cancel, GET /bookings/:id')
  ,@('src/services/paymentsApi.js','POST /payments/initiate')
  ,@('src/services/adminApi.js','GET/PATCH admin users, GET admin properties/bookings/tickets, ticket replies/status, permissions, config, audit logs')
))

Add (Heading 'Adding a new endpoint' 2)
ResetNum
foreach ($n in @(
  'Pick the right service file (or create a new one).',
  'Add an exported function that calls apiRequest with the URL and method.',
  'If the endpoint accepts query parameters, use buildQueryString to format them.',
  'If the response shape is new, add a normalizer in src/lib/ so the UI stays decoupled.',
  'Use the new function from a hook or directly from a page.'
)) { Add (NumItem $n) }

Add (CodeBlock @"
// Example: adding a new endpoint to fetch reviews.
// src/services/reviewsApi.js
import { apiRequest, buildQueryString } from "./apiClient";

export function listReviews(propertyId, params = {}) {
  return apiRequest(
    `/properties/${propertyId}/reviews${buildQueryString(params)}`,
  );
}
"@)
Add (PageBreak)

# 9. Adapters
Add (Heading '9. Adapters and helpers (src/lib)' 1)
Add (Para 'Backends rarely return data in exactly the shape a UI wants. Adapters in src/lib/ smooth over those differences so components stay simple. Keep most "if backend uses X or Y" code inside this folder.')
Add (BuildTable @('File','Purpose') @(
  ,@('src/lib/constants.js','Shared constants such as FALLBACK_PROPERTY_IMAGE.')
  ,@('src/lib/format.js','formatXAF (currency), calculateNights, formatShortDate, capitalize.')
  ,@('src/lib/images.js','pickPropertyImage(property): chooses the best image URL from many possible fields.')
  ,@('src/lib/propertyAdapter.js','Turn a raw property payload into the apartment shape used everywhere.')
  ,@('src/lib/bookingAdapter.js','Turn raw bookings into the shape the dashboard, history, and details pages expect.')
  ,@('src/lib/apartmentFilters.js','Filter the apartments list by location, area, guests, category, amenity.')
))
Add (Callout 'When to add to lib/' 'If you find yourself writing the same "price = property.price || property.price_per_night || ..." twice, move it into an adapter. The UI should ask for apartment.price and trust it.')
Add (PageBreak)

# 10. Hooks & context
Add (Heading '10. Hooks and context' 1)
Add (Heading 'Why hooks exist here' 2)
Add (Para 'Hooks are reusable functions that encapsulate state and side effects (network calls, localStorage access). Pages use hooks to keep their JSX focused on layout. If two pages need the same data, they call the same hook.')

Add (BuildTable @('Hook','What it returns / does') @(
  ,@('useAuthToken()','{ token, isAuthenticated, role, saveToken, clearToken }. The token is saved in localStorage as access_token.')
  ,@('useUserRole()','{ role, isAdmin } - convenience selector built on the JWT.')
  ,@('useApartments()','{ apartments, getApartmentById, filterApartments } from the static catalog context.')
  ,@('useApartmentResource(id)','{ apartment, isLoading, error } - tries the static catalog first, falls back to the API.')
  ,@('useProperties(params)','{ properties, isLoading, error } - paginated list from the backend, normalized.')
  ,@('useBookings(params)','{ bookings, isLoading, isCancelling, error, successMessage, reloadBookings, cancelBookingById, confirmAndCancelBooking }')
  ,@('useProfile()','User profile, notifications, two-factor setup, plus saveProfile/changePassword/...')
  ,@('useAdminUsers()','Admin user list, search/filter state, role changes, and active/inactive toggles.')
  ,@('useAdminPortal()','Shared admin portal state: sidebar, permission matrix, role counts, and audit-log export.')
  ,@('useAdminTickets()','Admin ticket queue, selected ticket, replies, and ticket status updates. Must be inside AdminTicketProvider.')
))

Add (Heading 'Context: ApartmentsContext' 2)
Add (Para 'Defined across two files for a Fast Refresh friendly pattern:')
foreach ($b in @(
  'src/context/apartmentContextValue.js: only the createContext() call.',
  'src/context/ApartmentsContext.jsx: the <ApartmentsProvider> component that wraps the app and computes the value.',
  'src/hooks/useApartments.js: the consumer hook with a friendly error if the provider is missing.'
)) { Add (Bullet $b) }

Add (Heading 'Context: AdminPortalContext' 2)
Add (Para 'Admin portal state is shared through src/context/AdminPortalProvider.jsx and consumed with src/hooks/useAdminPortal.js. It owns sidebar collapse state, permission matrix loading/saving, role user counts, and audit-log export. Admin support tickets use their own smaller provider: src/components/adminpage/AdminTicketProvider.jsx.')
Add (Callout 'When to add a new context' 'Add a context only when many unrelated components need the same value (for example a currency selector, a feature flag, or a logged-in user). If only two components share data, plain props are simpler.')
Add (PageBreak)

# 11. Pages
Add (Heading '11. Pages: what each one does and how to change it' 1)

$pages = @(
  @{
    Title='Discover (src/pages/Discover.jsx)'
    Route='/ and /discover'
    Summary='Landing page. Hero with search bar, featured listings, neighborhood spotlight, and the site footer.'
    Changes=@(
      'Change marketing copy: src/components/discover/DiscoverHero.jsx.',
      'Change featured cards or footer text: src/data/discoverContent.js.',
      'Change neighborhood tiles: same discoverContent.js, neighborhoods array.',
      'Change what Search does: handleSearch in Discover.jsx.'
    )
  },
  @{
    Title='Neighborhoods (src/pages/Neighborhoods.jsx)'
    Route='/apartments'
    Summary='List of all apartments with neighborhood, category, amenity, and guest filters. Pulls live data from the backend; if the backend is empty it falls back to the static catalog.'
    Changes=@(
      'Change filter UI: src/components/FilterChipGroup.jsx.',
      'Change the hero (left side): src/components/Hero.jsx and src/components/SearchBar.jsx.',
      'Change card design: src/components/ApartmentCard.jsx.',
      'Change filter logic: src/lib/apartmentFilters.js.'
    )
  },
  @{
    Title='Apartment Details (src/pages/ApartmentDetails.jsx)'
    Route='/apartments/:id'
    Summary='Full apartment page: header, gallery, description, amenities grid, reviews, location, and the reserve panel.'
    Changes=@(
      'Change the sticky reservation card: src/components/apartment-details/ReservationPanel.jsx.',
      'Change static amenities or reviews: src/data/apartmentDetailsContent.js.',
      'Change header info (rating, badges): src/components/apartment-details/ApartmentDetailsHeader.jsx.'
    )
  },
  @{
    Title='Booking (src/pages/Booking.jsx)'
    Route='/booking/:id'
    Summary='Date / guest form. On submit it calls createBooking from bookingsApi.js, then navigates to /payment/:id with the booking id in router state.'
    Changes=@(
      'Change form fields: directly in Booking.jsx (dates and guests inputs).',
      'Change the summary card on the left: src/components/ApartmentSummary.jsx.',
      'Change how a booking body is built: createBooking call inside Booking.jsx.'
    )
  },
  @{
    Title='Payment (src/pages/Payment.jsx)'
    Route='/payment/:id'
    Summary='Collects payment details and starts the mobile-money payment via paymentsApi.initiatePayment. Redirects to /success on success.'
    Changes=@(
      'Change provider options: the <select> in Payment.jsx.',
      'Default phone number: phoneNumber initial state in Payment.jsx.',
      "Change the redirect target after payment: navigate('/success') call."
    )
  },
  @{
    Title='Success (src/pages/Success.jsx)'
    Route='/success'
    Summary='Static confirmation screen with two CTA buttons.'
    Changes=@('Change wording or CTAs directly in Success.jsx.')
  },
  @{
    Title='Login (src/pages/Login.jsx)'
    Route='/login'
    Summary='Email and password form. Saves the JWT token via useAuthToken.saveToken.'
    Changes=@(
      'Change the post-login redirect: the navigate(role === "admin" ? "/admin" : "/discover") line.',
      'Change marketing image / copy on the left panel: top of Login.jsx.',
      'Reusable inputs: src/components/auth/AuthTextField.jsx and PasswordField.jsx.'
    )
  },
  @{
    Title='Register (src/pages/Register.jsx)'
    Route='/register'
    Summary='Sign-up form. On success navigates to /login (the user logs in next).'
    Changes=@(
      'Add a field: add a useState, an AuthTextField, and include the value in registerBody.',
      "Change the post-register redirect: navigate('/login') call."
    )
  },
  @{
    Title='Dashboard (src/pages/Dashboard.jsx)'
    Route='/dashboard'
    Summary='Wrapped in PortalLayout. Shows user greeting, three stats, upcoming reservations (max 2), and recent transactions (max 5).'
    Changes=@(
      'Stats labels and values: buildBookingStats in src/lib/bookingAdapter.js.',
      'Silver Status threshold: SILVER_STATUS_TARGET_NIGHTS constant in Dashboard.jsx.',
      'Welcome heading: src/components/dashboard/DashboardHeader.jsx.',
      'Upcoming reservation card: src/components/dashboard/UpcomingReservations.jsx.',
      'Transaction rows: src/components/dashboard/RecentTransactions.jsx.'
    )
  },
  @{
    Title='Reservations (src/pages/Reservations.jsx)'
    Route='/history'
    Summary='All bookings for the user, or every booking for admins. Each card supports cancel for pending/confirmed bookings.'
    Changes=@(
      'Change card layout: BookingCard inside Reservations.jsx.',
      'Cancel rules: canCancelBooking in src/lib/bookingAdapter.js.',
      'Cancel confirmation text: pass a second argument to confirmAndCancelBooking.'
    )
  },
  @{
    Title='Reservation Details (src/pages/ReservationDetails.jsx)'
    Route='/reservations/:id'
    Summary='Single booking page with property summary, guest info, and the reservation id.'
    Changes=@(
      'Date and status formatting: formatBookingDate / formatBookingStatus in src/lib/bookingAdapter.js.',
      'Image fallback: pickPropertyImage in src/lib/images.js.'
    )
  },
  @{
    Title='Profile (src/pages/Profile.jsx)'
    Route='/profile'
    Summary='Personal info, security (password and 2FA), and notifications. All persistence goes through src/hooks/useProfile.js.'
    Changes=@(
      'Save behavior: saveProfile in useProfile.js.',
      'Password rules: PasswordForm in src/components/profile/SettingsPanel.jsx.',
      'Two-factor flow: TwoFactorPanel in the same SettingsPanel.jsx.',
      'Profile summary (avatar, name, role badge): src/components/profile/ProfileSummary.jsx.'
    )
  },
  @{
    Title='Saved (src/pages/Saved.jsx)'
    Route='/saved'
    Summary='Currently shows sample data. There is no backend wiring yet.'
    Changes=@(
      'Replace savedPlaces array with real data when the backend supports it.',
      'Card style: SavedPlaceCard inside Saved.jsx.'
    )
  },
  @{
    Title='Support (src/pages/Support.jsx)'
    Route='/support'
    Summary='Static help page with four topic cards.'
    Changes=@('All content is hard-coded in Support.jsx; edit directly.')
  },
  @{
    Title='Admin Dashboard (src/components/adminpage/AdminDashboard.jsx)'
    Route='/admin'
    Summary='Admin landing page. Loads totals from admin users, properties, bookings, and tickets endpoints.'
    Changes=@(
      'Change stat card layout: StatCard inside AdminDashboard.jsx.',
      'Change which totals load: Promise.all block calling listAdminUsers/listAdminProperties/listAdminBookings/listAdminTickets.',
      'Change quick links: Quick actions section inside AdminDashboard.jsx.'
    )
  },
  @{
    Title='Admin Users (src/components/adminpage/AdminUsers.jsx)'
    Route='/admin/users'
    Summary='User management table with search, role filter, role update, and active/inactive toggle. Data logic lives in useAdminUsers.js.'
    Changes=@(
      'Change API behavior: src/hooks/useAdminUsers.js and src/services/adminApi.js.',
      'Change table columns or action buttons: AdminUsers.jsx.',
      'Change roles shown in selectors: role options inside AdminUsers.jsx and role constants in src/lib/adminRoles.js.'
    )
  },
  @{
    Title='Admin Properties (src/components/adminpage/AdminProperties.jsx)'
    Route='/admin/properties'
    Summary='Admin listing table for published, draft, and archived properties. It currently reads from /admin/properties.'
    Changes=@(
      'Change status filters: status <select> in AdminProperties.jsx.',
      'Change which property fields display: table body in AdminProperties.jsx.',
      'Add create/edit/delete actions: add service functions in adminApi.js, then call them from AdminProperties.jsx.'
    )
  },
  @{
    Title='Admin Bookings (src/components/adminpage/AdminBooking.jsx)'
    Route='/admin/bookings'
    Summary='System-wide booking table for admins. It reads from /admin/bookings and links each row to /reservations/:id.'
    Changes=@(
      'Change filters: status <select> in AdminBooking.jsx.',
      'Change date/status display: src/lib/bookingAdapter.js.',
      'Add admin booking actions: create service functions in adminApi.js first, then wire buttons here.'
    )
  },
  @{
    Title='Admin Content (src/components/adminpage/AdminContent.jsx)'
    Route='/admin/content'
    Summary='Content and listing editor-style screen. It is partly connected through admin config APIs, but some rich editor interactions are still UI placeholders.'
    Changes=@(
      'Change editor layout or copy fields: AdminContent.jsx.',
      'Persist global variables: getAdminSiteConfig/updateAdminSiteConfig in adminApi.js.',
      'Add real page publishing: confirm backend endpoint first, then add a service wrapper.'
    )
  },
  @{
    Title='Admin Security (src/components/adminpage/AdminSettingss.jsx)'
    Route='/admin/security'
    Summary='Permission matrix for admin roles. State and save/reset logic are provided by AdminPortalProvider.'
    Changes=@(
      'Change role cards or permission rows: AdminSettingss.jsx.',
      'Change default fallback modules: src/lib/adminRoles.js.',
      'Change loading/saving behavior: src/context/AdminPortalProvider.jsx.'
    )
  },
  @{
    Title='Admin Support (src/components/adminpage/AdminSupport.jsx)'
    Route='/admin/support'
    Summary='Three-column ticket workspace: ticket list, conversation, and user context. Data comes through AdminTicketProvider and admin ticket endpoints.'
    Changes=@(
      'Change ticket list UI: TicketListPanel in AdminSupport.jsx.',
      'Change conversation UI: ConversationPanel and MessageBubble in AdminSupport.jsx.',
      'Change reply/status API behavior: AdminTicketProvider.jsx and adminApi.js.'
    )
  }
)

foreach ($pg in $pages) {
  Add (Heading $pg.Title 2)
  Add (Para "Route: $($pg.Route)" @{ Italic=$true })
  Add (Para $pg.Summary)
  Add (Para 'Where to change things:' @{ Bold=$true })
  foreach ($c in $pg.Changes) { Add (Bullet $c) }
}
Add (PageBreak)

# 12. Components
Add (Heading '12. Reusable components' 1)
Add (Para 'Anything that is not a route lives in src/components/. Components are organized by feature folder when they only make sense in one place (dashboard, apartment-details, profile, discover, auth).')

Add (Heading 'Top-level shared components' 2)
Add (BuildTable @('File','What it is for') @(
  ,@('MainLayout.jsx','Wraps every public page with the Navbar and an <Outlet />.')
  ,@('PortalLayout.jsx','Wraps Dashboard, Reservations, and Saved with the side menu and member-status card.')
  ,@('Navbar.jsx','Top navigation, profile dropdown, mobile menu, and logout.')
  ,@('Hero.jsx','Large hero on the Neighborhoods page with a search bar and stats.')
  ,@('SearchBar.jsx','Location + Guests + Action triple used inside Hero and DiscoverHero.')
  ,@('FilterChipGroup.jsx','Round filter buttons for category, amenity, and neighborhood.')
  ,@('ApartmentCard.jsx','Grid card for an apartment in the listing.')
  ,@('ApartmentSummary.jsx','Compact stay summary used by Booking and Payment.')
  ,@('NotFound.jsx','Empty-state card with a tag, title, description, and a back link.')
  ,@('StatusBadge.jsx','Small coloured pill for booking statuses.')
  ,@('StatusMessage.jsx','Coloured info / error / success banner; also exports FeedbackBanner.')
  ,@('LoadingScreen.jsx','Full-page "Loading..." placeholder used by Booking, Payment, etc.')
))

Add (Heading 'Feature folders' 2)
foreach ($b in @(
  'components/auth: AuthTextField, PasswordField used by Login and Register.',
  'components/dashboard: DashboardHeader, StatsGrid, UpcomingReservations, RecentTransactions.',
  'components/apartment-details: header, gallery, amenities, details section, reviews, location, reservation panel.',
  'components/discover: DiscoverHero, FeaturedListings, NeighborhoodSpotlight, SiteFooter.',
  'components/profile: PersonalInfoPanel, SettingsPanel (which exports SecuritySettingsPanel and NotificationsPanel), ProfileSummary.',
  'components/adminpage: AdminLayout plus each admin section page. These are grouped here instead of src/pages because the admin portal is its own mini-application.'
)) { Add (Bullet $b) }

Add (Callout 'How to choose where a component lives' 'If the component is used by only one feature, put it inside that feature folder. If two or more unrelated features use it, move it to src/components/ directly. StatusMessage and LoadingScreen earned a top-level spot because four pages share them.')
Add (PageBreak)

# 13. Styling
Add (Heading '13. Styling with Tailwind' 1)
Add (Para 'Tailwind classes are written directly in JSX. There is no global CSS beyond the three @tailwind directives in src/index.css. Most pages use the same colour vocabulary: sky-900 for primary actions, slate-* for neutral text, the off-white #F7F8F0 as a soft background, and #E7E8DE for borders.')

Add (Heading 'Where Tailwind is configured' 2)
foreach ($b in @(
  'tailwind.config.js: theme, plugins, content globs.',
  'postcss.config.js: PostCSS pipeline (Tailwind + Autoprefixer).',
  'src/index.css: the three Tailwind directives.'
)) { Add (Bullet $b) }
Add (Callout 'Changing the brand colour' 'To switch primary blue to another palette: open tailwind.config.js, add a custom colour under theme.extend.colors, then run a global find-and-replace from "sky-900" to your new utility name. The accent appears in PortalLayout, Navbar, primary buttons, and several panels.')
Add (PageBreak)

# 14. Cookbook
Add (Heading '14. Common change recipes' 1)
Add (Para 'A quick reference. Each recipe lists exactly the file or files to open.')

$recipes = @(
  @{ Title='Add a new page'; Steps=@(
      'Create the file under src/pages/.',
      'Import and add a <Route> in src/routes/AppRouter.jsx.',
      'Optional: wrap in ProtectedRoute or PublicOnlyRoute.',
      'Optional: add a link in src/components/Navbar.jsx.'
  )},
  @{ Title='Add a link to the top navigation'; Steps=@(
      'Edit navLinks (top of src/components/Navbar.jsx).',
      'Add a matching case in isRouteActive if the active highlight matters.'
  )},
  @{ Title='Add or change a backend endpoint'; Steps=@(
      'Pick or create a service file under src/services/.',
      'Call apiRequest with the path and method.',
      'Optionally normalize the response in src/lib/.'
  )},
  @{ Title='Change the fallback property image'; Steps=@(
      'Edit FALLBACK_PROPERTY_IMAGE in src/lib/constants.js. It is reused everywhere.'
  )},
  @{ Title='Change the cancel-confirmation message'; Steps=@(
      'Pass the new text as the second argument to confirmAndCancelBooking, or edit the default in src/hooks/useBookings.js.'
  )},
  @{ Title='Change the loyalty threshold (Silver Status)'; Steps=@(
      'Edit SILVER_STATUS_TARGET_NIGHTS at the top of src/pages/Dashboard.jsx.'
  )},
  @{ Title='Show a loading or error banner on a new page'; Steps=@(
      'Import StatusMessage from src/components/StatusMessage.jsx.',
      'Use <StatusMessage tone="info" message={...} /> for loading.',
      'Use <FeedbackBanner error={...} successMessage={...} /> for combined feedback.'
  )},
  @{ Title='Add a new role (for example "host")'; Steps=@(
      'Update useUserRole.js if it should be exposed as a flag.',
      "In AppRouter.jsx, pass allowedRoles={['host']} to ProtectedRoute on the relevant routes.",
      "Update src/services/bookingsApi.js if the role should hit a different endpoint, like 'admin' does."
  )},
  @{ Title='Make the cancel button available to admins'; Steps=@(
      'Edit canCancelBooking in src/lib/bookingAdapter.js. Today it returns !isAdmin && ...'
  )},
  @{ Title='Replace static apartments with real backend data only'; Steps=@(
      'Remove the staticApartments fallback in src/hooks/useApartmentResource.js.',
      'Remove the apartments catalog usage in src/pages/Neighborhoods.jsx and rely on useProperties.',
      'Delete src/data/apartments.js once no one imports it.'
  )},
  @{ Title='Add a new piece of profile information'; Steps=@(
      'Add an input to PersonalInfoPanel.jsx (src/components/profile).',
      'Include the field in the body sent to onSave.',
      'Make sure useProfile.saveProfile passes it through (it already forwards anything you give it).'
  )},
  @{ Title='Change the post-login redirect'; Steps=@(
      'Edit the navigate(role === "admin" ? "/admin" : "/discover") line inside handleLogin in src/pages/Login.jsx.'
  )},
  @{ Title='Add a property from the backend'; Steps=@(
      'Log in as an admin and copy a valid JWT token from localStorage or from the login response.',
      'In Postman, send POST https://sanaps.mooo.com/api/v1/properties with Authorization: Bearer <token>.',
      'Include a JSON body with title, description, neighborhood, address, latitude, longitude, price_per_night, bedrooms, bathrooms, max_guests, amenities, images, and status.',
      'If the new property is draft, publish it with PATCH /properties/:id and body { "status": "published" }.',
      'Refresh /apartments in the app. Public listings only show published properties returned by GET /properties.'
  )},
  @{ Title='Delete or archive a property'; Steps=@(
      'Prefer archiving over deleting if the backend supports it: PATCH /properties/:id with { "status": "archived" }.',
      'If a DELETE endpoint exists in swagger.yaml, add a function to src/services/adminApi.js first.',
      'After the backend confirms the change, refresh /admin/properties and /apartments.'
  )},
  @{ Title='Add a new admin portal page'; Steps=@(
      'Create a component under src/components/adminpage/, for example AdminReports.jsx.',
      'Import it in src/routes/AppRouter.jsx under the admin imports.',
      'Add a nested route inside path="/admin", for example <Route path="reports" element={<AdminReports />} />.',
      'Add a sidebar link in the nav array at the top of AdminLayout.jsx.',
      'If it needs shared admin state, put that state in AdminPortalProvider or make a smaller feature provider.'
  )}
)

foreach ($r in $recipes) {
  Add (Heading $r.Title 3)
  ResetNum
  foreach ($s in $r.Steps) { Add (NumItem $s) }
}
Add (PageBreak)

# 15. Backend coverage
Add (Heading '15. Backend coverage: what is connected and what is still static' 1)
Add (Para 'This section is a truth table for the current implementation. It helps you avoid chasing a backend bug when a screen is still intentionally static, and it helps you know which file to open when you want to connect the next feature.')

Add (Heading 'Connected to the backend today' 2)
Add (BuildTable @('Feature','Files to inspect','Endpoint family') @(
  ,@('Login / register / JWT role redirect','Login.jsx, Register.jsx, useAuthToken.js, authApi.js','/auth/login, /auth/register')
  ,@('Public properties list and property details','Neighborhoods.jsx, ApartmentDetails.jsx, useProperties.js, useApartmentResource.js, propertiesApi.js, propertyAdapter.js','/properties, /properties/:id')
  ,@('Create booking and cancel booking','Booking.jsx, useBookings.js, bookingsApi.js, bookingAdapter.js','/bookings, /bookings/:id/cancel')
  ,@('User dashboard and booking history','Dashboard.jsx, Reservations.jsx, ReservationDetails.jsx, useBookings.js','/users/me/bookings or /admin/bookings')
  ,@('Payment initiation','Payment.jsx, paymentsApi.js','/payments/initiate')
  ,@('Profile, password, 2FA, notifications','Profile.jsx, useProfile.js, usersApi.js, authApi.js','/users/me, /users/me/password, /auth/2fa/*')
  ,@('Admin dashboard totals','AdminDashboard.jsx, adminApi.js','/admin/users, /admin/properties, /admin/bookings, /admin/tickets')
  ,@('Admin users','AdminUsers.jsx, useAdminUsers.js, adminApi.js','/admin/users, /admin/users/:id/role, /admin/users/:id/status')
  ,@('Admin properties and bookings','AdminProperties.jsx, AdminBooking.jsx, adminApi.js','/admin/properties, /admin/bookings')
  ,@('Admin support tickets','AdminSupport.jsx, AdminTicketProvider.jsx, useAdminTickets.js, adminApi.js','/admin/tickets, /admin/tickets/:id/reply, /admin/tickets/:id/status')
  ,@('Admin permissions and audit logs','AdminSettingss.jsx, AdminPortalProvider.jsx, adminRoles.js, adminApi.js','/admin/permissions, /admin/audit-logs')
))

Add (Heading 'Still static or partly placeholder' 2)
Add (BuildTable @('Area','Current state','How to make it real later') @(
  ,@('Discover featured cards','Uses discoverContent.js and selected property/card data for the marketing page.','Replace featuredApartments with useProperties({ per_page: 3 }) when you want it fully live.')
  ,@('Saved places','Saved.jsx still uses a local savedPlaces array.','Add saved/favorites endpoints to a service, then create useSavedPlaces().')
  ,@('Support public page','Support.jsx is a static help page.','Add a ticket creation endpoint and form when backend supports public support requests.')
  ,@('Admin content editor rich editing','Some content editor controls are UI-first.','Connect every button to confirmed /admin/config or content endpoints before relying on it.')
  ,@('Property images','Backend properties may return images: []; the UI uses FALLBACK_PROPERTY_IMAGE when no image is available.','Upload real image URLs from admin property creation or add an image upload endpoint.')
))

Add (Callout 'How to decide the next API integration' 'Follow this order: identify the screen, find its page/component, create or extend the service function, wrap it in a hook if the screen needs loading/error state, normalize the data in src/lib/, then pass it into reusable components as props.')
Add (PageBreak)

# 16. Glossary
Add (Heading '16. Glossary for absolute beginners' 1)
Add (BuildTable @('Term','Plain-language definition') @(
  ,@('Component','A reusable piece of UI written as a JavaScript function that returns JSX.')
  ,@('JSX','JavaScript that contains HTML-like tags. Babel/Vite compiles it to plain function calls.')
  ,@('Props','Inputs passed from a parent component into a child, like function arguments.')
  ,@('State','Data that the component owns and can change over time using useState.')
  ,@('Hook','A function whose name starts with "use". It plugs into React lifecycle (useState, useEffect, useBookings).')
  ,@('Context / Provider','A way to share a value (like the apartments catalog) with many components without passing props through every level.')
  ,@('Route','A mapping between a URL pattern and the page component that should render for it.')
  ,@('ProtectedRoute','A wrapper that redirects unauthenticated users away from a page.')
  ,@('JWT','JSON Web Token. A signed string the backend sends after login; the frontend stores it and sends it back on each request.')
  ,@('LocalStorage','Browser storage that survives page reloads. Used here to hold the JWT token.')
  ,@('Fetch','The browser API used to make HTTP requests. Wrapped here in apiRequest.')
  ,@('Adapter / Normalizer','A function in src/lib/ that converts raw API data into the shape the UI expects.')
  ,@('Tailwind utility class','A small CSS class (like "px-4") that you compose in JSX to style elements.')
  ,@('Vite','The dev server and bundler. npm run dev = Vite; npm run build = Vite output.')
  ,@('ESLint','A linter that catches mistakes and enforces style. Run with npm run lint.')
))
Add (Callout 'You made it' 'If you understand the boot flow in section 5 and the page list in section 11, you can change almost anything in the app safely. When in doubt, follow the pattern: page calls a hook, hook calls a service, service calls apiRequest, adapter shapes the data.')

# -------------------- Assemble document.xml ---------------------------------
$body = $sb.ToString()
$docXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    $body
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$contentTypes = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>
"@

$rootRels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
"@

# -------------------- Write files and zip -----------------------------------
$repoRoot = Split-Path -Parent $PSScriptRoot
$tempDir  = Join-Path ([System.IO.Path]::GetTempPath()) ("docx_build_" + [Guid]::NewGuid().ToString('N'))
$null = New-Item -ItemType Directory -Path $tempDir -Force
$null = New-Item -ItemType Directory -Path (Join-Path $tempDir '_rels') -Force
$null = New-Item -ItemType Directory -Path (Join-Path $tempDir 'word') -Force

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $tempDir '[Content_Types].xml'), $contentTypes, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $tempDir '_rels/.rels'),         $rootRels,     $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $tempDir 'word/document.xml'),   $docXml,       $utf8NoBom)

$outputPath = Join-Path $repoRoot 'docs/Urban_Sanctuary_Beginner_Guide.docx'
if (Test-Path $outputPath) { Remove-Item $outputPath -Force }

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $outputPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)
Remove-Item -Recurse -Force $tempDir

Write-Host "Wrote $outputPath"
