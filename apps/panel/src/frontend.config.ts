export const config = {
  apiUrl: 'http://localhost:3000/',
  wsUrl: 'http://localhost:3000/',
  siteKey: '0x4AAAAAAAeqwbWTF4HdKbZK',
  projectTitle: 'VRSIS Default Project',
  projectDescription: 'Template project for fast app development',
  //AUTH
  auth: {
    signup: true,
    authtitle: '<div>VRSIS</div><div>Default Project</div>',
    authdescription: 'Template project for fast app development',
  },
  //Base Components
  baseComponents: {
    language: false,
    fullscreen: false,
    search: false,
    shurtcuts: false,
    messages: false,
    notifications: true,
    chat: false,
    user: true,
    footer: false,
    playSound: false,
  }
};
