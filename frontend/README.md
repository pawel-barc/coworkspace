Archicecture:
src
│
├── api
│ ├── loginApi.js
│ ├── registerApi.js
│ ├── logoutApi.js
│ ├── refreshTokenApi.js
│ ├── fetchWithRefresh.js
│ ├── spacesApi.js
│ └── reservationsApi.js
│
├── assets
│ └── img
│
├── components
│ ├── organisms
│ │ ├── LoginForm.jsx
│ │ ├── RegisterForm.jsx
│ │ ├── ProfileForm.jsx
│ │ ├── Logout.jsx
│ │ ├── Header.jsx
│ │ ├── HeaderLogged.jsx
│ │ ├── HeaderUnlogged.jsx
│ │ ├── SpaceCard.jsx
│ │ ├── ReservationForm.jsx
│ │ └── ReservationList.jsx
│ │
│ └── pages
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── Dashboard.jsx
│ ├── Profile.jsx
│ ├── Spaces.jsx
│ ├── SpaceDetails.jsx
│ ├── Reservations.jsx
│ └── MyReservations.jsx
│
├── layout
│ ├── AppLayout.jsx
│ ├── PrivateLayout.jsx
│ └── PublicLayout.jsx
│
├── router
│ └── Router.jsx
│
├── store
│ ├── AuthStore.jsx
│ ├── ReservationStore.jsx
│ └── SpaceStore.jsx
│
├── validations
│ ├── registerValidationSchema.js
│ ├── loginValidationSchema.js
│ ├── profileValidationSchema.js
│ └── reservationValidationSchema.js
│
├── utils
│ ├── formatDate.js
│ ├── authHelpers.js
│ └── constants.js
│
├── styles
│ ├── global.css
│ ├── forms.css
│ └── dashboard.css
│
├── App.jsx
├── App.css
├── main.jsx
└── index.css
